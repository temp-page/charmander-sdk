import { Q192 } from "../internalConstants.mjs";
import { Price } from "../../fractions/index.mjs";
import { encodeSqrtRatioX96 } from "./encodeSqrtRatioX96.mjs";
import { TickMath } from "./tickMath.mjs";
export function tickToPrice(baseToken, quoteToken, tick) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96;
  return baseToken.sortsBefore(quoteToken) ? new Price(baseToken, quoteToken, Q192, ratioX192) : new Price(baseToken, quoteToken, ratioX192, Q192);
}
export function priceToClosestTick(price) {
  const sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  const sqrtRatioX96 = sorted ? encodeSqrtRatioX96(price.numerator, price.denominator) : encodeSqrtRatioX96(price.denominator, price.numerator);
  let tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  const nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);
  if (sorted) {
    if (!price.lessThan(nextTickPrice))
      tick++;
  } else if (!price.greaterThan(nextTickPrice)) {
    tick++;
  }
  return tick;
}
