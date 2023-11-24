import type { PoolSelectorConfig, PoolSelectorConfigChainMap, TokenPoolSelectorConfigChainMap } from '../types';
import type { Currency } from '../../sdk';
import type { V3PoolWithTvl } from '../../../vo';
export declare const DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfig;
export declare const V3_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap;
export declare const V3_TOKEN_POOL_SELECTOR_CONFIG: TokenPoolSelectorConfigChainMap;
export declare const v3PoolTvlSelector: (currencyA: Currency | undefined, currencyB: Currency | undefined, unorderedPoolsWithTvl: V3PoolWithTvl[]) => Omit<V3PoolWithTvl, "tvlUSD">[];
