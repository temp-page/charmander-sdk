import { BaseApi } from "./BaseApi";
import { Price, Token } from "../tool";
import { AddLiquidityV3Info, FeeAmount, TickData, TickProcessed } from "../vo";
export declare class PoolV3Api {
    baseApi: BaseApi;
    constructor();
    feeTierDistribution(token0: Token, token1: Token): Promise<Record<FeeAmount, number>>;
    allTickInfo(token0: Token, token1: Token, feeAmount: FeeAmount): Promise<{
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    }>;
    static computePoolAddress(tokenA: Token, tokenB: Token, fee: FeeAmount): string;
    private getPool;
    parsePrice(token0: Token, token1: Token, inputFirstPrice: string): Price<Token, Token>;
    addLiquidity(token0: Token, token1: Token, account: string): Promise<AddLiquidityV3Info>;
}
