"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.involvesCurrency = exports.getTokenPrice = exports.getOutputCurrency = void 0;
const v3_1 = require("../../sdk/v3");
// FIXME current verison is not working with stable pools that have more than 2 tokens
function getOutputCurrency(pool, currencyIn) {
    const tokenIn = currencyIn.wrapped;
    const { token0, token1 } = pool;
    return token0.equals(tokenIn) ? token1 : token0;
}
exports.getOutputCurrency = getOutputCurrency;
function getTokenPrice(pool, base, quote) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool;
    const v3Pool = new v3_1.Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick);
    return v3Pool.priceOf(base.wrapped);
}
exports.getTokenPrice = getTokenPrice;
function involvesCurrency(pool, currency) {
    const token = currency.wrapped;
    const { token0, token1 } = pool;
    return token0.equals(token) || token1.equals(token);
}
exports.involvesCurrency = involvesCurrency;
