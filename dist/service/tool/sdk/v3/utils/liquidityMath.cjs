"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LiquidityMath = void 0;
var _internalConstants = require("../internalConstants.cjs");
class LiquidityMath {
  /**
   * Cannot be constructed.
   */
  constructor() {}
  static addDelta(x, y) {
    if (y < _internalConstants.ZERO) return x - y * _internalConstants.NEGATIVE_ONE;
    return x + y;
  }
}
exports.LiquidityMath = LiquidityMath;