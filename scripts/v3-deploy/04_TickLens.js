const contractDeployer = require("../common/contractDeployer");
const artifacts = {
    TickLensFactory: require("@uniswap/v3-periphery/artifacts/contracts/lens/TickLens.sol/TickLens.json"),
};

class TickLensDeployer {
    constructor(deployer) {
        this.deployer = deployer;
    }

    async deploy() {
        return await contractDeployer.deployContract(
            artifacts.TickLensFactory.abi,
            artifacts.TickLensFactory.bytecode,
            [],
            this.deployer
        );
    }

}

module.exports = { TickLensDeployer } ;
