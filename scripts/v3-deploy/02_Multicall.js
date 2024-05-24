const contractDeployer = require("../common/contractDeployer");
const artifacts = {
    MultiCallFactory: require("@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json"),
};

class MultiCallDeployer {
    constructor(deployer) {
        this.deployer = deployer;
    }

    async deploy() {
        return await contractDeployer.deployContract(
            artifacts.MultiCallFactory.abi,
            artifacts.MultiCallFactory.bytecode,
            [],
            this.deployer
        );
    }

}

module.exports = { MultiCallDeployer } ;
