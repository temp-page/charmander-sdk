"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.priceToClosestTick = priceToClosestTick;
exports.tickToPrice = tickToPrice;
var _internalConstants = require("../internalConstants.cjs");
var _fractions = require("../../fractions/index.cjs");
var _encodeSqrtRatioX = require("./encodeSqrtRatioX96.cjs");
var _tickMath = require("./tickMath.cjs");
function tickToPrice(baseToken, quoteToken, tick) {
  const sqrtRatioX96 = _tickMath.TickMath.getSqrtRatioAtTick(tick);
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96;
  return baseToken.sortsBefore(quoteToken) ? new _fractions.Price(baseToken, quoteToken, _internalConstants.Q192, ratioX192) : new _fractions.Price(baseToken, quoteToken, ratioX192, _internalConstants.Q192);
}
function priceToClosestTick(price) {
  const sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  const sqrtRatioX96 = sorted ? (0, _encodeSqrtRatioX.encodeSqrtRatioX96)(price.numerator, price.denominator) : (0, _encodeSqrtRatioX.encodeSqrtRatioX96)(price.denominator, price.numerator);
  let tick = _tickMath.TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  const nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);
  if (sorted) {
    if (!price.lessThan(nextTickPrice)) tick++;
  } else if (!price.greaterThan(nextTickPrice)) {
    tick++;
  }
  return tick;
}