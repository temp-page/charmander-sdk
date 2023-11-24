"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maxLiquidityForAmounts = maxLiquidityForAmounts;
var _internalConstants = require("../internalConstants.cjs");
function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  const intermediate = sqrtRatioAX96 * sqrtRatioBX96 / _internalConstants.Q96;
  return BigInt(amount0) * intermediate / (sqrtRatioBX96 - sqrtRatioAX96);
}
function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  const numerator = BigInt(amount0) * sqrtRatioAX96 * sqrtRatioBX96;
  const denominator = _internalConstants.Q96 * (sqrtRatioBX96 - sqrtRatioAX96);
  if (denominator === 0n) return 0n;
  return numerator / denominator;
}
function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  if (sqrtRatioBX96 - sqrtRatioAX96 === 0n) return 0n;
  return BigInt(amount1) * _internalConstants.Q96 / (sqrtRatioBX96 - sqrtRatioAX96);
}
function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  const maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;
  if (sqrtRatioCurrentX96 <= sqrtRatioAX96) return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  if (sqrtRatioCurrentX96 < sqrtRatioBX96) {
    const liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    const liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return liquidity0 < liquidity1 ? liquidity0 : liquidity1;
  }
  return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
}