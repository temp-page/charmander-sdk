"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrencyAmount = void 0;
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _constants = require("../constants.cjs");
var _Common = require("../../math/Common.cjs");
var _fraction = require("./fraction.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CurrencyAmount extends _fraction.Fraction {
  currency;
  decimalScale;
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  static fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  static fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  }
  constructor(currency, numerator, denominator) {
    super(numerator, denominator);
    (0, _Common.invariant)(this.quotient <= _constants.MaxUint256, "AMOUNT");
    this.currency = currency;
    this.decimalScale = 10n ** BigInt(currency.decimals);
  }
  add(other) {
    (0, _Common.invariant)(this.currency.equals(other.currency), "CURRENCY");
    const added = super.add(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  }
  subtract(other) {
    (0, _Common.invariant)(this.currency.equals(other.currency), "CURRENCY");
    const subtracted = super.subtract(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
  }
  multiply(other) {
    const multiplied = super.multiply(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
  }
  divide(other) {
    const divided = super.divide(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
  }
  toSignificant(significantDigits = 6, format, rounding = _constants.Rounding.ROUND_DOWN) {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = this.currency.decimals, format, rounding = _constants.Rounding.ROUND_DOWN) {
    (0, _Common.invariant)(decimalPlaces <= this.currency.decimals, "DECIMALS");
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding);
  }
  toExact(format = {
    groupSeparator: ""
  }) {
    return new _bignumber.default(this.quotient.toString()).div(this.decimalScale.toString()).dp(this.currency.decimals, _bignumber.default.ROUND_DOWN).toFormat(this.currency.decimals, format);
  }
  get wrapped() {
    if (this.currency.isToken) return this;
    return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
  }
}
exports.CurrencyAmount = CurrencyAmount;