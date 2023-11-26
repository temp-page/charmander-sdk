import { Pool } from '../../sdk/v3';
// FIXME current verison is not working with stable pools that have more than 2 tokens
export function getOutputCurrency(pool, currencyIn) {
    const tokenIn = currencyIn.wrapped;
    const { token0, token1 } = pool;
    return token0.equals(tokenIn) ? token1 : token0;
}
export function getTokenPrice(pool, base, quote) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool;
    const v3Pool = new Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick);
    return v3Pool.priceOf(base.wrapped);
}
export function involvesCurrency(pool, currency) {
    const token = currency.wrapped;
    const { token0, token1 } = pool;
    return token0.equals(token) || token1.equals(token);
}
