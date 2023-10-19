"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraction = void 0;
const constants_1 = require("../constants");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const Common_1 = require("../../math/Common");
const toSignificantRounding = {
    [constants_1.Rounding.ROUND_DOWN]: bignumber_js_1.default.ROUND_DOWN,
    [constants_1.Rounding.ROUND_HALF_UP]: bignumber_js_1.default.ROUND_HALF_UP,
    [constants_1.Rounding.ROUND_UP]: bignumber_js_1.default.ROUND_UP,
};
const toFixedRounding = {
    [constants_1.Rounding.ROUND_DOWN]: 0 /* RoundingMode.RoundDown */,
    [constants_1.Rounding.ROUND_HALF_UP]: 1 /* RoundingMode.RoundHalfUp */,
    [constants_1.Rounding.ROUND_UP]: 3 /* RoundingMode.RoundUp */,
};
class Fraction {
    constructor(numerator, denominator = 1n) {
        this.numerator = BigInt(numerator);
        this.denominator = BigInt(denominator);
    }
    static tryParseFraction(fractionish) {
        if (typeof fractionish === 'bigint' || typeof fractionish === 'number' || typeof fractionish === 'string')
            return new Fraction(fractionish);
        if ('numerator' in fractionish && 'denominator' in fractionish)
            return fractionish;
        throw new Error('Could not parse fraction');
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
        if (this.denominator === otherParsed.denominator) {
            return new Fraction(this.numerator + otherParsed.numerator, this.denominator);
        }
        return new Fraction(this.numerator * otherParsed.denominator + otherParsed.numerator * this.denominator, this.denominator * otherParsed.denominator);
    }
    subtract(other) {
        const otherParsed = Fraction.tryParseFraction(other);
        if (this.denominator === otherParsed.denominator) {
            return new Fraction(this.numerator - otherParsed.numerator, this.denominator);
        }
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
    toSignificant(significantDigits, format = { groupSeparator: '' }, rounding = constants_1.Rounding.ROUND_HALF_UP) {
        (0, Common_1.invariant)(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
        (0, Common_1.invariant)(significantDigits > 0, `${significantDigits} is not positive.`);
        const quotient = new bignumber_js_1.default(this.numerator.toString()).div(this.denominator.toString()).dp(significantDigits, toSignificantRounding[rounding]);
        return quotient.toFormat(significantDigits, format);
    }
    toFixed(decimalPlaces, format = { groupSeparator: '' }, rounding = constants_1.Rounding.ROUND_HALF_UP) {
        (0, Common_1.invariant)(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
        (0, Common_1.invariant)(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
        return new bignumber_js_1.default(this.numerator.toString()).div(this.denominator.toString()).toFixed(decimalPlaces, toFixedRounding[rounding]);
    }
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction() {
        return new Fraction(this.numerator, this.denominator);
    }
}
exports.Fraction = Fraction;
