import { Trace } from '../../Tool';
import { buildBaseRoute } from './route';
import { getOutputCurrency, involvesCurrency } from './pool';
export function computeAllRoutes(input, output, candidatePools, maxHops = 3) {
    Trace.debug('Computing routes from', candidatePools.length, 'pools');
    const poolsUsed = Array(candidatePools.length).fill(false);
    const routes = [];
    const computeRoutes = (currencyIn, currencyOut, currentRoute, _previousCurrencyOut) => {
        if (currentRoute.length > maxHops)
            return;
        if (currentRoute.length > 0 && involvesCurrency(currentRoute[currentRoute.length - 1], currencyOut)) {
            routes.push(buildBaseRoute([...currentRoute], currencyIn, currencyOut));
            return;
        }
        for (let i = 0; i < candidatePools.length; i++) {
            if (poolsUsed[i])
                continue;
            const curPool = candidatePools[i];
            const previousCurrencyOut = _previousCurrencyOut || currencyIn;
            if (!involvesCurrency(curPool, previousCurrencyOut))
                continue;
            const currentTokenOut = getOutputCurrency(curPool, previousCurrencyOut);
            currentRoute.push(curPool);
            poolsUsed[i] = true;
            computeRoutes(currencyIn, currencyOut, currentRoute, currentTokenOut);
            poolsUsed[i] = false;
            currentRoute.pop();
        }
    };
    computeRoutes(input, output, []);
    Trace.debug('Computed routes from', candidatePools.length, 'pools', routes.length, 'routes');
    return routes;
}
