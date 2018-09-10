const instance = require('../settings/web3').instance,
      web3 = require('../settings/web3').web3,
      menuKeyboard = require('../settings/menuKeyboard').menuKeyboard,
      WizardScene = require("telegraf/scenes/wizard"),
      Telegraf = require("telegraf");

        
const addCar = new WizardScene(
    "addCar",
    ctx => {
      ctx.reply("The default function is Add a car\nPlease Enter a car price");
      return ctx.wizard.next();
    },ctx=>{ctx.wizard.state.addSource = []
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a car Mark: ");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a model: ");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a config: ");
            return ctx.wizard.next();
        },ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a lpm: ");
            return ctx.wizard.next();},
        ctx=>{
                ctx.wizard.state.addSource.push(ctx.message.text)
                ctx.reply("Please Enter a signature: ");
                return ctx.wizard.next();
        },
        ctx=>{
                    ctx.wizard.state.addSource.push(ctx.message.text)
                    ctx.reply("Presence");
                    return ctx.wizard.next();
        },
        ctx=>{
            ctx.wizard.state.addSource.push(ctx.message.text)
            ctx.reply("Please Enter a gas price: ");
            return ctx.wizard.next();
        },
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
                        presence:Boolean(ctx.wizard.state.addSource[6])
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
        
                        ).send({from: doc, gas: 99999999999, gasPrice: ctx.wizard.state.addSource[7]})
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
module.exports.addCar = addCar
