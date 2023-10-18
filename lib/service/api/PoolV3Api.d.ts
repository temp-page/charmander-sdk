import { BaseApi } from "./BaseApi";
import { Token } from "../tool";
import { AddLiquidityV3Info, FeeAmount, LiquidityHistory, LiquidityInfo, LiquidityListData, TickData, TickProcessed } from "../vo";
import { ConnectInfo } from "../../ConnectInfo";
export declare class PoolV3Api {
    baseApi: BaseApi;
    constructor();
    myLiquidityList(connectInfo: ConnectInfo): Promise<{
        hideClosePosition: LiquidityListData[];
        allPosition: LiquidityListData[];
    }>;
    positionHistoryByTokenId(tokenId: string): Promise<LiquidityHistory[]>;
    myLiquidityByTokenId(connectInfo: ConnectInfo, tokenId: string): Promise<LiquidityInfo>;
    collectFeeData(tokenId: string, account: string): Promise<{
        amount0: string;
        amount1: string;
    }>;
    feeTierDistribution(token0: Token, token1: Token): Promise<Record<FeeAmount, number>>;
    allTickInfo(token0: Token, token1: Token, feeAmount: FeeAmount): Promise<{
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    }>;
    static computePoolAddress(tokenA: Token, tokenB: Token, fee: FeeAmount): string;
    private getPool;
    private parsePrice;
    addLiquidity(token0: Token, token1: Token, account: string): Promise<AddLiquidityV3Info>;
}
