"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TickList = void 0;
var _internalConstants = require("../internalConstants.cjs");
var _Common = require("../../../math/Common.cjs");
var _isSorted = require("./isSorted.cjs");
function tickComparator(a, b) {
  return a.index - b.index;
}
class TickList {
  /**
   * Cannot be constructed
   */
  constructor() {}
  static validateList(ticks, tickSpacing) {
    (0, _Common.invariant)(tickSpacing > 0, "TICK_SPACING_NONZERO");
    (0, _Common.invariant)(ticks.every(({
      index
    }) => index % tickSpacing === 0), "TICK_SPACING");
    (0, _Common.invariant)(ticks.reduce((accumulator, {
      liquidityNet
    }) => accumulator + liquidityNet, _internalConstants.ZERO) === _internalConstants.ZERO, "ZERO_NET");
    (0, _Common.invariant)((0, _isSorted.isSorted)(ticks, tickComparator), "SORTED");
  }
  static isBelowSmallest(ticks, tick) {
    (0, _Common.invariant)(ticks.length > 0, "LENGTH");
    return tick < ticks[0].index;
  }
  static isAtOrAboveLargest(ticks, tick) {
    (0, _Common.invariant)(ticks.length > 0, "LENGTH");
    return tick >= ticks[ticks.length - 1].index;
  }
  static getTick(ticks, index) {
    const tick = ticks[this.binarySearch(ticks, index)];
    (0, _Common.invariant)(tick.index === index, "NOT_CONTAINED");
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */
  static binarySearch(ticks, tick) {
    (0, _Common.invariant)(!this.isBelowSmallest(ticks, tick), "BELOW_SMALLEST");
    let l = 0;
    let r = ticks.length - 1;
    let i;
    while (true) {
      i = Math.floor((l + r) / 2);
      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick)) return i;
      if (ticks[i].index < tick) l = i + 1;else r = i - 1;
    }
  }
  static nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      (0, _Common.invariant)(!TickList.isBelowSmallest(ticks, tick), "BELOW_SMALLEST");
      if (TickList.isAtOrAboveLargest(ticks, tick)) return ticks[ticks.length - 1];
      const index2 = this.binarySearch(ticks, tick);
      return ticks[index2];
    }
    (0, _Common.invariant)(!this.isAtOrAboveLargest(ticks, tick), "AT_OR_ABOVE_LARGEST");
    if (this.isBelowSmallest(ticks, tick)) return ticks[0];
    const index = this.binarySearch(ticks, tick);
    return ticks[index + 1];
  }
  static nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    const compressed = Math.floor(tick / tickSpacing);
    if (lte) {
      const wordPos2 = compressed >> 8;
      const minimum = (wordPos2 << 8) * tickSpacing;
      if (TickList.isBelowSmallest(ticks, tick)) return [minimum, false];
      const {
        index: index2
      } = TickList.nextInitializedTick(ticks, tick, lte);
      const nextInitializedTick2 = Math.max(minimum, index2);
      return [nextInitializedTick2, nextInitializedTick2 === index2];
    }
    const wordPos = compressed + 1 >> 8;
    const maximum = ((wordPos + 1 << 8) - 1) * tickSpacing;
    if (this.isAtOrAboveLargest(ticks, tick)) return [maximum, false];
    const {
      index
    } = this.nextInitializedTick(ticks, tick, lte);
    const nextInitializedTick = Math.min(maximum, index);
    return [nextInitializedTick, nextInitializedTick === index];
  }
  static countInitializedTicksCrossed(ticks, tickBefore, tickAfter) {
    if (tickBefore === tickAfter) return 0;
    const beforeIndex = this.binarySearch(ticks, tickBefore);
    const afterIndex = this.binarySearch(ticks, tickAfter);
    return Math.abs(beforeIndex - afterIndex);
  }
}
exports.TickList = TickList;