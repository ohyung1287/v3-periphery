const contractDeployer = require("../common/contractDeployer");
const artifacts = {
    QuoterV2Factory: require("@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"),
};

class QuoterV2Deployer {
    constructor(deployer) {
        this.deployer = deployer;
    }

    async deploy(factoryAddress, weth9Address) {
        return await contractDeployer.deployContract(
            artifacts.QuoterV2Factory.abi,
            artifacts.QuoterV2Factory.bytecode,
            [factoryAddress, weth9Address],
            this.deployer
        );
    }
}

module.exports = { QuoterV2Deployer } ;
