"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SqrtPriceMath = void 0;
var _internalConstants = require("../internalConstants.cjs");
var _constants = require("../../constants.cjs");
var _Common = require("../../../math/Common.cjs");
var _fullMath = require("./fullMath.cjs");
const MaxUint160 = 2n ** 160n - _internalConstants.ONE;
function multiplyIn256(x, y) {
  const product = x * y;
  return product & _constants.MaxUint256;
}
function addIn256(x, y) {
  const sum = x + y;
  return sum & _constants.MaxUint256;
}
class SqrtPriceMath {
  /**
   * Cannot be constructed.
   */
  constructor() {}
  static getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      sqrtRatioAX96 = sqrtRatioBX96;
      sqrtRatioBX96 = sqrtRatioAX96;
    }
    const numerator1 = liquidity << 96n;
    const numerator2 = sqrtRatioBX96 - sqrtRatioAX96;
    return roundUp ? _fullMath.FullMath.mulDivRoundingUp(_fullMath.FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), _internalConstants.ONE, sqrtRatioAX96) : numerator1 * numerator2 / sqrtRatioBX96 / sqrtRatioAX96;
  }
  static getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      sqrtRatioAX96 = sqrtRatioBX96;
      sqrtRatioBX96 = sqrtRatioAX96;
    }
    return roundUp ? _fullMath.FullMath.mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, _internalConstants.Q96) : liquidity * (sqrtRatioBX96 - sqrtRatioAX96) / _internalConstants.Q96;
  }
  static getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    (0, _Common.invariant)(sqrtPX96 > _internalConstants.ZERO);
    (0, _Common.invariant)(liquidity > _internalConstants.ZERO);
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  }
  static getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    (0, _Common.invariant)(sqrtPX96 > _internalConstants.ZERO);
    (0, _Common.invariant)(liquidity > _internalConstants.ZERO);
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  }
  static getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    if (amount === _internalConstants.ZERO) return sqrtPX96;
    const numerator1 = liquidity << 96n;
    if (add) {
      const product2 = multiplyIn256(amount, sqrtPX96);
      if (product2 / amount === sqrtPX96) {
        const denominator2 = addIn256(numerator1, product2);
        if (denominator2 >= numerator1) return _fullMath.FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator2);
      }
      return _fullMath.FullMath.mulDivRoundingUp(numerator1, _internalConstants.ONE, numerator1 / sqrtPX96 + amount);
    }
    const product = multiplyIn256(amount, sqrtPX96);
    (0, _Common.invariant)(product / amount === sqrtPX96);
    (0, _Common.invariant)(numerator1 > product);
    const denominator = numerator1 - product;
    return _fullMath.FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
  }
  static getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      const quotient2 = amount <= MaxUint160 ? (amount << 96n) / liquidity : amount * _internalConstants.Q96 / liquidity;
      return sqrtPX96 + quotient2;
    }
    const quotient = _fullMath.FullMath.mulDivRoundingUp(amount, _internalConstants.Q96, liquidity);
    (0, _Common.invariant)(sqrtPX96 > quotient);
    return sqrtPX96 - quotient;
  }
}
exports.SqrtPriceMath = SqrtPriceMath;