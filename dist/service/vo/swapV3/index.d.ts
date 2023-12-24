import type { FeeAmount } from '../liquidityV3';
import type { Tick } from '../../tool/sdk/v3';
import type { BalanceAndAllowance } from '../Types';
import type { TransactionEvent } from '../TransactionEvent';
import type { ConnectInfo } from '../../../ConnectInfo';
import type { SmartRouterTrade } from '../../tool/v3route/types';
import type { TokenPrice } from '../tokenlist';
import { Currency, CurrencyAmount, Percent, Token, TradeType } from "../../tool/sdk";
export declare enum PoolType {
    V2 = 0,
    V3 = 1
}
export interface BasePool {
    type: PoolType;
    token0: Token;
    token1: Token;
    address: string;
}
export interface V2Pool extends BasePool {
    type: PoolType.V2;
    reserve0: CurrencyAmount<Currency>;
    reserve1: CurrencyAmount<Currency>;
}
export interface V3Pool extends BasePool {
    type: PoolType.V3;
    fee: FeeAmount;
    liquidity: bigint;
    sqrtRatioX96: bigint;
    tick: number;
    token0ProtocolFee: Percent;
    token1ProtocolFee: Percent;
    ticks?: Tick[];
}
export type Pool = V3Pool | V2Pool;
export interface WithTvl {
    tvlUSD: bigint;
}
export type V3PoolWithTvl = V3Pool & WithTvl;
export type V2PoolWithTvl = V2Pool & WithTvl;
export interface SwapConfig {
    gasPriceWei: string;
    allowedSlippage: string;
    allowMultiHops: boolean;
    allowSplitRouting: boolean;
    allowedPoolTypes: PoolType[];
}
export interface SwapTokenPriceHistory {
    datas: {
        price: string;
        time: number;
    }[];
    lastPrice: string;
    change24h: string;
    change: string;
}
export type SwapTokenPriceType = 'year' | 'month' | 'week' | 'day';
export declare class SwapInfo {
    token0: Token;
    token1: Token;
    isWrap: boolean;
    token0Amount: string;
    token1Amount: string;
    token0Balance: BalanceAndAllowance;
    token1Balance: BalanceAndAllowance;
    token0Price: TokenPrice;
    token1Price: TokenPrice;
    intputToken: Token;
    inputAmount: string;
    swapConfig: SwapConfig;
    token0SwapPrice: string;
    token1SwapPrice: string;
    maximumSold: string;
    minimumReceived: string;
    tradingFee: string;
    priceImpact: string;
    trade: SmartRouterTrade<TradeType>;
    wrapType: 'wrap' | 'unwrap';
    canSwap: boolean;
    tokenPriceType: SwapTokenPriceType;
    tokenPrice: SwapTokenPriceHistory;
    updateInput: (inputToken: Token, inputAmount: string, swapConfig: SwapConfig) => Promise<void>;
    swap: (connectInfo: ConnectInfo, recipientAddr: string, deadline: string | number) => Promise<TransactionEvent>;
    wrap: (connectInfo: ConnectInfo) => Promise<TransactionEvent>;
    update: () => Promise<void>;
    getTokenPrice: (type: SwapTokenPriceType) => Promise<void>;
}
