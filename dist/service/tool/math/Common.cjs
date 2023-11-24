"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENDLESS = void 0;
exports.computeSurroundingTicks = computeSurroundingTicks;
exports.getTickToPrice = getTickToPrice;
exports.invariant = invariant;
exports.tickToPriceString = tickToPriceString;
exports.tryParsePrice = tryParsePrice;
exports.tryParseTick = tryParseTick;
exports.validateAndParseAddress = validateAndParseAddress;
var _ethers = require("ethers");
var _sdk = require("../sdk/index.cjs");
var _vo = require("../../vo/index.cjs");
var _utils = require("../sdk/v3/utils/index.cjs");
function invariant(state, errorMsg = "ERROR") {
  if (!state) throw new Error(errorMsg);
}
const ENDLESS = exports.ENDLESS = "\u221E";
function tryParsePrice(baseToken, quoteToken, value) {
  if (!baseToken || !quoteToken || !value) return void 0;
  if (!value.match(/^\d*\.?\d+$/)) return void 0;
  const [whole, fraction] = value.split(".");
  const decimals = fraction?.length ?? 0;
  const withoutDecimals = BigInt((whole ?? "") + (fraction ?? ""));
  return new _sdk.Price(baseToken, quoteToken, BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals), withoutDecimals * BigInt(10 ** quoteToken.decimals));
}
function tryParseTick(baseToken, quoteToken, feeAmount, value) {
  if (!baseToken || !quoteToken || !feeAmount || !value) return void 0;
  const price = tryParsePrice(baseToken, quoteToken, value);
  if (!price) return void 0;
  let tick;
  const sqrtRatioX96 = (0, _utils.encodeSqrtRatioX96)(price.numerator, price.denominator);
  if (sqrtRatioX96 >= _utils.TickMath.MAX_SQRT_RATIO) {
    tick = _utils.TickMath.MAX_TICK;
  } else if (sqrtRatioX96 <= _utils.TickMath.MIN_SQRT_RATIO) {
    tick = _utils.TickMath.MIN_TICK;
  } else {
    tick = (0, _utils.priceToClosestTick)(price);
  }
  return (0, _utils.nearestUsableTick)(tick, _vo.TICK_SPACINGS[feeAmount]);
}
function getTickToPrice(baseToken, quoteToken, tick) {
  if (!baseToken || !quoteToken || typeof tick !== "number") return void 0;
  return (0, _utils.tickToPrice)(baseToken, quoteToken, tick);
}
function validateAndParseAddress(address) {
  try {
    return (0, _ethers.getAddress)(address);
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}
function computeSurroundingTicks(token0, token1, activeTickProcessed, sortedTickData, pivot, ascending) {
  let previousTickProcessed = {
    ...activeTickProcessed
  };
  let processedTicks = [];
  for (let i = pivot + (ascending ? 1 : -1); ascending ? i < sortedTickData.length : i >= 0; ascending ? i++ : i--) {
    const tick = Number(sortedTickData[i].tick);
    const currentTickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: BigInt(sortedTickData[i].liquidityNet),
      price0: (0, _utils.tickToPrice)(token0, token1, tick).toFixed()
    };
    if (ascending) {
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive + BigInt(sortedTickData[i].liquidityNet);
    } else if (!ascending && previousTickProcessed.liquidityNet !== 0n) {
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive - previousTickProcessed.liquidityNet;
    }
    processedTicks.push(currentTickProcessed);
    previousTickProcessed = currentTickProcessed;
  }
  if (!ascending) processedTicks = processedTicks.reverse();
  return processedTicks;
}
function tickToPriceString(token0, token1, feeAmount, tick) {
  const min = (0, _utils.nearestUsableTick)(_utils.TickMath.MIN_TICK, _vo.TICK_SPACINGS[feeAmount]);
  const max = (0, _utils.nearestUsableTick)(_utils.TickMath.MAX_TICK, _vo.TICK_SPACINGS[feeAmount]);
  if (tick === min) return "0";
  if (tick === max) return ENDLESS;
  return (0, _utils.tickToPrice)(token0, token1, tick).toFixed();
}