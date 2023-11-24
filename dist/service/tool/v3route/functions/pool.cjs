"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOutputCurrency = getOutputCurrency;
exports.getTokenPrice = getTokenPrice;
exports.involvesCurrency = involvesCurrency;
var _v = require("../../sdk/v3/index.cjs");
function getOutputCurrency(pool, currencyIn) {
  const tokenIn = currencyIn.wrapped;
  const {
    token0,
    token1
  } = pool;
  return token0.equals(tokenIn) ? token1 : token0;
}
function getTokenPrice(pool, base, quote) {
  const {
    token0,
    token1,
    fee,
    liquidity,
    sqrtRatioX96,
    tick
  } = pool;
  const v3Pool = new _v.Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick);
  return v3Pool.priceOf(base.wrapped);
}
function involvesCurrency(pool, currency) {
  const token = currency.wrapped;
  const {
    token0,
    token1
  } = pool;
  return token0.equals(token) || token1.equals(token);
}