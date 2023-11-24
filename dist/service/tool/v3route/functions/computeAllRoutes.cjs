"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeAllRoutes = computeAllRoutes;
var _Tool = require("../../Tool.cjs");
var _route = require("./route.cjs");
var _pool = require("./pool.cjs");
function computeAllRoutes(input, output, candidatePools, maxHops = 3) {
  _Tool.Trace.debug("Computing routes from", candidatePools.length, "pools");
  const poolsUsed = Array(candidatePools.length).fill(false);
  const routes = [];
  const computeRoutes = (currencyIn, currencyOut, currentRoute, _previousCurrencyOut) => {
    if (currentRoute.length > maxHops) return;
    if (currentRoute.length > 0 && (0, _pool.involvesCurrency)(currentRoute[currentRoute.length - 1], currencyOut)) {
      routes.push((0, _route.buildBaseRoute)([...currentRoute], currencyIn, currencyOut));
      return;
    }
    for (let i = 0; i < candidatePools.length; i++) {
      if (poolsUsed[i]) continue;
      const curPool = candidatePools[i];
      const previousCurrencyOut = _previousCurrencyOut || currencyIn;
      if (!(0, _pool.involvesCurrency)(curPool, previousCurrencyOut)) continue;
      const currentTokenOut = (0, _pool.getOutputCurrency)(curPool, previousCurrencyOut);
      currentRoute.push(curPool);
      poolsUsed[i] = true;
      computeRoutes(currencyIn, currencyOut, currentRoute, currentTokenOut);
      poolsUsed[i] = false;
      currentRoute.pop();
    }
  };
  computeRoutes(input, output, []);
  _Tool.Trace.debug("Computed routes from", candidatePools.length, "pools", routes.length, "routes");
  return routes;
}