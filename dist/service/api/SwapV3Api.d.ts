import { SwapInfo } from '../vo';
import type { Token } from '../tool';
import type { BaseApi } from './BaseApi';
export declare class SwapV3Api {
    baseApi: BaseApi;
    constructor();
    private getPoolMetaData;
    private getCandidatePoolsOnGraphNode;
    private getCandidatePoolsByToken;
    private getCandidatePoolsByPair;
    swapInfo(token0: Token, token1: Token, account: string): Promise<SwapInfo>;
    private getBestTrade;
}
