// const { BigNumber } = require('hardhat');
const {BigNumber} = require("ethers")
const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);

const FEE_AMOUNT = {
    LOW: 500,
    MEDIUM: 3000,
    HIGH: 10000,
};

const TICK_SPACINGS = {
    [FEE_AMOUNT.LOW]: 10,
    [FEE_AMOUNT.MEDIUM]: 60,
    [FEE_AMOUNT.HIGH]: 200,
};

const getSqrt = (reserve0, reserve1) => {
    const sqrtValue = (
        BigInt(reserve1.toString()) /
        BigInt(reserve0.toString())
      ).toString();
    
      const scaledValue = (
        BigInt(sqrtValue) *
        (BigInt(2) ** BigInt(96))
      ).toString();
    
      return BigInt(scaledValue);
}

const getSqrtPriceFromTick = (tick) => {
  const sqrtValue = (BigNumber.from(1.0001).pow(tick/2)).toString();
  return BigNumber.from(sqrtValue).mul(BigNumber.from(2).pow(96));
}

const compareToken = (a, b) => {
  return a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1;
}

const sortedTokens = (a, b) => {
  return compareToken(a, b) < 0 ? [a, b] : [b, a];
}

const getMinTick = (tickSpacing) => {
  return Math.ceil(-887272 / tickSpacing) * tickSpacing;
}

const getMaxTick = (tickSpacing) => {
  return Math.floor(887272 / tickSpacing) * tickSpacing;
}

const MIN_SQRT_RATIO = 4295128739;
const MAX_SQRT_RATIO = BigInt("1461446703485210103287273052203988822378723970342");

module.exports = { FEE_AMOUNT, TICK_SPACINGS, MAX_UINT128, MIN_SQRT_RATIO, MAX_SQRT_RATIO, getSqrt, sortedTokens, getMinTick, getMaxTick, getSqrtPriceFromTick }