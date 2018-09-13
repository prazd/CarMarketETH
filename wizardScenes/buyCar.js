const instance = require('../web3/web3').instance,
      menuKeyboard = require('../keyboards/menuKeyboard').menuKeyboard,
      WizardScene = require("telegraf/scenes/wizard"),
      BuyCar = require('../web3/botActions').BuyCar,
      No = require('../web3/botActions').ForNoAnswer

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
            BuyCar(ctx);
        }else if(ctx.message.text=="NO"){
            No(ctx);
        }
    ctx.scene.leave()
    }
)

module.exports = {
    buyCar:buyCar
}