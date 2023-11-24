import { invariant } from "../../../math/Common.mjs";
import { TickMath } from "./tickMath.mjs";
export function nearestUsableTick(tick, tickSpacing) {
  invariant(Number.isInteger(tick) && Number.isInteger(tickSpacing), "INTEGERS");
  invariant(tickSpacing > 0, "TICK_SPACING");
  invariant(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK, "TICK_BOUND");
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK)
    return rounded + tickSpacing;
  if (rounded > TickMath.MAX_TICK)
    return rounded - tickSpacing;
  return rounded;
}
