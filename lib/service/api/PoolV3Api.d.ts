import { BaseApi } from "./BaseApi";
import { Token } from "../tool";
import { AddLiquidityV3Info, FeeAmount, LiquidityDetails, TickData, TickProcessed } from "../vo";
import { ConnectInfo } from "../../ConnectInfo";
export declare class PoolV3Api {
    baseApi: BaseApi;
    constructor();
    myLiquidity(connectInfo: ConnectInfo): Promise<{
        hideClosePosition: LiquidityDetails[];
        allPosition: LiquidityDetails[];
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
