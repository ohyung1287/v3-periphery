const { ethers } = require('hardhat');

async function deployContract(abi, bytecode, deployParams, actor) {
    const factory = new ethers.ContractFactory(abi, bytecode, actor);
    return await factory.deploy(...deployParams);
}

module.exports = { deployContract };