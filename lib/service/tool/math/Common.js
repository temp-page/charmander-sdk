"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndParseAddress = exports.getTickToPrice = exports.tryParseTick = exports.tryParsePrice = exports.invariant = void 0;
const sdk_1 = require("../sdk");
const vo_1 = require("../../vo");
const utils_1 = require("../sdk/v3/utils");
const ethers_1 = require("ethers");
function invariant(state, errorMsg = 'ERROR') {
    if (!state) {
        throw new Error(errorMsg);
    }
}
exports.invariant = invariant;
function tryParsePrice(baseToken, quoteToken, value) {
    if (!baseToken || !quoteToken || !value) {
        return undefined;
    }
    if (!value.match(/^\d*\.?\d+$/)) {
        return undefined;
    }
    const [whole, fraction] = value.split('.');
    const decimals = fraction?.length ?? 0;
    const withoutDecimals = BigInt((whole ?? '') + (fraction ?? ''));
    return new sdk_1.Price(baseToken, quoteToken, BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals), withoutDecimals * BigInt(10 ** quoteToken.decimals));
}
exports.tryParsePrice = tryParsePrice;
function tryParseTick(baseToken, quoteToken, feeAmount, value) {
    if (!baseToken || !quoteToken || !feeAmount || !value) {
        return undefined;
    }
    const price = tryParsePrice(baseToken, quoteToken, value);
    if (!price) {
        return undefined;
    }
    let tick;
    // check price is within min/max bounds, if outside return min/max
    const sqrtRatioX96 = (0, utils_1.encodeSqrtRatioX96)(price.numerator, price.denominator);
    if (sqrtRatioX96 >= utils_1.TickMath.MAX_SQRT_RATIO) {
        tick = utils_1.TickMath.MAX_TICK;
    }
    else if (sqrtRatioX96 <= utils_1.TickMath.MIN_SQRT_RATIO) {
        tick = utils_1.TickMath.MIN_TICK;
    }
    else {
        // this function is agnostic to the base, will always return the correct tick
        tick = (0, utils_1.priceToClosestTick)(price);
    }
    return (0, utils_1.nearestUsableTick)(tick, vo_1.TICK_SPACINGS[feeAmount]);
}
exports.tryParseTick = tryParseTick;
function getTickToPrice(baseToken, quoteToken, tick) {
    if (!baseToken || !quoteToken || typeof tick !== 'number') {
        return undefined;
    }
    return (0, utils_1.tickToPrice)(baseToken, quoteToken, tick);
}
exports.getTickToPrice = getTickToPrice;
function validateAndParseAddress(address) {
    try {
        return (0, ethers_1.getAddress)(address);
    }
    catch (error) {
        invariant(false, `${address} is not a valid address.`);
    }
}
exports.validateAndParseAddress = validateAndParseAddress;
