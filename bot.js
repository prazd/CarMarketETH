const Telegraf = require("telegraf"),
      Stage = require("telegraf/stage"),
      session = require("telegraf/session"),
      bot = new Telegraf(process.env("token")),
      addCar = require('./wizardScenes/addCar').addCar,
      buyCar = require('./wizardScenes/buyCar').buyCar,
      carInfo = require('./wizardScenes/carInfo').carInfo,
      botAct = require('./web3/botActions'),
      stage = new Stage();


bot.start(ctx => {
    botAct.Main(ctx); 
})

bot.action("balance",(ctx)=>{
   botAct.GetDealerBalance(ctx);
})

bot.action("number",(ctx)=>{
   botAct.GetNumberOfCar(ctx);
})


stage.register(buyCar)
stage.register(addCar)
stage.register(carInfo)

bot.use(session());
bot.use(stage.middleware());

bot.action("buy",ctx=>{ctx.scene.enter("buyCar")})
bot.action("add",ctx=>{ctx.scene.enter("addCar")})
bot.action("info",ctx=>{ctx.scene.enter("carInfo")})

bot.startPolling(); 