"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildBaseRoute = buildBaseRoute;
exports.getMidPrice = getMidPrice;
exports.getQuoteCurrency = getQuoteCurrency;
var _types = require("../types/index.cjs");
var _pool = require("./pool.cjs");
function buildBaseRoute(pools, currencyIn, currencyOut) {
  const path = [currencyIn.wrapped];
  let prevIn = path[0];
  let routeType = null;
  const updateRouteType = (pool, currentRouteType) => {
    if (currentRouteType === null) return getRouteTypeFromPool(pool);
    return currentRouteType;
  };
  for (const pool of pools) {
    prevIn = (0, _pool.getOutputCurrency)(pool, prevIn);
    path.push(prevIn);
    routeType = updateRouteType(pool, routeType);
  }
  if (routeType === null) throw new Error(`Invalid route type when constructing base route`);
  return {
    path,
    pools,
    type: routeType,
    input: currencyIn,
    output: currencyOut
  };
}
function getRouteTypeFromPool(pool) {
  return _types.RouteType.V3;
}
function getQuoteCurrency({
  input,
  output
}, baseCurrency) {
  return baseCurrency.equals(input) ? output : input;
}
function getMidPrice({
  path,
  pools
}) {
  let i = 0;
  let price = null;
  for (const pool of pools) {
    const input = path[i].wrapped;
    const output = path[i + 1].wrapped;
    const poolPrice = (0, _pool.getTokenPrice)(pool, input, output);
    price = price ? price.multiply(poolPrice) : poolPrice;
    i += 1;
  }
  if (!price) throw new Error("Get mid price failed");
  return price;
}