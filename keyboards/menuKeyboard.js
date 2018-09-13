const Markup = require("telegraf/markup"),
    menuKeyboard = Markup.inlineKeyboard([
       Markup.callbackButton("🚘","add"),
       Markup.callbackButton("💰","balance"),
       Markup.callbackButton("🚘💰","buy"),
       Markup.callbackButton("CarN","number"),
       Markup.callbackButton("CInfo","info")
     ]).extra()

module.exports = {
  menuKeyboard:menuKeyboard
}



