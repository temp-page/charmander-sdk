import BigNumber from 'bignumber.js';
import { Rounding } from '../constants';
import { invariant } from '../../math/Common';
const toSignificantRounding = {
    [Rounding.ROUND_DOWN]: BigNumber.ROUND_DOWN,
    [Rounding.ROUND_HALF_UP]: BigNumber.ROUND_HALF_UP,
    [Rounding.ROUND_UP]: BigNumber.ROUND_UP,
};
var RoundingMode;
(function (RoundingMode) {
    /**
     * Rounds towards zero.
     * I.e. truncate, no rounding.
     */
    RoundingMode[RoundingMode["RoundDown"] = 0] = "RoundDown";
    /**
     * Rounds towards nearest neighbour.
     * If equidistant, rounds away from zero.
     */
    RoundingMode[RoundingMode["RoundHalfUp"] = 1] = "RoundHalfUp";
    /**
     * Rounds towards nearest neighbour.
     * If equidistant, rounds towards even neighbour.
     */
    RoundingMode[RoundingMode["RoundHalfEven"] = 2] = "RoundHalfEven";
    /**
     * Rounds away from zero.
     */
    RoundingMode[RoundingMode["RoundUp"] = 3] = "RoundUp";
})(RoundingMode || (RoundingMode = {}));
const toFixedRounding = {
    [Rounding.ROUND_DOWN]: RoundingMode.RoundDown,
    [Rounding.ROUND_HALF_UP]: RoundingMode.RoundHalfUp,
    [Rounding.ROUND_UP]: RoundingMode.RoundUp,
};
export class Fraction {
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
        if (this.denominator === otherParsed.denominator)
            return new Fraction(this.numerator + otherParsed.numerator, this.denominator);
        return new Fraction(this.numerator * otherParsed.denominator + otherParsed.numerator * this.denominator, this.denominator * otherParsed.denominator);
    }
    subtract(other) {
        const otherParsed = Fraction.tryParseFraction(other);
        if (this.denominator === otherParsed.denominator)
            return new Fraction(this.numerator - otherParsed.numerator, this.denominator);
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
    toSignificant(significantDigits, format = { groupSeparator: '' }, rounding = Rounding.ROUND_HALF_UP) {
        invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
        invariant(significantDigits > 0, `${significantDigits} is not positive.`);
        const quotient = new BigNumber(this.numerator.toString()).div(this.denominator.toString()).dp(significantDigits, toSignificantRounding[rounding]);
        return quotient.toFormat(significantDigits, format);
    }
    toFixed(decimalPlaces, format = { groupSeparator: '' }, rounding = Rounding.ROUND_HALF_UP) {
        invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
        invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
        if (format) {
            // do nothing
        }
        return new BigNumber(this.numerator.toString()).div(this.denominator.toString()).toFixed(decimalPlaces, toFixedRounding[rounding]);
    }
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction() {
        return new Fraction(this.numerator, this.denominator);
    }
}
