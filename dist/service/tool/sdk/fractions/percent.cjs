"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Percent = void 0;
var _fraction = require("./fraction.cjs");
const ONE_HUNDRED = new _fraction.Fraction(100n);
function toPercent(fraction) {
  return new Percent(fraction.numerator, fraction.denominator);
}
class Percent extends _fraction.Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  isPercent = true;
  add(other) {
    return toPercent(super.add(other));
  }
  subtract(other) {
    return toPercent(super.subtract(other));
  }
  multiply(other) {
    return toPercent(super.multiply(other));
  }
  divide(other) {
    return toPercent(super.divide(other));
  }
  toSignificant(significantDigits = 5, format, rounding) {
    return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 2, format, rounding) {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  }
}
exports.Percent = Percent;