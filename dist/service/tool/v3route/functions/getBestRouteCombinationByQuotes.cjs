"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBestRouteCombinationByQuotes = getBestRouteCombinationByQuotes;
exports.getBestSwapRouteBy = getBestSwapRouteBy;
var _fixedReverseHeap = _interopRequireDefault(require("mnemonist/fixed-reverse-heap.js"));
var _queue = _interopRequireDefault(require("mnemonist/queue.js"));
var _flatMap = _interopRequireDefault(require("lodash/flatMap"));
var _mapValues = _interopRequireDefault(require("lodash/mapValues"));
var _sdk = require("../../sdk/index.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getBestRouteCombinationByQuotes(amount, quoteCurrency, routesWithQuote, tradeType, config) {
  const chainId = amount.currency.chainId;
  const percents = [];
  const percentToQuotes = {};
  for (const routeWithQuote of routesWithQuote) {
    if (!percentToQuotes[routeWithQuote.percent]) {
      percentToQuotes[routeWithQuote.percent] = [];
      percents.push(routeWithQuote.percent);
    }
    percentToQuotes[routeWithQuote.percent].push(routeWithQuote);
  }
  const swapRoute = getBestSwapRouteBy(tradeType, percentToQuotes, percents.sort((a, b) => a - b), chainId, rq => rq.quoteAdjustedForGas, config);
  if (!swapRoute) return null;
  const {
    routes: routeAmounts
  } = swapRoute;
  const totalAmount = routeAmounts.reduce((total, routeAmount) => total.add(routeAmount.amount), _sdk.CurrencyAmount.fromRawAmount(routeAmounts[0].amount.currency, 0));
  const missingAmount = amount.subtract(totalAmount);
  if (missingAmount.greaterThan(0)) {
    console.log({
      missingAmount: missingAmount.quotient.toString()
    }, `Optimal route's amounts did not equal exactIn/exactOut total. Adding missing amount to last route in array.`);
    routeAmounts[routeAmounts.length - 1].amount = routeAmounts[routeAmounts.length - 1].amount.add(missingAmount);
  }
  console.log({
    routes: routeAmounts,
    numSplits: routeAmounts.length,
    amount: amount.toExact(),
    quote: swapRoute.quote.toExact(),
    quoteGasAdjusted: swapRoute.quoteGasAdjusted.toFixed(Math.min(swapRoute.quoteGasAdjusted.currency.decimals, 2))
  }, `Found best swap route. ${routeAmounts.length} split.`);
  const {
    routes,
    quote: quoteAmount,
    estimatedGasUsed
  } = swapRoute;
  const quote = _sdk.CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmount.quotient);
  const isExactIn = tradeType === _sdk.TradeType.EXACT_INPUT;
  return {
    routes: routes.map(({
      type,
      amount: routeAmount,
      quote: routeQuoteAmount,
      pools,
      path,
      percent
    }) => {
      const routeQuote = _sdk.CurrencyAmount.fromRawAmount(quoteCurrency, routeQuoteAmount.quotient);
      return {
        percent,
        type,
        pools,
        path,
        inputAmount: isExactIn ? routeAmount : routeQuote,
        outputAmount: isExactIn ? routeQuote : routeAmount
      };
    }),
    gasEstimate: estimatedGasUsed,
    inputAmount: isExactIn ? amount : quote,
    outputAmount: isExactIn ? quote : amount
  };
}
function getBestSwapRouteBy(tradeType, percentToQuotes, percents, chainId, by, {
  maxSplits = 4,
  minSplits = 0
}) {
  const percentToSortedQuotes = (0, _mapValues.default)(percentToQuotes, routeQuotes => {
    return routeQuotes.sort((routeQuoteA, routeQuoteB) => {
      if (tradeType === _sdk.TradeType.EXACT_INPUT) return by(routeQuoteA).greaterThan(by(routeQuoteB)) ? -1 : 1;
      return by(routeQuoteA).lessThan(by(routeQuoteB)) ? -1 : 1;
    });
  });
  const quoteCompFn = tradeType === _sdk.TradeType.EXACT_INPUT ? (a, b) => a.greaterThan(b) : (a, b) => a.lessThan(b);
  const sumFn = currencyAmounts => {
    let sum = currencyAmounts[0];
    for (let i = 1; i < currencyAmounts.length; i++) sum = sum.add(currencyAmounts[i]);
    return sum;
  };
  let bestQuote;
  let bestSwap;
  const bestSwapsPerSplit = new _fixedReverseHeap.default(Array, (a, b) => {
    return quoteCompFn(a.quote, b.quote) ? -1 : 1;
  }, 3);
  if (!percentToSortedQuotes[100] || minSplits > 1) {
    console.log({
      percentToSortedQuotes: (0, _mapValues.default)(percentToSortedQuotes, p => p.length)
    }, "Did not find a valid route without any splits. Continuing search anyway.");
  } else {
    bestQuote = by(percentToSortedQuotes[100][0]);
    bestSwap = [percentToSortedQuotes[100][0]];
    for (const routeWithQuote of percentToSortedQuotes[100].slice(0, 5)) {
      bestSwapsPerSplit.push({
        quote: by(routeWithQuote),
        routes: [routeWithQuote]
      });
    }
  }
  const queue = new _queue.default();
  for (let i = percents.length; i >= 0; i--) {
    const percent = percents[i];
    if (!percentToSortedQuotes[percent]) continue;
    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent][0]],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: false
    });
    if (!percentToSortedQuotes[percent] || !percentToSortedQuotes[percent][1]) continue;
    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent][1]],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: true
    });
  }
  let splits = 1;
  while (queue.size > 0) {
    console.log({
      top5: Array.from(bestSwapsPerSplit.consume()).map(q => `${q.quote.toExact()} (${q.routes.map(r => `${r.percent}% ${r.amount.toExact()} ${r.pools.map(p => {
        return `V3 fee ${p.fee} ${p.token0.symbol}-${p.token1.symbol}`;
      }).join(", ")} ${r.quote.toExact()}`).join(", ")})`),
      onQueue: queue.size
    }, `Top 3 with ${splits} splits`);
    bestSwapsPerSplit.clear();
    let layer = queue.size;
    splits++;
    if (splits >= 3 && bestSwap && bestSwap.length < splits - 1) break;
    if (splits > maxSplits) {
      console.log("Max splits reached. Stopping search.");
      break;
    }
    while (layer > 0) {
      layer--;
      const {
        remainingPercent,
        curRoutes,
        percentIndex,
        special
      } = queue.dequeue();
      for (let i = percentIndex; i >= 0; i--) {
        const percentA = percents[i];
        if (percentA > remainingPercent) continue;
        if (!percentToSortedQuotes[percentA]) continue;
        const candidateRoutesA = percentToSortedQuotes[percentA];
        const routeWithQuoteA = findFirstRouteNotUsingUsedPools(curRoutes, candidateRoutesA);
        if (!routeWithQuoteA) continue;
        const remainingPercentNew = remainingPercent - percentA;
        const curRoutesNew = [...curRoutes, routeWithQuoteA];
        if (remainingPercentNew === 0 && splits >= minSplits) {
          const quotesNew = curRoutesNew.map(r => by(r));
          const quoteNew = sumFn(quotesNew);
          const gasCostL1QuoteToken = _sdk.CurrencyAmount.fromRawAmount(quoteNew.currency, 0);
          const quoteAfterL1Adjust = tradeType === _sdk.TradeType.EXACT_INPUT ? quoteNew.subtract(gasCostL1QuoteToken) : quoteNew.add(gasCostL1QuoteToken);
          bestSwapsPerSplit.push({
            quote: quoteAfterL1Adjust,
            routes: curRoutesNew
          });
          if (!bestQuote || quoteCompFn(quoteAfterL1Adjust, bestQuote)) {
            bestQuote = quoteAfterL1Adjust;
            bestSwap = curRoutesNew;
          }
        } else {
          queue.enqueue({
            curRoutes: curRoutesNew,
            remainingPercent: remainingPercentNew,
            percentIndex: i,
            special
          });
        }
      }
    }
  }
  if (!bestSwap) {
    console.log(`Could not find a valid swap`);
    return null;
  }
  const quoteGasAdjusted = sumFn(bestSwap.map(routeWithValidQuote => routeWithValidQuote.quoteAdjustedForGas));
  const estimatedGasUsed = bestSwap.map(routeWithValidQuote => routeWithValidQuote.gasEstimate).reduce((sum, routeWithValidQuote) => sum + routeWithValidQuote, 0n);
  const quote = sumFn(bestSwap.map(routeWithValidQuote => routeWithValidQuote.quote));
  const routeWithQuotes = bestSwap.sort((routeAmountA, routeAmountB) => routeAmountB.amount.greaterThan(routeAmountA.amount) ? 1 : -1);
  return {
    quote,
    quoteGasAdjusted,
    estimatedGasUsed,
    routes: routeWithQuotes
  };
}
function findFirstRouteNotUsingUsedPools(usedRoutes, candidateRouteQuotes) {
  const poolAddressSet = /* @__PURE__ */new Set();
  const usedPoolAddresses = (0, _flatMap.default)(usedRoutes, ({
    pools
  }) => pools.map(it => it.address));
  for (const poolAddress of usedPoolAddresses) poolAddressSet.add(poolAddress);
  for (const routeQuote of candidateRouteQuotes) {
    const {
      pools
    } = routeQuote;
    const poolAddresses = pools.map(it => it.address);
    if (poolAddresses.some(poolAddress => poolAddressSet.has(poolAddress))) continue;
    return routeQuote;
  }
  return null;
}