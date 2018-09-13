const instance = require('./web3').instance,
      web3 = require('./web3').web3
      menuKeyboard = require('../keyboards/menuKeyboard').menuKeyboard
      

async function Main(ctx){
    instance.methods.carDealer().call({from: web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Hello!!\nDealer address: " + doc, menuKeyboard)
    })
}

async function GetDealerBalance(ctx){
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        web3.eth.getBalance(doc).then(balance=>{
            ctx.editMessageText("Dealer address: "+ doc +"\nDealer balance: "+ balance, menuKeyboard)})
    })
}

async function GetNumberOfCar(ctx){
    instance.methods.carCount().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.editMessageText("Number of cars: "+ doc, menuKeyboard)
    })
}

async function CheckMaxNumber(number){
    instance.methods.carCount().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        if(Number(number) > doc){
            CarInfoByID(number);
        }else{
            
        }
    })
}

// For wizards scenes

// AddCar
async function AddCar(ctx , car){
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
}


// buyCar

async function BuyCar(ctx){
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
}

// carInfo
async function CarInfoByID(ctx, number){
    instance.methods.carCount().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        if(Number(number) <= doc){
          instance.methods.cars(Number(ctx.message.text)).call({from:web3.eth.accounts[2]},(err,doc)=>{
                if(err) throw err;
                ctx.reply("Car ID:"+ctx.message.text+"\n"+"1.Price: " + doc.price + "\n"
                + "2.Manufacturer: " + doc.manufacturer + "\n"
                + "3.Petrol cons. per mile: " + doc.petrolConsumptionPerMile + "\n"
                + "4.Signature: " + doc.signature + "\n"
                + "5.Presence: " + doc.presence, menuKeyboard)
            })
        }else{
            instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
                if(err) throw err;
                ctx.reply("Bad Car ID!\n Please ty again\n Dealer: " + doc, menuKeyboard)
               })
        }
    })
}

// For 'NO' answer
async function ForNoAnswer(ctx){
    instance.methods.carDealer().call({from:web3.eth.accounts[2]},(err,doc)=>{
        if(err) throw err;
        ctx.reply("Try again!!\nDealer address: " + doc, menuKeyboard)
       })
}

module.exports = {
    Main:Main,
    GetDealerBalance:GetDealerBalance,
    GetNumberOfCar:GetNumberOfCar,
    AddCar:AddCar,
    ForNoAnswer:ForNoAnswer,
    BuyCar:BuyCar,
    CarInfoByID:CarInfoByID
}