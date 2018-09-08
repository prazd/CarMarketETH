const Telegraf = require("telegraf"); 
const Markup = require("telegraf/markup"); 
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");
const Scene = require("telegraf/scenes/base")
abi = require("./contractData").CONTRACT_ABI,
contractAddress = require("./contractData").CONTRACT_ADDRESS
const Web3 = require('web3')
const bot = new Telegraf('698889455:AAFs9dV1_yv95MP87-o5bmck_y4KKKoZ30w')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const instance = new web3.eth.Contract(abi, contractAddress);

const menuKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton("Buy car🚘💰","buy")
  ]).extra()

bot.start(ctx => {
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Hello!!\nDealer address: "+doc, menuKeyboard)
})})


const buyCar = new WizardScene(
    "buy", ctx=> {
    ctx.reply("Car ID:")
    return ctx.wizard.next()
},
    (ctx)=>{
        ctx.session.id = ctx.message.text
        ctx.reply("Value:")
        return ctx.wizard.next()
    },
    ctx =>{
        ctx.session.value = ctx.message.text
        ctx.reply("Check this info:\n1.CarID: " + ctx.session.id + "\n"
    +"2.Value:" + ctx.session.value)

    return ctx.wizard.next()    
    },
    ctx=>{
        if(ctx.message.text=="YES"){

                instance.methods.buyCar(Number(ctx.session.id)).send({from:"0x17F5B92ffC96A1A1BaFE4430A3Ae84A53B5DdA4d", value: Number(ctx.session.value), gas: 9999999999, gasPrice: 9999})
                .on('transactionHash', function(hash){
                    ctx.reply(`TX Hash: ${hash}`);
                })
                .on('receipt', function(receipt){
                    ctx.reply(`Car ID: ${receipt.events.BuyCar.returnValues.carID}`);
                    ctx.reply(`Car owner ID: ${receipt.events.BuyCar.returnValues.carOwnerID}`);
                    if (receipt.events.NewCarOwner) {
                        ctx.reply(`Car owner address: ${receipt.events.NewCarOwner.returnValues.carOwnerAddress}`);
                    }
                })
                .on('error', console.error);
        }else if(ctx.message.text=="NO"){
            ctx.reply(
                "Okay)\n", menuKeyboard
        )
        }
    ctx.scene.leave()
    }
)

const stage = new Stage([buyCar],{default:"buy"});
bot.use(session());
bot.use(stage.middleware());
bot.startPolling(); 