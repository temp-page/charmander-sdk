import type { TransactionReceipt } from 'ethers';
import { ConnectInfo } from '../../ConnectInfo';
import { TransactionEvent } from "./TransactionEvent";
export interface Config {
    gasPrice?: string;
    gasLimit?: number;
    fromAddress?: string;
    value?: number | string;
}
export declare class ExtTransactionEvent extends TransactionEvent {
    private _data;
    private _config;
    constructor(connectInfo: ConnectInfo, data: string, config: Config);
    get data(): string;
    get config(): Config;
    confirm(): Promise<TransactionReceipt>;
}
