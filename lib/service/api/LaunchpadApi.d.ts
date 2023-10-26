import { BaseApi } from "./BaseApi";
import { IDOPoolDetail, IdoPoolInfos, LaunchpadStakeDetail } from "../vo";
export declare class LaunchpadApi {
    baseApi: BaseApi;
    constructor();
    private getUserStakeInfoByGql;
    staking(account?: string): Promise<LaunchpadStakeDetail>;
    private getTokenPriceHistory;
    private fetchPools;
    getTokenPrice(address: string): Promise<string>;
    getAllTimeHighPrice(address: string): Promise<string>;
    getPools(): Promise<IdoPoolInfos>;
    private getUserDepositedLogsByPool;
    private getPoolInfoByGql;
    poolDetail(pool: string, account?: string): Promise<IDOPoolDetail>;
}
