const Telegraf = require("telegraf"),
      Stage = require("telegraf/stage"),
      session = require("telegraf/session"),
      bot = new Telegraf(process.env('token')),
      instance = require('./settings/web3').instance,
      web3 = require('./settings/web3').web3,
      menuKeyboard = require('./settings/menuKeyboard').menuKeyboard,
      addCar = require('./wizardScenes/addCar').addCar,
      buyCar = require('./wizardScenes/buyCar').buyCar;


bot.start(ctx => {
    instance.methods.carDealer().call({from: web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Hello!!\nDealer address: " + doc, menuKeyboard)
})})

// Balance of dealer

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