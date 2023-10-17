"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceToClosestTick = exports.tickToPrice = void 0;
const internalConstants_1 = require("../internalConstants");
const encodeSqrtRatioX96_1 = require("./encodeSqrtRatioX96");
const tickMath_1 = require("./tickMath");
const fractions_1 = require("../../fractions");
/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
function tickToPrice(baseToken, quoteToken, tick) {
    const sqrtRatioX96 = tickMath_1.TickMath.getSqrtRatioAtTick(tick);
    const ratioX192 = sqrtRatioX96 * sqrtRatioX96;
    return baseToken.sortsBefore(quoteToken)
        ? new fractions_1.Price(baseToken, quoteToken, internalConstants_1.Q192, ratioX192)
        : new fractions_1.Price(baseToken, quoteToken, ratioX192, internalConstants_1.Q192);
}
exports.tickToPrice = tickToPrice;
/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */
function priceToClosestTick(price) {
    const sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
    const sqrtRatioX96 = sorted
        ? (0, encodeSqrtRatioX96_1.encodeSqrtRatioX96)(price.numerator, price.denominator)
        : (0, encodeSqrtRatioX96_1.encodeSqrtRatioX96)(price.denominator, price.numerator);
    let tick = tickMath_1.TickMath.getTickAtSqrtRatio(sqrtRatioX96);
    const nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);
    if (sorted) {
        if (!price.lessThan(nextTickPrice)) {
            tick++;
        }
    }
    else if (!price.greaterThan(nextTickPrice)) {
        tick++;
    }
    return tick;
}
exports.priceToClosestTick = priceToClosestTick;
