const abi = require("./contractData").CONTRACT_ABI,
      contractAddress = require("./contractData").CONTRACT_ADDRESS,
      Web3 = require('web3'),
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')),
      instance = new web3.eth.Contract(abi, contractAddress);

module.exports = {
    web3:web3,
    instance:instance
}
