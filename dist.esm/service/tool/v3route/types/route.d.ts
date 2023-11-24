import type { Currency, CurrencyAmount } from '../../sdk';
import type { V3Pool } from '../../../vo';
import type { GasCost } from './gasCost';
export declare enum RouteType {
    V3 = 0
}
export interface BaseRoute {
    type: RouteType;
    pools: V3Pool[];
    path: Currency[];
    input: Currency;
    output: Currency;
}
export interface RouteWithoutQuote extends BaseRoute {
    percent: number;
    amount: CurrencyAmount<Currency>;
}
export type RouteEssentials = Omit<RouteWithoutQuote, 'input' | 'output' | 'amount'>;
export interface Route extends RouteEssentials {
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
}
export interface RouteQuote extends GasCost {
    quoteAdjustedForGas: CurrencyAmount<Currency>;
    quote: CurrencyAmount<Currency>;
}
export type RouteWithQuote = RouteWithoutQuote & RouteQuote;
export type RouteWithoutGasEstimate = Omit<RouteWithQuote, 'quoteAdjustedForGas' | 'gasEstimate' | 'gasCostInToken' | 'gasCostInUSD'>;
export interface BestRoutes {
    gasEstimate: bigint;
    routes: Route[];
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
}
