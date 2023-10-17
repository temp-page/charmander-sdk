import { BaseApi } from "./BaseApi";
import { Token } from "../tool";
import { AddLiquidityV3Info, FeeAmount } from "../vo";
export declare class PoolV3Api {
    baseApi: BaseApi;
    constructor();
    static computePoolAddress(tokenA: Token, tokenB: Token, fee: FeeAmount): string;
    private getPool;
    addLiquidity(token0: Token, token1: Token, account: string): Promise<AddLiquidityV3Info>;
}
