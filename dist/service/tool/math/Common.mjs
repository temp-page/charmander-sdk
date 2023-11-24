import { getAddress } from "ethers";
import { Price } from "../sdk/index.mjs";
import { TICK_SPACINGS } from "../../vo/index.mjs";
import { TickMath, encodeSqrtRatioX96, nearestUsableTick, priceToClosestTick, tickToPrice } from "../sdk/v3/utils/index.mjs";
export function invariant(state, errorMsg = "ERROR") {
  if (!state)
    throw new Error(errorMsg);
}
export const ENDLESS = "\u221E";
export function tryParsePrice(baseToken, quoteToken, value) {
  if (!baseToken || !quoteToken || !value)
    return void 0;
  if (!value.match(/^\d*\.?\d+$/))
    return void 0;
  const [whole, fraction] = value.split(".");
  const decimals = fraction?.length ?? 0;
  const withoutDecimals = BigInt((whole ?? "") + (fraction ?? ""));
  return new Price(
    baseToken,
    quoteToken,
    BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals),
    withoutDecimals * BigInt(10 ** quoteToken.decimals)
  );
}
export function tryParseTick(baseToken, quoteToken, feeAmount, value) {
  if (!baseToken || !quoteToken || !feeAmount || !value)
    return void 0;
  const price = tryParsePrice(baseToken, quoteToken, value);
  if (!price)
    return void 0;
  let tick;
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);
  if (sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO) {
    tick = TickMath.MAX_TICK;
  } else if (sqrtRatioX96 <= TickMath.MIN_SQRT_RATIO) {
    tick = TickMath.MIN_TICK;
  } else {
    tick = priceToClosestTick(price);
  }
  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
}
export function getTickToPrice(baseToken, quoteToken, tick) {
  if (!baseToken || !quoteToken || typeof tick !== "number")
    return void 0;
  return tickToPrice(baseToken, quoteToken, tick);
}
export function validateAndParseAddress(address) {
  try {
    return getAddress(address);
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}
export function computeSurroundingTicks(token0, token1, activeTickProcessed, sortedTickData, pivot, ascending) {
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
      price0: tickToPrice(token0, token1, tick).toFixed()
    };
    if (ascending) {
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive + BigInt(sortedTickData[i].liquidityNet);
    } else if (!ascending && previousTickProcessed.liquidityNet !== 0n) {
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive - previousTickProcessed.liquidityNet;
    }
    processedTicks.push(currentTickProcessed);
    previousTickProcessed = currentTickProcessed;
  }
  if (!ascending)
    processedTicks = processedTicks.reverse();
  return processedTicks;
}
export function tickToPriceString(token0, token1, feeAmount, tick) {
  const min = nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]);
  const max = nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]);
  if (tick === min)
    return "0";
  if (tick === max)
    return ENDLESS;
  return tickToPrice(token0, token1, tick).toFixed();
}
