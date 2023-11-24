"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maximumAmountIn = maximumAmountIn;
exports.minimumAmountOut = minimumAmountOut;
var _sdk = require("../../sdk/index.cjs");
function maximumAmountIn(trade, slippage, amountIn = trade.inputAmount) {
  if (trade.tradeType === _sdk.TradeType.EXACT_INPUT) return amountIn;
  const slippageAdjustedAmountIn = new _sdk.Fraction(_sdk.ONE).add(slippage).multiply(amountIn.quotient).quotient;
  return _sdk.CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
}
function minimumAmountOut(trade, slippage, amountOut = trade.outputAmount) {
  if (trade.tradeType === _sdk.TradeType.EXACT_OUTPUT) return amountOut;
  const slippageAdjustedAmountOut = new _sdk.Fraction(_sdk.ONE).add(slippage).invert().multiply(amountOut.quotient).quotient;
  return _sdk.CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
}