import type { ConnectInfo } from '../../ConnectInfo';
import { BaseAbi } from './BaseAbi';
export declare class AgniProjectPartyReward extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    claim(): Promise<import("..").TransactionEvent>;
}
