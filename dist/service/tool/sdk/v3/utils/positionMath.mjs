import { ZERO } from "../internalConstants.mjs";
import { TickMath } from "./tickMath.mjs";
import { SqrtPriceMath } from "./sqrtPriceMath.mjs";
function getToken0Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower) {
    return SqrtPriceMath.getAmount0Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidity,
      false
    );
  }
  if (tickCurrent < tickUpper)
    return SqrtPriceMath.getAmount0Delta(sqrtRatioX96, TickMath.getSqrtRatioAtTick(tickUpper), liquidity, false);
  return ZERO;
}
function getToken1Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower)
    return ZERO;
  if (tickCurrent < tickUpper)
    return SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(tickLower), sqrtRatioX96, liquidity, false);
  return SqrtPriceMath.getAmount1Delta(
    TickMath.getSqrtRatioAtTick(tickLower),
    TickMath.getSqrtRatioAtTick(tickUpper),
    liquidity,
    false
  );
}
export const PositionMath = {
  getToken0Amount,
  getToken1Amount
};
