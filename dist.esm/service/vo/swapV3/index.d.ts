import type { Percent, Token, TradeType } from '../../tool';
import type { FeeAmount } from '../liquidityV3';
import type { Tick } from '../../tool/sdk/v3';
import type { BalanceAndAllowance } from '../Types';
import type { TransactionEvent } from '../TransactionEvent';
import type { ConnectInfo } from '../../../ConnectInfo';
import type { SmartRouterTrade } from '../../tool/v3route/types';
import type { TokenPrice } from '../tokenlist';
export interface V3Pool {
    token0: Token;
    token1: Token;
    fee: FeeAmount;
    liquidity: bigint;
    sqrtRatioX96: bigint;
    tick: number;
    address: string;
    token0ProtocolFee: Percent;
    token1ProtocolFee: Percent;
    ticks?: Tick[];
}
export interface WithTvl {
    tvlUSD: bigint;
}
export type V3PoolWithTvl = V3Pool & WithTvl;
export interface SwapConfig {
    gasPriceWei: string;
    allowedSlippage: string;
    allowMultiHops: boolean;
    allowSplitRouting: boolean;
}
export interface SwapTokenPriceHistory {
    datas: {
        price: string;
        time: number;
    }[];
    lastPrice: string;
}
export interface SwapTokenPrice {
    token0: SwapTokenPriceHistory;
    token1: SwapTokenPriceHistory;
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
    isWrapped: boolean;
    wrapType: 'wrap' | 'unwrap';
    canSwap: boolean;
    tokenPriceType: SwapTokenPriceType;
    tokenPrice: SwapTokenPrice;
    updateInput: (inputToken: Token, inputAmount: string, swapConfig: SwapConfig) => Promise<void>;
    swap: (connectInfo: ConnectInfo, recipientAddr: string, deadline: string | number) => Promise<TransactionEvent>;
    wrap: (connectInfo: ConnectInfo) => Promise<TransactionEvent>;
    update: () => Promise<void>;
    getTokenPrice: (type: SwapTokenPriceType) => Promise<void>;
}
