import type { Currency, Token, TradeType } from '../sdk';
import type { BaseRoute, SmartRouterTrade } from '../v3route/types';
import { CurrencyAmount, Percent } from '../sdk';
export declare function getPairCombinations(currencyA: Token, currencyB: Token): [Token, Token][];
export declare function encodeMixedRouteToPath(route: BaseRoute, exactOutput: boolean): string;
export declare function computeTradePriceBreakdown(trade?: SmartRouterTrade<TradeType> | null): {
    priceImpactWithoutFee?: Percent | null;
    lpFeeAmount?: CurrencyAmount<Currency> | null;
};
