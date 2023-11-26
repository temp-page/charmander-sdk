import type { Token } from '../../sdk';
import type { V3Pool } from '../../../vo';
import type { RouteWithQuote, RouteWithoutQuote } from './route';
import type { GasModel } from './gasModel';
export interface PoolProvider {
    getCandidatePools: (tokenA: Token, tokenB: Token) => Promise<V3Pool[]>;
}
export interface QuoterOptions {
    gasModel: GasModel;
}
export interface QuoteProvider {
    getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>;
    getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>;
}
