const { ethers } = require('hardhat');
const constant = require('./common/const')
const {TickMath} = require('@uniswap/v3-sdk')
const { UniswapV3Deployer } = require('./v3-deploy/01_Core');

let FEE_AMOUNT;
const TICK_LOWER = constant.getMinTick(constant.FEE_AMOUNT.MEDIUM);
const TICK_UPPER = constant.getMaxTick(constant.FEE_AMOUNT.MEDIUM);
const AMOUNT_0_DESIRED = BigInt(5) * BigInt(10 ** 18);
const AMOUNT_1_DESIRED = BigInt(5) * BigInt(10 ** 18);
const AMOUNT_0_MIN = BigInt(0) * BigInt(10 ** 18);
const AMOUNT_1_MIN = BigInt(0) * BigInt(10 ** 18);

async function main() {
  const [signer] = await ethers.getSigners();

  const currentBlockTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
  deadline = Math.floor(currentBlockTimestamp) + 60 * 20;
  // const gasPrice = await signer.getGasPrice();
  // const Token1Contract = new ethers.Contract(addressBook[tokenSymbol], artifacts.ERC20, signer);
  // const Token2Contract = new ethers.Contract(addressBook[tokenSymbol2], artifacts.ERC20, signer);
  [Token1Contract, Token2Contract, V3Factory, NFTDescriptor, PositionDescriptor, NFTPositionManager, SwapRouter] = 
    await deployUniswapV3(signer);
  
  this.tokenPair = constant.sortedTokens(Token1Contract, Token2Contract);
  console.log("Token1Contract approving...")

  await Token1Contract.approve(
    NFTPositionManager.address, AMOUNT_0_DESIRED * 3n
  );
  console.log("Token1Contract approved")

  await Token2Contract.approve(
    NFTPositionManager.address, AMOUNT_1_DESIRED * 3n
  );

  const balance = await Token1Contract.balanceOf(signer.address);
  console.log("Balance of ERC20 second deployer is:", balance);
  const balance2 = await Token2Contract.balanceOf(signer.address);
  console.log("Balance of CTCERC20 second deployer is:", balance2);

  console.log("Txn still on the way")
  FEE_AMOUNT = constant.FEE_AMOUNT.MEDIUM;
  const sqrt = TickMath.getSqrtRatioAtTick(10); 
  const tx = await NFTPositionManager.createAndInitializePoolIfNecessary(
    this.tokenPair[0].address, this.tokenPair[1].address, FEE_AMOUNT, sqrt.toString()
  );
  await tx.wait();
  const poolAddress = await V3Factory.getPool(this.tokenPair[0].address, this.tokenPair[1].address, FEE_AMOUNT)
  console.log("Pool address: ", poolAddress);
  // console.log(
//   FEE_AMOUNT, 
//   -8872700, 8872700, AMOUNT_0_DESIRED, AMOUNT_1_DESIRED, AMOUNT_0_MIN, AMOUNT_1_MIN)
  
  const pool = await ethers.getContractAt("UniswapV3Pool", poolAddress, signer);
  const txn = await NFTPositionManager.mint(
    [this.tokenPair[0].address, this.tokenPair[1].address, 
    FEE_AMOUNT, TICK_LOWER, TICK_UPPER, AMOUNT_0_DESIRED.toString(), AMOUNT_1_DESIRED.toString(), AMOUNT_0_MIN.toString(), AMOUNT_1_MIN.toString(), 
    signer.address, Math.floor(currentBlockTimestamp) + 60 * 20]
  );
  
//   await txn.wait();
//   console.log(`Transaction successful: ${txn.hash}`);
}
main();

async function deployUniswapV3(signer){
  console.log("Deploying with address:", signer.address)
  const v3Deployer = new UniswapV3Deployer(signer);
  this.WETH9 = await v3Deployer.deployERC20(BigInt(1_000_000_000 * 10**18))
  this.ERC20 = await v3Deployer.deployERC20(BigInt(1_000_000_000 * 10**18));
  console.log(`WETH: ${this.WETH9.address}`);
  console.log(`ERC20: ${this.ERC20.address}`);
  const V3Factory = await v3Deployer.deployFactory();
  const NFTDescriptor = await v3Deployer.deployNFTDescriptorLibrary();
  const PositionDescriptor = await v3Deployer.deployPositionDescriptor(NFTDescriptor.address, WETH9.address);
  const NFTPositionManager = await v3Deployer.deployNonfungiblePositionManager(V3Factory.address, WETH9.address, PositionDescriptor.address);
  const SwapRouter = await v3Deployer.SwapRouter(V3Factory.address, this.WETH9.address);
  console.log(`V3Factory: ${V3Factory.address}`);
  console.log(`NFTManager: ${NFTPositionManager.address}`);
  console.log(`V3SwapRouter: ${SwapRouter.address}`);
  return [this.WETH9, this.ERC20, V3Factory, NFTDescriptor, PositionDescriptor, NFTPositionManager, SwapRouter]
}  