import type { BigintIsh, Currency, CurrencyAmount, TradeType } from '../../sdk';
import type { Route } from './route';
import type { PoolProvider, QuoteProvider } from './providers';
export interface SmartRouterTrade<TTradeType extends TradeType> {
    tradeType: TTradeType;
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
    routes: Route[];
    gasEstimate: bigint;
}
export interface TradeConfig {
    gasPriceWei: BigintIsh;
    poolProvider: PoolProvider;
    quoteProvider: QuoteProvider;
    maxHops?: number;
    maxSplits?: number;
    distributionPercent?: number;
}
export interface RouteConfig extends TradeConfig {
}
