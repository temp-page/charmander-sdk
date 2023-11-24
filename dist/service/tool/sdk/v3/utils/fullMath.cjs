"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullMath = void 0;
var _internalConstants = require("../internalConstants.cjs");
class FullMath {
  /**
   * Cannot be constructed.
   */
  constructor() {}
  static mulDivRoundingUp(a, b, denominator) {
    const product = a * b;
    let result = product / denominator;
    if (product % denominator !== _internalConstants.ZERO) result = result + _internalConstants.ONE;
    return result;
  }
}
exports.FullMath = FullMath;