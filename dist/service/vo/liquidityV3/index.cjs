"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TICK_SPACINGS = exports.LiquidityListData = exports.LiquidityInfo = exports.FeeAmount = exports.AddLiquidityV3Info = void 0;
var FeeAmount = exports.FeeAmount = /* @__PURE__ */(FeeAmount2 => {
  FeeAmount2[FeeAmount2["LOWEST"] = 100] = "LOWEST";
  FeeAmount2[FeeAmount2["LOW"] = 500] = "LOW";
  FeeAmount2[FeeAmount2["MEDIUM"] = 2500] = "MEDIUM";
  FeeAmount2[FeeAmount2["HIGH"] = 1e4] = "HIGH";
  return FeeAmount2;
})(FeeAmount || {});
const TICK_SPACINGS = exports.TICK_SPACINGS = {
  [100 /* LOWEST */]: 1,
  [500 /* LOW */]: 10,
  [2500 /* MEDIUM */]: 50,
  [1e4 /* HIGH */]: 200
};
class AddLiquidityV3Info {
  poolState;
  token0;
  token1;
  token0Balance;
  token1Balance;
  // 会变化的数据
  // fee tier
  feeAmount;
  token0Amount = "";
  token1Amount = "";
  // Set Starting Price
  first;
  firstPrice;
  minPrice;
  maxPrice;
  pool;
  rate;
  // 无需关心的数据
  tickLower;
  tickUpper;
  tickData;
  updateFeeAmount;
  updateAllTickInfo;
  updateToken0;
  updateToken1;
  checkFirstPrice;
  updateFirstPrice;
  setPriceRange;
  setRate;
  addLiquidity;
}
exports.AddLiquidityV3Info = AddLiquidityV3Info;
class LiquidityListData {
  tokenId;
  token0;
  token1;
  feeAmount;
  minPrice;
  maxPrice;
  currentPrice;
  reverseCurrentPrice;
  reverseMinPrice;
  reverseMaxPrice;
  state;
  liquidity;
}
exports.LiquidityListData = LiquidityListData;
class LiquidityInfo extends LiquidityListData {
  token0Balance;
  token1Balance;
  token0Price;
  token1Price;
  token0USD;
  token1USD;
  liquidityUSD;
  apr;
  collectToken0;
  collectToken1;
  collectToken0USD;
  collectToken1USD;
  collectUSD;
  token0Amount;
  token1Amount;
  histories;
  collectFee;
  preRemoveLiquidity;
  removeLiquidity;
  preAddLiquidity;
  addLiquidity;
}
exports.LiquidityInfo = LiquidityInfo;