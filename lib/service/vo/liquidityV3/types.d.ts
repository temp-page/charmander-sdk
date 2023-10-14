import { Token } from "../Types";
import { TransactionEvent } from "../TransactionEvent";
import { ConnectInfo } from "../../../ConnectInfo";
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 2500,
    HIGH = 10000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
export declare enum RangeConfig {
    NONE = 0,
    R10 = 10,
    R20 = 20,
    R50 = 50,
    R100 = 100
}
export declare class AddLiquidityV3Info {
    static readonly FEE_TIER_CONFIG: number[];
    static readonly RANGE_CONFIG: number[];
    token0: Token;
    token1: Token;
    feeTier: FeeAmount;
    token0Amount: string;
    token1Amount: string;
    first: boolean;
    firstPrice: string;
    minPrice: string;
    maxPrice: string;
    rate: number;
    updateFeeTier: (feeTier: boolean) => Promise<void>;
    updateToken0: (amount: string) => Promise<void>;
    updateToken1: (amount: string) => Promise<void>;
    updateFirstPrice: (amount: string) => Promise<void>;
    setPriceRange: (minPrice: string, maxPrice: string) => Promise<void>;
    setRate: (rate: string) => Promise<void>;
    addLiquidity: (connect: ConnectInfo) => Promise<TransactionEvent>;
}
