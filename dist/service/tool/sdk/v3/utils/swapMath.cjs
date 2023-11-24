"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwapMath = void 0;
var _internalConstants = require("../internalConstants.cjs");
var _fullMath = require("./fullMath.cjs");
var _sqrtPriceMath = require("./sqrtPriceMath.cjs");
class SwapMath {
  /**
   * Cannot be constructed.
   */
  constructor() {}
  static computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    const returnValues = {};
    const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;
    const exactIn = amountRemaining >= _internalConstants.ZERO;
    if (exactIn) {
      const amountRemainingLessFee = amountRemaining * (_internalConstants.MAX_FEE - BigInt(feePips)) / _internalConstants.MAX_FEE;
      returnValues.amountIn = zeroForOne ? _sqrtPriceMath.SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : _sqrtPriceMath.SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);
      if (amountRemainingLessFee >= returnValues.amountIn) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = _sqrtPriceMath.SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
      }
    } else {
      returnValues.amountOut = zeroForOne ? _sqrtPriceMath.SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : _sqrtPriceMath.SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);
      if (amountRemaining * _internalConstants.NEGATIVE_ONE >= returnValues.amountOut) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = _sqrtPriceMath.SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, amountRemaining * _internalConstants.NEGATIVE_ONE, zeroForOne);
      }
    }
    const max = sqrtRatioTargetX96 === returnValues.sqrtRatioNextX96;
    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : _sqrtPriceMath.SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : _sqrtPriceMath.SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : _sqrtPriceMath.SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : _sqrtPriceMath.SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }
    if (!exactIn && returnValues.amountOut > amountRemaining * _internalConstants.NEGATIVE_ONE) returnValues.amountOut = amountRemaining * _internalConstants.NEGATIVE_ONE;
    if (exactIn && returnValues.sqrtRatioNextX96 !== sqrtRatioTargetX96) {
      returnValues.feeAmount = amountRemaining - returnValues.amountIn;
    } else {
      returnValues.feeAmount = _fullMath.FullMath.mulDivRoundingUp(returnValues.amountIn, BigInt(feePips), _internalConstants.MAX_FEE - BigInt(feePips));
    }
    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  }
}
exports.SwapMath = SwapMath;