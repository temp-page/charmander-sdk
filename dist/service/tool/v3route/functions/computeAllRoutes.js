"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAllRoutes = void 0;
const Tool_1 = require("../../Tool");
const route_1 = require("./route");
const pool_1 = require("./pool");
function computeAllRoutes(input, output, candidatePools, maxHops = 3) {
    Tool_1.Trace.debug('Computing routes from', candidatePools.length, 'pools');
    const poolsUsed = Array(candidatePools.length).fill(false);
    const routes = [];
    const computeRoutes = (currencyIn, currencyOut, currentRoute, _previousCurrencyOut) => {
        if (currentRoute.length > maxHops)
            return;
        if (currentRoute.length > 0 && (0, pool_1.involvesCurrency)(currentRoute[currentRoute.length - 1], currencyOut)) {
            routes.push((0, route_1.buildBaseRoute)([...currentRoute], currencyIn, currencyOut));
            return;
        }
        for (let i = 0; i < candidatePools.length; i++) {
            if (poolsUsed[i])
                continue;
            const curPool = candidatePools[i];
            const previousCurrencyOut = _previousCurrencyOut || currencyIn;
            if (!(0, pool_1.involvesCurrency)(curPool, previousCurrencyOut))
                continue;
            const currentTokenOut = (0, pool_1.getOutputCurrency)(curPool, previousCurrencyOut);
            currentRoute.push(curPool);
            poolsUsed[i] = true;
            computeRoutes(currencyIn, currencyOut, currentRoute, currentTokenOut);
            poolsUsed[i] = false;
            currentRoute.pop();
        }
    };
    computeRoutes(input, output, []);
    Tool_1.Trace.debug('Computed routes from', candidatePools.length, 'pools', routes.length, 'routes');
    return routes;
}
exports.computeAllRoutes = computeAllRoutes;
