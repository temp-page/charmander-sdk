import { BalanceAndAllowance } from "../Types";
import { TransactionEvent } from "../TransactionEvent";
import { ConnectInfo } from "../../../ConnectInfo";
import { TokenPrice } from "../tokenlist";
import { Token } from "../../tool";
import { Pool } from "../../tool/sdk/v3";
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
export interface PoolData {
    address: string;
    sqrtPriceX96: string;
    tick: string;
    feeProtocol: string;
    liquidity: string;
}
export interface PoolState {
    feeAmount: FeeAmount;
    pick: number;
    state: 'no create' | 'create';
}
export interface TickData {
    tick: number;
    liquidityNet: string;
    liquidityGross: string;
}
export interface TickProcessed {
    tick: number;
    liquidityActive: bigint;
    liquidityNet: bigint;
    price0: string;
}
export declare class AddLiquidityV3Info {
    static readonly RANGE_CONFIG: number[];
    poolState: PoolState[];
    token0: Token;
    token1: Token;
    token0Price: TokenPrice;
    token1Price: TokenPrice;
    token0Balance: BalanceAndAllowance;
    token1Balance: BalanceAndAllowance;
    feeAmount: FeeAmount;
    token0Amount: string;
    token1Amount: string;
    first: boolean;
    firstPrice: string;
    minPrice: string;
    maxPrice: string;
    pool: Pool;
    rate: '10' | '20' | '50' | 'full';
    tickLower: number;
    tickUpper: number;
    tickData: {
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    };
    updateFeeAmount: (feeAmount: FeeAmount) => void;
    updateAllTickInfo: () => Promise<{
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    }>;
    updateToken0: (amount: string) => string;
    updateToken1: (amount: string) => string;
    checkFirstPrice: (inputFirstPrice: string) => (boolean);
    updateFirstPrice: (inputFirstPrice: string) => void;
    setPriceRange: (minPrice: string | boolean, maxPrice: string | boolean) => {
        minPrice: string;
        maxPrice: string;
    };
    setRate: (rate: '10' | '20' | '50' | 'full') => {
        minPrice: string;
        maxPrice: string;
    };
    addLiquidity: (connect: ConnectInfo, allowedSlippage: string, deadline: string | number) => Promise<TransactionEvent>;
}
export interface PositionContractDetails {
    nonce: string;
    tokenId: string;
    operator: string;
    token0: string;
    token1: string;
    fee: string;
    tickLower: string;
    tickUpper: string;
    liquidity: string;
    feeGrowthInside0LastX128: string;
    feeGrowthInside1LastX128: string;
    tokensOwed0: string;
    tokensOwed1: string;
}
export declare class LiquidityDetails {
    index: string;
    tokenId: string;
    token0: Token;
    token1: Token;
    feeAmount: FeeAmount;
    minPrice: string;
    maxPrice: string;
    reverseMinPrice: string;
    reverseMaxPrice: string;
    state: 'active' | 'close';
}
