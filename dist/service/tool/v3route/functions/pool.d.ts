import type { Currency, Price } from '../../sdk';
import type { V3Pool } from '../../../vo';
export declare function getOutputCurrency(pool: V3Pool, currencyIn: Currency): Currency;
export declare function getTokenPrice(pool: V3Pool, base: Currency, quote: Currency): Price<Currency, Currency>;
export declare function involvesCurrency(pool: V3Pool, currency: Currency): boolean;
