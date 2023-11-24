import type { Currency, Price } from '../../sdk';
import type { V3Pool } from '../../../vo';
import type { BaseRoute, Route } from '../types';
export declare function buildBaseRoute(pools: V3Pool[], currencyIn: Currency, currencyOut: Currency): BaseRoute;
export declare function getQuoteCurrency({ input, output }: BaseRoute, baseCurrency: Currency): import("../../sdk").Token;
export declare function getMidPrice({ path, pools }: Route): Price<import("../../sdk").Token, import("../../sdk").Token>;
