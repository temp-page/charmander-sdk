"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nearestUsableTick = nearestUsableTick;
var _Common = require("../../../math/Common.cjs");
var _tickMath = require("./tickMath.cjs");
function nearestUsableTick(tick, tickSpacing) {
  (0, _Common.invariant)(Number.isInteger(tick) && Number.isInteger(tickSpacing), "INTEGERS");
  (0, _Common.invariant)(tickSpacing > 0, "TICK_SPACING");
  (0, _Common.invariant)(tick >= _tickMath.TickMath.MIN_TICK && tick <= _tickMath.TickMath.MAX_TICK, "TICK_BOUND");
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < _tickMath.TickMath.MIN_TICK) return rounded + tickSpacing;
  if (rounded > _tickMath.TickMath.MAX_TICK) return rounded - tickSpacing;
  return rounded;
}