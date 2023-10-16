import { BaseApi } from "./BaseApi";
import { AddLiquidityV3Info, FeeAmount, Token } from "../vo";
export declare class PoolV3Api {
    baseApi: BaseApi;
    constructor();
    computePoolAddress(tokenA: Token, tokenB: Token, fee: FeeAmount): string;
    info(token0: Token, token1: Token): Promise<AddLiquidityV3Info>;
}
