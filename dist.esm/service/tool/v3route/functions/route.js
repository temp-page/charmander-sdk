import { RouteType } from '../types';
import { getOutputCurrency, getTokenPrice } from './pool';
export function buildBaseRoute(pools, currencyIn, currencyOut) {
    const path = [currencyIn.wrapped];
    let prevIn = path[0];
    let routeType = null;
    const updateRouteType = (pool, currentRouteType) => {
        if (currentRouteType === null)
            return getRouteTypeFromPool(pool);
        return currentRouteType;
    };
    for (const pool of pools) {
        prevIn = getOutputCurrency(pool, prevIn);
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
function getRouteTypeFromPool(pool) {
    return RouteType.V3;
}
export function getQuoteCurrency({ input, output }, baseCurrency) {
    return baseCurrency.equals(input) ? output : input;
}
export function getMidPrice({ path, pools }) {
    let i = 0;
    let price = null;
    for (const pool of pools) {
        const input = path[i].wrapped;
        const output = path[i + 1].wrapped;
        const poolPrice = getTokenPrice(pool, input, output);
        price = price ? price.multiply(poolPrice) : poolPrice;
        i += 1;
    }
    if (!price)
        throw new Error('Get mid price failed');
    return price;
}
