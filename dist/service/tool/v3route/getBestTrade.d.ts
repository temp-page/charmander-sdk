import type { Currency, CurrencyAmount } from '../sdk';
import { TradeType } from '../sdk';
import type { SmartRouterTrade, TradeConfig } from './types';
export declare function getBestTrade(amount: CurrencyAmount<Currency>, currency: Currency, tradeType: TradeType, config: TradeConfig): Promise<SmartRouterTrade<TradeType> | null>;
