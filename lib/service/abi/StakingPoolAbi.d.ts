import { ConnectInfo } from '../../ConnectInfo';
import { BaseAbi } from './BaseAbi';
import { TransactionEvent } from "../vo";
export declare class StakingPoolAbi extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    stake(token: string, tokenIdOrAmount: string): Promise<TransactionEvent>;
    unstake(stakeIds: string[]): Promise<TransactionEvent>;
}
