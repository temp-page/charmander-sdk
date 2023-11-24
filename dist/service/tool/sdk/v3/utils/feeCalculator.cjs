"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeeCalculator = void 0;
exports.getAmountsAtNewPrice = getAmountsAtNewPrice;
exports.getAmountsByLiquidityAndPrice = getAmountsByLiquidityAndPrice;
exports.getAverageLiquidity = getAverageLiquidity;
exports.getDependentAmount = getDependentAmount;
exports.getEstimatedLPFee = getEstimatedLPFee;
exports.getEstimatedLPFeeByAmounts = getEstimatedLPFeeByAmounts;
exports.getEstimatedLPFeeByAmountsWithProtocolFee = getEstimatedLPFeeByAmountsWithProtocolFee;
exports.getEstimatedLPFeeWithProtocolFee = getEstimatedLPFeeWithProtocolFee;
exports.getLiquidityByAmountsAndPrice = getLiquidityByAmountsAndPrice;
exports.getLiquidityBySingleAmount = getLiquidityBySingleAmount;
exports.getLiquidityFromSqrtRatioX96 = getLiquidityFromSqrtRatioX96;
exports.getLiquidityFromTick = getLiquidityFromTick;
exports.parseNumberToFraction = parseNumberToFraction;
var _internalConstants = require("../internalConstants.cjs");
var _fractions = require("../../fractions/index.cjs");
var _constants = require("../../constants.cjs");
var _Common = require("../../../math/Common.cjs");
var _tick = require("../tick.cjs");
var _tickList = require("./tickList.cjs");
var _positionMath = require("./positionMath.cjs");
var _tickMath = require("./tickMath.cjs");
var _maxLiquidityForAmounts = require("./maxLiquidityForAmounts.cjs");
const FeeCalculator = exports.FeeCalculator = {
  getEstimatedLPFee,
  getEstimatedLPFeeByAmounts,
  getLiquidityFromTick,
  getLiquidityFromSqrtRatioX96,
  getAverageLiquidity,
  getLiquidityBySingleAmount,
  getDependentAmount,
  getLiquidityByAmountsAndPrice,
  getAmountsByLiquidityAndPrice,
  getAmountsAtNewPrice
};
function parseNumberToFraction(num, precision = 6) {
  if (Number.isNaN(num) || !Number.isFinite(num)) return void 0;
  const scalar = 10 ** precision;
  return new _fractions.Fraction(BigInt(Math.floor(num * scalar)), BigInt(scalar));
}
function getEstimatedLPFeeWithProtocolFee({
  amount,
  currency,
  ...rest
}) {
  return getEstimatedLPFeeByAmountsWithProtocolFee({
    ...rest,
    amountA: amount,
    amountB: _fractions.CurrencyAmount.fromRawAmount(currency, _constants.MaxUint256)
  });
}
function getEstimatedLPFee({
  amount,
  currency,
  ...rest
}) {
  return getEstimatedLPFeeByAmounts({
    ...rest,
    amountA: amount,
    amountB: _fractions.CurrencyAmount.fromRawAmount(currency, _constants.MaxUint256)
  });
}
function getEstimatedLPFeeByAmountsWithProtocolFee(options) {
  try {
    return tryGetEstimatedLPFeeByAmounts(options);
  } catch (e) {
    console.error(e);
    return new _fractions.Fraction(_constants.ZERO);
  }
}
function getEstimatedLPFeeByAmounts({
  protocolFee = _internalConstants.ZERO_PERCENT,
  ...rest
}) {
  try {
    const fee = tryGetEstimatedLPFeeByAmounts(rest);
    return _internalConstants.ONE_HUNDRED_PERCENT.subtract(protocolFee).multiply(fee).asFraction;
  } catch (e) {
    console.error(e);
    return new _fractions.Fraction(_constants.ZERO);
  }
}
function tryGetEstimatedLPFeeByAmounts({
  amountA,
  amountB,
  volume24H,
  sqrtRatioX96,
  tickLower,
  tickUpper,
  mostActiveLiquidity,
  fee,
  insidePercentage = _internalConstants.ONE_HUNDRED_PERCENT
}) {
  (0, _Common.invariant)(!Number.isNaN(fee) && fee >= 0, "INVALID_FEE");
  const tickCurrent = _tickMath.TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  if (tickCurrent < tickLower || tickCurrent > tickUpper) return new _fractions.Fraction(_constants.ZERO);
  const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice({
    amountA,
    amountB,
    tickUpper,
    tickLower,
    sqrtRatioX96
  });
  const volumeInFraction = parseNumberToFraction(volume24H) || new _fractions.Fraction(_constants.ZERO);
  return insidePercentage.multiply(volumeInFraction.multiply(BigInt(fee)).multiply(liquidity)).divide(_internalConstants.MAX_FEE * (liquidity + mostActiveLiquidity)).asFraction;
}
function getDependentAmount(options) {
  const {
    currency,
    amount,
    sqrtRatioX96,
    tickLower,
    tickUpper
  } = options;
  const currentTick = _tickMath.TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  const liquidity = FeeCalculator.getLiquidityBySingleAmount(options);
  const isToken0 = currency.wrapped.sortsBefore(amount.currency.wrapped);
  const getTokenAmount = isToken0 ? _positionMath.PositionMath.getToken0Amount : _positionMath.PositionMath.getToken1Amount;
  return _fractions.CurrencyAmount.fromRawAmount(currency, getTokenAmount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity));
}
function getLiquidityBySingleAmount({
  amount,
  currency,
  ...rest
}) {
  return getLiquidityByAmountsAndPrice({
    amountA: amount,
    amountB: _fractions.CurrencyAmount.fromRawAmount(currency, _constants.MaxUint256),
    ...rest
  });
}
function getLiquidityByAmountsAndPrice({
  amountA,
  amountB,
  tickUpper,
  tickLower,
  sqrtRatioX96
}) {
  const isToken0 = amountA.currency.wrapped.sortsBefore(amountB.currency.wrapped);
  const [inputAmount0, inputAmount1] = isToken0 ? [amountA.quotient, amountB.quotient] : [amountB.quotient, amountA.quotient];
  const sqrtRatioAX96 = _tickMath.TickMath.getSqrtRatioAtTick(tickLower);
  const sqrtRatioBX96 = _tickMath.TickMath.getSqrtRatioAtTick(tickUpper);
  return (0, _maxLiquidityForAmounts.maxLiquidityForAmounts)(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true);
}
function getAmountsByLiquidityAndPrice(options) {
  const {
    currencyA,
    currencyB,
    liquidity,
    sqrtRatioX96,
    tickLower,
    tickUpper
  } = options;
  const currentTick = _tickMath.TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
  const adjustedAmount0 = _positionMath.PositionMath.getToken0Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity);
  const adjustedAmount1 = _positionMath.PositionMath.getToken1Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity);
  return [_fractions.CurrencyAmount.fromRawAmount(currencyA, isToken0 ? adjustedAmount0 : adjustedAmount1), _fractions.CurrencyAmount.fromRawAmount(currencyB, isToken0 ? adjustedAmount1 : adjustedAmount0)];
}
function getAmountsAtNewPrice({
  newSqrtRatioX96,
  ...rest
}) {
  const {
    tickLower,
    tickUpper,
    amountA,
    amountB
  } = rest;
  const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice(rest);
  return FeeCalculator.getAmountsByLiquidityAndPrice({
    liquidity,
    currencyA: amountA.currency,
    currencyB: amountB.currency,
    tickLower,
    tickUpper,
    sqrtRatioX96: newSqrtRatioX96
  });
}
function getAverageLiquidity(ticks, tickSpacing, tickLower, tickUpper) {
  (0, _Common.invariant)(tickLower <= tickUpper, "INVALID_TICK_RANGE");
  _tickList.TickList.validateList(ticks, tickSpacing);
  if (tickLower === tickUpper) return FeeCalculator.getLiquidityFromTick(ticks, tickLower);
  const lowerOutOfBound = tickLower < ticks[0].index;
  let lastTick = lowerOutOfBound ? new _tick.Tick({
    index: _tickMath.TickMath.MIN_TICK,
    liquidityNet: _constants.ZERO,
    liquidityGross: _constants.ZERO
  }) : _tickList.TickList.nextInitializedTick(ticks, tickLower, true);
  let currentTick = _tickList.TickList.nextInitializedTick(ticks, tickLower, false);
  let currentL = lowerOutOfBound ? _constants.ZERO : FeeCalculator.getLiquidityFromTick(ticks, currentTick.index);
  let weightedL = _constants.ZERO;
  const getWeightedLFromLastTickTo = toTick => currentL * BigInt(toTick - Math.max(lastTick.index, tickLower));
  while (currentTick.index < tickUpper) {
    weightedL += getWeightedLFromLastTickTo(currentTick.index);
    currentL += currentTick.liquidityNet;
    lastTick = currentTick;
    if (currentTick.index === ticks[ticks.length - 1].index) break;
    currentTick = _tickList.TickList.nextInitializedTick(ticks, currentTick.index, false);
  }
  weightedL += getWeightedLFromLastTickTo(tickUpper);
  return weightedL / BigInt(tickUpper - tickLower);
}
function getLiquidityFromSqrtRatioX96(ticks, sqrtRatioX96) {
  const tick = _tickMath.TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  return FeeCalculator.getLiquidityFromTick(ticks, tick);
}
function getLiquidityFromTick(ticks, tick) {
  let liquidity = _constants.ZERO;
  if (!ticks?.length) return liquidity;
  if (tick < ticks[0].index || tick > ticks[ticks.length - 1].index) return liquidity;
  for (let i = 0; i < ticks.length - 1; ++i) {
    liquidity += ticks[i].liquidityNet;
    const lowerTick = ticks[i].index;
    const upperTick = ticks[i + 1]?.index;
    if (lowerTick <= tick && tick <= upperTick) break;
  }
  return liquidity;
}