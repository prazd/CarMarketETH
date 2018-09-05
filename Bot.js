const Telegraf = require("telegraf"); 
const Markup = require("telegraf/markup"); 
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");
abi = require("./contractData").CONTRACT_ABI,
contractAddress = require("./contractData").CONTRACT_ADDRESS

const Web3 = require('web3')

const bot = new Telegraf('698889455:AAFs9dV1_yv95MP87-o5bmck_y4KKKoZ30w')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const instance = new web3.eth.Contract(abi, contractAddress);

bot.start(ctx => {
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Hello!!\nDealer address: "+doc,Markup.inlineKeyboard([
          Markup.callbackButton("Buy Car 🚘💰","buy"),
          Markup.callbackButton("Add","add"),
          Markup.callbackButton("Check B","balance"),
        ]).extra())})
  })
const currencyConverter = new WizardScene(
    "add",
    ctx => {
      ctx.reply("The default function is Add a car\nPlease Enter a car price");
      return ctx.wizard.next();
    },ctx=>{ctx.wizard.state.currencySource = []
            ctx.wizard.state.currencySource.push(ctx.message.text)
            ctx.reply("Please Enter a car Mark");
            console.log(ctx.wizard.state.currencySource)
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.currencySource.push(ctx.message.text)
            ctx.reply("Please Enter a car");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.currencySource.push(ctx.message.text)
            ctx.reply("Check this :" + String(ctx.wizard.state.currencySource), Markup.inlineKeyboard([
                Markup.callbackButton("YES","YES"),
                Markup.callbackButton("NO","NO"),
            ]).extra())
            return ctx.scene.leave();
    }
)
    
bot.action("NO",(ctx)=>{
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Okay)TryAgain!!!\nDealer address: "+doc,Markup.inlineKeyboard([
          Markup.callbackButton("Buy Car 🚘💰","buy"),
          Markup.callbackButton("Add","add"),
          Markup.callbackButton("Check B","balance"),
        ]).extra())})
})
bot.action("YES",(ctx)=>{
    ctx.reply("Commin soon")
})


const stage = new Stage([currencyConverter], { default: "add" });
bot.use(session());
bot.use(stage.middleware());
bot.startPolling(); 