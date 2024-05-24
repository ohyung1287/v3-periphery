const { linkLibraries } = require("../common/linkLibraries");
const contractDeployer = require("../common/contractDeployer");
const constant = require("../common/const");
const { utils } = require("ethers");
const { ethers } = require('hardhat');
const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
    SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
    NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
   NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    ERC20: require("@uniswap/v2-core/build/ERC20.json"),
};

class UniswapV3Deployer {
    constructor(deployer) {
        this.deployer = deployer;
    }

    async deployFactory() {
        const V3FactoryDeployer = await ethers.getContractFactory("UniswapV3Factory");
        const V3Factory = await V3FactoryDeployer.deploy();
        return V3Factory
        // const V3Factory = await contractDeployer.deployContract(
        //     artifacts.UniswapV3Factory.abi,
        //     artifacts.UniswapV3Factory.bytecode,
        //     [],
        //     this.deployer
        // );
        // return V3Factory;
    }

    async SwapRouter(factoryAddress, weth9Address) {
        const SwapRouterDeployer = await ethers.getContractFactory("SwapRouter");
        const SwapRouter = await SwapRouterDeployer.deploy(factoryAddress, weth9Address);
        return SwapRouter;
        // return await contractDeployer.deployContract(
        //     artifacts.SwapRouter.abi,
        //     artifacts.SwapRouter.bytecode,
        //     [factoryAddress, weth9Address],
        //     this.deployer
        // );
    }

    async deployNFTDescriptorLibrary() {
        const NFTDescriptorDeployer = await ethers.getContractFactory("NFTDescriptor");
        const NFTDescriptor = await NFTDescriptorDeployer.deploy();
        return NFTDescriptor;
        // return await contractDeployer.deployContract(
        //     artifacts.NFTDescriptor.abi,
        //     artifacts.NFTDescriptor.bytecode,
        //     [],
        //     this.deployer
        // );
    }

    async deployPositionDescriptor(nftDescriptorLibraryAddress, weth9Address) {
        const linkedBytecode = linkLibraries(
            artifacts.NonfungibleTokenPositionDescriptor.bytecode,
            {
                "NFTDescriptor.sol": {
                    NFTDescriptor: [
                        {
                            length: 20,
                            start: 1681,
                        },
                    ],
                },
            },
            {
                NFTDescriptor: nftDescriptorLibraryAddress,
            }
        );
        return await contractDeployer.deployContract(
            artifacts.NonfungibleTokenPositionDescriptor.abi,
            linkedBytecode,
            [weth9Address, utils.formatBytes32String("TEST")],
            this.deployer
        );
        
    }

    async deployNonfungiblePositionManager(factoryAddress, weth9Address, positionDescriptorAddress) {
        const factory = await ethers.getContractFactory("NonfungiblePositionManager");
        return await factory.deploy(
            factoryAddress, weth9Address, positionDescriptorAddress
        );
    }

    async deployWETH9() {
        return await contractDeployer.deployContract(
          artifacts.WETH9.abi,
          artifacts.WETH9.bytecode,
          [],
          this.deployer
        );
      }

    async deployERC20(mintAmount){
        return await contractDeployer.deployContract(
            artifacts.ERC20.abi,
            artifacts.ERC20.bytecode,
            [mintAmount],
            this.deployer
        )
    }

    async deployERC20Custom(mintAmount, name, symbol){
        return await contractDeployer.deployContract(
            artifacts.ERC20Custom.abi,
            artifacts.ERC20Custom.bytecode,
            [mintAmount, name, symbol],
            this.deployer
        )
    }
}

module.exports = { UniswapV3Deployer } ;
