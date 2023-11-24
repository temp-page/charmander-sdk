"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeTradePriceBreakdown = computeTradePriceBreakdown;
exports.encodeMixedRouteToPath = encodeMixedRouteToPath;
exports.getPairCombinations = getPairCombinations;
var _flatMap = _interopRequireDefault(require("lodash/flatMap"));
var _ethers = require("ethers");
var _Constant = require("../../../Constant.cjs");
var _Tool = require("../Tool.cjs");
var _pool = require("../v3route/functions/pool.cjs");
var _sdk = require("../sdk/index.cjs");
var _internalConstants = require("../sdk/v3/internalConstants.cjs");
var _route = require("../v3route/functions/route.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getPairCombinations(currencyA, currencyB) {
  const currentAddressInfo = (0, _Constant.getCurrentAddressInfo)();
  const [tokenA, tokenB] = [currencyA, currencyB].sort((a, b) => a.sortsBefore(b) ? -1 : 1);
  const bases = currentAddressInfo.getApi().tokenMangerApi().tradeTokens();
  const basePairs = (0, _flatMap.default)(bases, base => bases.map(otherBase => [base, otherBase]));
  const keySet = /* @__PURE__ */new Set();
  const result = [];
  [
  // the direct pair
  [tokenA, tokenB],
  // token A against all bases
  ...bases.map(base => [tokenA, base]),
  // token B against all bases
  ...bases.map(base => [tokenB, base]),
  // each base against all bases
  ...basePairs].filter(tokens => Boolean(tokens[0] && tokens[1])).filter(([t0, t1]) => !(0, _Tool.eqAddress)(t0.erc20Address(), t1.erc20Address())).forEach(it => {
    const [t0, t1] = it.sort((a, b) => a.sortsBefore(b) ? -1 : 1);
    const key = `${t0.erc20Address()}-${t1.erc20Address()}`;
    if (!keySet.has(key)) {
      keySet.add(key);
      result.push(it);
    }
  });
  return result;
}
function encodeMixedRouteToPath(route, exactOutput) {
  const firstInputToken = route.input.wrapped;
  const {
    path,
    types
  } = route.pools.reduce(({
    inputToken,
    path: path2,
    types: types2
  }, pool, index) => {
    const outputToken = (0, _pool.getOutputCurrency)(pool, inputToken).wrapped;
    const fee = pool.fee;
    if (index === 0) {
      return {
        inputToken: outputToken,
        types: ["address", "uint24", "address"],
        path: [inputToken.address, fee, outputToken.address]
      };
    }
    return {
      inputToken: outputToken,
      types: [...types2, "uint24", "address"],
      path: [...path2, fee, outputToken.address]
    };
  }, {
    inputToken: firstInputToken,
    path: [],
    types: []
  });
  return exactOutput ? _ethers.ethers.solidityPacked(types.reverse(), path.reverse()) : _ethers.ethers.solidityPacked(types, path);
}
function computeTradePriceBreakdown(trade) {
  if (!trade) {
    return {
      priceImpactWithoutFee: void 0,
      lpFeeAmount: null
    };
  }
  const {
    routes,
    outputAmount,
    inputAmount
  } = trade;
  let feePercent = new _sdk.Percent(0);
  let outputAmountWithoutPriceImpact = _sdk.CurrencyAmount.fromRawAmount(trade.outputAmount.wrapped.currency, 0);
  for (const route of routes) {
    const {
      inputAmount: routeInputAmount,
      pools,
      percent
    } = route;
    const routeFeePercent = _internalConstants.ONE_HUNDRED_PERCENT.subtract(pools.reduce((currentFee, pool) => {
      return currentFee.multiply(_internalConstants.ONE_HUNDRED_PERCENT.subtract(v3FeeToPercent(pool.fee)));
    }, _internalConstants.ONE_HUNDRED_PERCENT));
    feePercent = feePercent.add(routeFeePercent.multiply(new _sdk.Percent(percent, 100)));
    const midPrice = (0, _route.getMidPrice)(route);
    outputAmountWithoutPriceImpact = outputAmountWithoutPriceImpact.add(midPrice.quote(routeInputAmount.wrapped));
  }
  if (outputAmountWithoutPriceImpact.quotient === _sdk.ZERO) {
    return {
      priceImpactWithoutFee: void 0,
      lpFeeAmount: null
    };
  }
  const priceImpactRaw = outputAmountWithoutPriceImpact.subtract(outputAmount.wrapped).divide(outputAmountWithoutPriceImpact);
  const priceImpactPercent = new _sdk.Percent(priceImpactRaw.numerator, priceImpactRaw.denominator);
  const priceImpactWithoutFee = priceImpactPercent.subtract(feePercent);
  const lpFeeAmount = inputAmount.multiply(feePercent);
  return {
    priceImpactWithoutFee,
    lpFeeAmount
  };
}
function v3FeeToPercent(fee) {
  return new _sdk.Percent(fee, 10000n * 100n);
}