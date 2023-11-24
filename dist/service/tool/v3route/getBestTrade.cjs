"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBestTrade = getBestTrade;
var _sdk = require("../sdk/index.cjs");
var _functions = require("./functions/index.cjs");
var _gasModel = require("./gasModel.cjs");
var _getRoutesWithValidQuote = require("./getRoutesWithValidQuote.cjs");
async function getBestTrade(amount, currency, tradeType, config) {
  const bestRoutes = await getBestRoutes(amount, currency, tradeType, config);
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(_sdk.ZERO)) throw new Error("Cannot find a valid swap route");
  const {
    routes,
    gasEstimate,
    inputAmount,
    outputAmount
  } = bestRoutes;
  return {
    tradeType,
    routes,
    gasEstimate,
    inputAmount,
    outputAmount
  };
}
async function getBestRoutes(amount, currency, tradeType, routeConfig) {
  const {
    maxHops = 3,
    maxSplits = 4,
    distributionPercent = 50,
    poolProvider,
    quoteProvider,
    gasPriceWei
  } = routeConfig;
  const isExactIn = tradeType === _sdk.TradeType.EXACT_INPUT;
  const inputCurrency = isExactIn ? amount.currency : currency;
  const outputCurrency = isExactIn ? currency : amount.currency;
  const candidatePools = await poolProvider.getCandidatePools(amount.currency, currency);
  const baseRoutes = (0, _functions.computeAllRoutes)(inputCurrency, outputCurrency, candidatePools, maxHops);
  const gasModel = await (0, _gasModel.createGasModel)({
    gasPriceWei,
    quoteCurrency: currency
  });
  const routesWithValidQuote = await (0, _getRoutesWithValidQuote.getRoutesWithValidQuote)({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider,
    tradeType,
    gasModel
  });
  routesWithValidQuote.forEach(({
    percent,
    path,
    amount: a,
    quote
  }) => {
    const pathStr = path.map(t => t.symbol).join("->");
    console.log(`${percent}% Swap`, a.toExact(), a.currency.symbol, "through", pathStr, ":", quote.toExact(), quote.currency.symbol);
  });
  return (0, _functions.getBestRouteCombinationByQuotes)(amount, currency, routesWithValidQuote, tradeType, {
    maxSplits
  });
}