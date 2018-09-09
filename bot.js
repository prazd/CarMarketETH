const Telegraf = require("telegraf"); 
const Markup = require("telegraf/markup"); 
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");
abi = require("./contractData").CONTRACT_ABI,
contractAddress = require("./contractData").CONTRACT_ADDRESS
const Web3 = require('web3')
const bot = new Telegraf(process.env('token'))
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const instance = new web3.eth.Contract(abi, contractAddress);

const menuKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton("Add🚘","add"),
    Markup.callbackButton("Balance💰","balance"),
    Markup.callbackButton("Buy🚘💰","buy"),
  ]).extra()

bot.start(ctx => {
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Hello!!\nDealer address: " + doc, menuKeyboard)
})})


const addCar = new WizardScene(
    "addCar",
    ctx => {
      ctx.reply("The default function is Add a car\nPlease Enter a car price");
      return ctx.wizard.next();
    },ctx=>{ctx.wizard.state.addSource = []
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a car Mark");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a model");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a config");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a lpm");
            return ctx.wizard.next();},
        ctx=>{
                ctx.wizard.state.addSource.push(ctx.message.text)
                ctx.reply("Please Enter a signature");
                return ctx.wizard.next();},
        ctx=>{
                    ctx.wizard.state.addSource.push(ctx.message.text)
                    ctx.reply("Presence");
                    return ctx.wizard.next();},
        ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply(
                "Check this:\n" + "1.Car price: "+ ctx.wizard.state.addSource[0] + "\n" + 
                "2.Car manufacturer: " + ctx.wizard.state.addSource[1] +  "\n" + 
                "3. "+ctx.wizard.state.addSource[1] + " model: " + ctx.wizard.state.addSource[2] + "\n" + 
                "4.Car config: " + ctx.wizard.state.addSource[3] +  "\n" + 
                "5.Petrol cons. per mile: " + ctx.wizard.state.addSource[4] +  "\n" + 
                "6.Signature: " + ctx.wizard.state.addSource[5] +  "\n" + 
                "7.Presence: " + ctx.wizard.state.addSource[6] + "\n" 
            )
            const aboutMenu = Telegraf.Extra
                     .markdown()
                     .markup((m) => m.keyboard([
                     m.callbackButton('YES'),
                     m.callbackButton('NO')
                     ]).resize());
            ctx.reply("if you agree?\nSend 'YES' or 'NO'", aboutMenu)
            return ctx.wizard.next();

       }, ctx=>{

           if(ctx.message.text==="NO"){
                instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
                    if(err) throw err;
                    ctx.reply("Okay)TryAgain!!!\nDealer address: "+doc, menuKeyboard)  
            })

            }else if(ctx.message.text==="YES") {

                    let car = {
                        price:Number(ctx.wizard.state.addSource[0]),
                        manufacturer:ctx.wizard.state.addSource[1],
                        model:ctx.wizard.state.addSource[2],
                        config:Number(ctx.wizard.state.addSource[3]),
                        petrolConsumptionPerMile:Number(ctx.wizard.state.addSource[4]),
                        signature:web3.utils.keccak256(web3.utils.stringToHex(ctx.wizard.state.addSource[5])),
                        presence:Boolean(ctx.wizard.state.addSource[5])
                    }
                    
                    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
                        if(err) throw err;
                        instance.methods.addCar(
                            car.price,
                            car.manufacturer,
                            car.model,
                            car.config,
                            car.petrolConsumptionPerMile,
                            car.signature,
                            car.presence
        
                        ).send({from: doc, gas: 99999999999, gasPrice: 9999})
                            .on('transactionHash', function(hash){
                            ctx.reply(`Tx Hash: ${hash}`)
                            })
                            .on('receipt', function(receipt){
                                ctx.reply(`Car Dealer: ${receipt.events.AddCar.returnValues.carDealer}`);
                                ctx.reply(`Car ID: ${receipt.events.AddCar.returnValues.carID}`);
                                ctx.reply("Car was add succesfull", menuKeyboard)
                            })
                            .on('error', console.error);
                })
                 } else {
                 instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
                 if(err) throw err;
                 ctx.reply("Try again!!\nDealer address: " + doc, menuKeyboard)
                })
            }
            return ctx.scene.leave();})

bot.action("NO",(ctx)=>{
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Okay)TryAgain!!!\nDealer address: "+doc, menuKeyboard)})
})



const buyCar = new WizardScene(
    "buyCar", ctx=> {
    ctx.reply("Car ID:")
    return ctx.wizard.next()
},
    (ctx)=>{
        ctx.session.id = ctx.message.text
        ctx.reply("Price:")
        return ctx.wizard.next()
    },
    ctx =>{
        ctx.session.value = ctx.message.text
        ctx.reply("Enter your public key(hex): ")
    return ctx.wizard.next()    
    },  ctx =>{
        ctx.session.key = ctx.message.text
        ctx.reply("Enter gas Price:")
    return ctx.wizard.next()    
    },
    ctx =>{
        ctx.session.gasPrice = ctx.message.text
        ctx.reply("Check this info:\n1.CarID: " + ctx.session.id + "\n"
    +"2.Value:" + ctx.session.value + "\n"+"3.Public key(hex): " + ctx.session.key +"\n"+
     "4.Gas Price: " + ctx.session.gasPrice)

    return ctx.wizard.next()    
    },
    ctx=>{
        if(ctx.message.text=="YES"){

                instance.methods.buyCar(Number(ctx.session.id)).send({from:ctx.session.key, value: Number(ctx.session.value), gas: 9999999999, gasPrice: ctx.session.gasPrice})
                .on('transactionHash', function(hash){
                    ctx.reply(`TX Hash: ${hash}`);
                })
                .on('receipt', function(receipt){
                    ctx.reply(`Car ID: ${receipt.events.BuyCar.returnValues.carID}`);
                    ctx.reply(`Car owner ID: ${receipt.events.BuyCar.returnValues.carOwnerID}`);
                    if (receipt.events.NewCarOwner) {
                        ctx.reply(`Car owner address: ${receipt.events.NewCarOwner.returnValues.carOwnerAddress}`);
                    }
                    ctx.reply("Nice trade)",menuKeyboard)
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

bot.action("balance",(ctx)=>{
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        web3.eth.getBalance(doc).then(balance=>{
            ctx.editMessageText("Dealer address: "+ doc +"\nBalance: "+ balance, menuKeyboard)})
        })
})

const stage = new Stage();
stage.register(buyCar)
stage.register(addCar)
bot.use(session());
bot.use(stage.middleware());
bot.action("buy",ctx=>{ctx.scene.enter("buyCar")})
bot.action("add",ctx=>{ctx.scene.enter("addCar")})
bot.startPolling(); 