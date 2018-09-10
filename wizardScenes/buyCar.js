const instance = require('../settings/web3').instance,
      menuKeyboard = require('../settings/menuKeyboard').menuKeyboard,
      WizardScene = require("telegraf/scenes/wizard");

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

module.exports.buyCar = buyCar