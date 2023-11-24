import { TradeType, ZERO } from "../sdk/index.mjs";
import { computeAllRoutes, getBestRouteCombinationByQuotes } from "./functions/index.mjs";
import { createGasModel } from "./gasModel.mjs";
import { getRoutesWithValidQuote } from "./getRoutesWithValidQuote.mjs";
export async function getBestTrade(amount, currency, tradeType, config) {
  const bestRoutes = await getBestRoutes(amount, currency, tradeType, config);
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(ZERO))
    throw new Error("Cannot find a valid swap route");
  const { routes, gasEstimate, inputAmount, outputAmount } = bestRoutes;
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
  const isExactIn = tradeType === TradeType.EXACT_INPUT;
  const inputCurrency = isExactIn ? amount.currency : currency;
  const outputCurrency = isExactIn ? currency : amount.currency;
  const candidatePools = await poolProvider.getCandidatePools(amount.currency, currency);
  const baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops);
  const gasModel = await createGasModel({ gasPriceWei, quoteCurrency: currency });
  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider,
    tradeType,
    gasModel
  });
  routesWithValidQuote.forEach(({ percent, path, amount: a, quote }) => {
    const pathStr = path.map((t) => t.symbol).join("->");
    console.log(
      `${percent}% Swap`,
      a.toExact(),
      a.currency.symbol,
      "through",
      pathStr,
      ":",
      quote.toExact(),
      quote.currency.symbol
    );
  });
  return getBestRouteCombinationByQuotes(amount, currency, routesWithValidQuote, tradeType, { maxSplits });
}
