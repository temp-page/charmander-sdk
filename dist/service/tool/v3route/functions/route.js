"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMidPrice = exports.getQuoteCurrency = exports.buildBaseRoute = void 0;
const types_1 = require("../types");
const pool_1 = require("./pool");
function buildBaseRoute(pools, currencyIn, currencyOut) {
    const path = [currencyIn.wrapped];
    let prevIn = path[0];
    let routeType = null;
    const updateRouteType = (pool, currentRouteType) => {
        if (currentRouteType === null)
            return getRouteTypeFromPool(pool);
        return currentRouteType;
    };
    for (const pool of pools) {
        prevIn = (0, pool_1.getOutputCurrency)(pool, prevIn);
        path.push(prevIn);
        routeType = updateRouteType(pool, routeType);
    }
    if (routeType === null)
        throw new Error(`Invalid route type when constructing base route`);
    return {
        path,
        pools,
        type: routeType,
        input: currencyIn,
        output: currencyOut,
    };
}
exports.buildBaseRoute = buildBaseRoute;
function getRouteTypeFromPool(pool) {
    return types_1.RouteType.V3;
}
function getQuoteCurrency({ input, output }, baseCurrency) {
    return baseCurrency.equals(input) ? output : input;
}
exports.getQuoteCurrency = getQuoteCurrency;
function getMidPrice({ path, pools }) {
    let i = 0;
    let price = null;
    for (const pool of pools) {
        const input = path[i].wrapped;
        const output = path[i + 1].wrapped;
        const poolPrice = (0, pool_1.getTokenPrice)(pool, input, output);
        price = price ? price.multiply(poolPrice) : poolPrice;
        i += 1;
    }
    if (!price)
        throw new Error('Get mid price failed');
    return price;
}
exports.getMidPrice = getMidPrice;
