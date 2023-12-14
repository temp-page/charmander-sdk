import type { Currency, CurrencyAmount } from '../../sdk';
import type { V3Pool } from '../../../vo';
import type { GasCost } from './gasCost';
export interface L1ToL2GasCosts {
    gasUsedL1: bigint;
    gasCostL1USD: CurrencyAmount<Currency>;
    gasCostL1QuoteToken: CurrencyAmount<Currency>;
}
export interface GasEstimateRequiredInfo {
    initializedTickCrossedList: number[];
}
export interface GasModel {
    estimateGasCost: (pools: V3Pool[], initializedTickCrossedList: number[]) => GasCost;
}
