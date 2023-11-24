"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fraction = void 0;
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _constants = require("../constants.cjs");
var _Common = require("../../math/Common.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const toSignificantRounding = {
  [_constants.Rounding.ROUND_DOWN]: _bignumber.default.ROUND_DOWN,
  [_constants.Rounding.ROUND_HALF_UP]: _bignumber.default.ROUND_HALF_UP,
  [_constants.Rounding.ROUND_UP]: _bignumber.default.ROUND_UP
};
var RoundingMode = /* @__PURE__ */(RoundingMode2 => {
  RoundingMode2[RoundingMode2["RoundDown"] = 0] = "RoundDown";
  RoundingMode2[RoundingMode2["RoundHalfUp"] = 1] = "RoundHalfUp";
  RoundingMode2[RoundingMode2["RoundHalfEven"] = 2] = "RoundHalfEven";
  RoundingMode2[RoundingMode2["RoundUp"] = 3] = "RoundUp";
  return RoundingMode2;
})(RoundingMode || {});
const toFixedRounding = {
  [_constants.Rounding.ROUND_DOWN]: 0 /* RoundDown */,
  [_constants.Rounding.ROUND_HALF_UP]: 1 /* RoundHalfUp */,
  [_constants.Rounding.ROUND_UP]: 3 /* RoundUp */
};

class Fraction {
  numerator;
  denominator;
  constructor(numerator, denominator = 1n) {
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator);
  }
  static tryParseFraction(fractionish) {
    if (typeof fractionish === "bigint" || typeof fractionish === "number" || typeof fractionish === "string") return new Fraction(fractionish);
    if ("numerator" in fractionish && "denominator" in fractionish) return fractionish;
    throw new Error("Could not parse fraction");
  }
  // performs floor division
  get quotient() {
    return this.numerator / this.denominator;
  }
  // remainder after floor division
  get remainder() {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }
  invert() {
    return new Fraction(this.denominator, this.numerator);
  }
  add(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator) return new Fraction(this.numerator + otherParsed.numerator, this.denominator);
    return new Fraction(this.numerator * otherParsed.denominator + otherParsed.numerator * this.denominator, this.denominator * otherParsed.denominator);
  }
  subtract(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator) return new Fraction(this.numerator - otherParsed.numerator, this.denominator);
    return new Fraction(this.numerator * otherParsed.denominator - otherParsed.numerator * this.denominator, this.denominator * otherParsed.denominator);
  }
  lessThan(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator < otherParsed.numerator * this.denominator;
  }
  equalTo(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator === otherParsed.numerator * this.denominator;
  }
  greaterThan(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator > otherParsed.numerator * this.denominator;
  }
  multiply(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(this.numerator * otherParsed.numerator, this.denominator * otherParsed.denominator);
  }
  divide(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(this.numerator * otherParsed.denominator, this.denominator * otherParsed.numerator);
  }
  toSignificant(significantDigits, format = {
    groupSeparator: ""
  }, rounding = _constants.Rounding.ROUND_HALF_UP) {
    (0, _Common.invariant)(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
    (0, _Common.invariant)(significantDigits > 0, `${significantDigits} is not positive.`);
    const quotient = new _bignumber.default(this.numerator.toString()).div(this.denominator.toString()).dp(significantDigits, toSignificantRounding[rounding]);
    return quotient.toFormat(significantDigits, format);
  }
  toFixed(decimalPlaces, format = {
    groupSeparator: ""
  }, rounding = _constants.Rounding.ROUND_HALF_UP) {
    (0, _Common.invariant)(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
    (0, _Common.invariant)(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
    if (format) {}
    return new _bignumber.default(this.numerator.toString()).div(this.denominator.toString()).toFixed(decimalPlaces, toFixedRounding[rounding]);
  }
  /**
   * Helper method for converting any super class back to a fraction
   */
  get asFraction() {
    return new Fraction(this.numerator, this.denominator);
  }
}
exports.Fraction = Fraction;