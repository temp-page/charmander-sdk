import type { ConnectInfo } from '../../ConnectInfo';
import { BaseAbi } from './BaseAbi';
export declare class AgniProjectPartyReward extends BaseAbi {
    constructor(connectInfo: ConnectInfo, address: string);
    claim(): Promise<import("..").TransactionEvent>;
}
