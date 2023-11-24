import { CurrencyAmount, Fraction, ONE, TradeType } from "../../sdk/index.mjs";
export function maximumAmountIn(trade, slippage, amountIn = trade.inputAmount) {
  if (trade.tradeType === TradeType.EXACT_INPUT)
    return amountIn;
  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippage).multiply(amountIn.quotient).quotient;
  return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
}
export function minimumAmountOut(trade, slippage, amountOut = trade.outputAmount) {
  if (trade.tradeType === TradeType.EXACT_OUTPUT)
    return amountOut;
  const slippageAdjustedAmountOut = new Fraction(ONE).add(slippage).invert().multiply(amountOut.quotient).quotient;
  return CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
}
