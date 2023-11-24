"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoutesWithValidQuote = getRoutesWithValidQuote;
var _sdk = require("../sdk/index.cjs");
var _functions = require("./functions/index.cjs");
async function getRoutesWithValidQuote({
  amount,
  baseRoutes,
  distributionPercent,
  quoteProvider,
  tradeType,
  gasModel
}) {
  const [percents, amounts] = (0, _functions.getAmountDistribution)(amount, distributionPercent);
  const routesWithoutQuote = amounts.reduce((acc, curAmount, i) => [...acc, ...baseRoutes.map(r => ({
    ...r,
    amount: curAmount,
    percent: percents[i]
  }))], []);
  const getRoutesWithQuote = tradeType === _sdk.TradeType.EXACT_INPUT ? quoteProvider.getRouteWithQuotesExactIn : quoteProvider.getRouteWithQuotesExactOut;
  return getRoutesWithQuote(routesWithoutQuote, {
    gasModel
  });
}