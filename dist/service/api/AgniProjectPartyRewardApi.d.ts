import type { ProjectPartyReward, ProjectPartyUserLp } from '../vo';
import { ProjectPartyRewardResult } from '../vo';
import type { BaseApi } from './BaseApi';
export declare class AgniProjectPartyRewardApi {
    baseApi: BaseApi;
    constructor();
    projectPartyReward(): Promise<ProjectPartyReward>;
    userLPTokenIds(address: string): Promise<ProjectPartyUserLp[]>;
    result(account: string): Promise<ProjectPartyRewardResult>;
}
