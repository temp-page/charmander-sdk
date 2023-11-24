import { Q192 } from '../internalConstants';
import { Price } from '../../fractions';
export function sqrtRatioX96ToPrice(sqrtRatioX96, currencyA, currencyB) {
    const ratioX192 = sqrtRatioX96 * sqrtRatioX96;
    return currencyA.wrapped.sortsBefore(currencyB.wrapped)
        ? new Price(currencyA.wrapped, currencyB.wrapped, Q192, ratioX192)
        : new Price(currencyA.wrapped, currencyB.wrapped, ratioX192, Q192);
}
