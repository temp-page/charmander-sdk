"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionMath = void 0;
var _internalConstants = require("../internalConstants.cjs");
var _tickMath = require("./tickMath.cjs");
var _sqrtPriceMath = require("./sqrtPriceMath.cjs");
function getToken0Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower) {
    return _sqrtPriceMath.SqrtPriceMath.getAmount0Delta(_tickMath.TickMath.getSqrtRatioAtTick(tickLower), _tickMath.TickMath.getSqrtRatioAtTick(tickUpper), liquidity, false);
  }
  if (tickCurrent < tickUpper) return _sqrtPriceMath.SqrtPriceMath.getAmount0Delta(sqrtRatioX96, _tickMath.TickMath.getSqrtRatioAtTick(tickUpper), liquidity, false);
  return _internalConstants.ZERO;
}
function getToken1Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower) return _internalConstants.ZERO;
  if (tickCurrent < tickUpper) return _sqrtPriceMath.SqrtPriceMath.getAmount1Delta(_tickMath.TickMath.getSqrtRatioAtTick(tickLower), sqrtRatioX96, liquidity, false);
  return _sqrtPriceMath.SqrtPriceMath.getAmount1Delta(_tickMath.TickMath.getSqrtRatioAtTick(tickLower), _tickMath.TickMath.getSqrtRatioAtTick(tickUpper), liquidity, false);
}
const PositionMath = exports.PositionMath = {
  getToken0Amount,
  getToken1Amount
};