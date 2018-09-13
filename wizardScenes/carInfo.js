const WizardScene = require("telegraf/scenes/wizard"),
      CarInfo = require('../web3/botActions').CarInfoByID;

const carInfo = new WizardScene(
    "carInfo", ctx=> {
    ctx.reply("Car ID:");
    return ctx.wizard.next();
}, ctx=>{
      CarInfo(ctx, ctx.message.text);
      ctx.scene.leave();
    }
)

module.exports = {
    carInfo:carInfo
}