const Markup = require("telegraf/markup"),
    menuKeyboard = Markup.inlineKeyboard([
       Markup.callbackButton("Add🚘","add"),
       Markup.callbackButton("Balance💰","balance"),
       Markup.callbackButton("Buy🚘💰","buy"),
     ]).extra()
module.exports.menuKeyboard = menuKeyboard
