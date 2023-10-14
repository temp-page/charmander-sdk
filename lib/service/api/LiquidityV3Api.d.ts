import { BaseApi } from "./BaseApi";
import { AddLiquidityV3Info } from "../vo";
export declare class LiquidityV3Api {
    baseApi: BaseApi;
    constructor();
    info(): Promise<AddLiquidityV3Info>;
}
