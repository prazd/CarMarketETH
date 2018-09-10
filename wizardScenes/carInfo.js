const instance = require('../settings/web3').instance,
      menuKeyboard = require('../settings/menuKeyboard').menuKeyboard,
      WizardScene = require("telegraf/scenes/wizard"),
      web3 = require('../settings/web3').web3;

const carInfo = new WizardScene(
    "carInfo", ctx=> {
    ctx.reply("Car ID:")
    return ctx.wizard.next()
},ctx=>{
        instance.methods.cars(Number(ctx.message.text)).call({from:web3.eth.accounts[2]},(err,doc)=>{
            if(err) throw err;
            ctx.reply("Car ID:"+ctx.message.text+"\n"+"1.Price: " + doc.price + "\n"
            + "2.Manufacturer: " + doc.manufacturer + "\n"
            + "3.Petrol cons. per mile: " + doc.petrolConsumptionPerMile + "\n"
            + "4.Signature: " + doc.signature + "\n"
            + "5.Presence: " + doc.presence, menuKeyboard)
        })
        ctx.scene.leave()
    }
)

module.exports.carInfo = carInfo