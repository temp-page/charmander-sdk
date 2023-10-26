import { ConnectInfo } from '../../ConnectInfo';
import { BaseAbi } from './BaseAbi';
import { TransactionEvent } from "../vo";
export declare class IdoPoolAbi extends BaseAbi {
    constructor(connectInfo: ConnectInfo, address: string);
    enroll(): Promise<TransactionEvent>;
    presaleDeposit(buyQuota: string, buyInsurance: boolean): Promise<TransactionEvent>;
    publicSaleDeposit(buyInsurance: boolean, buyQuota: string, extraDeposit: string): Promise<TransactionEvent>;
    claim(): Promise<TransactionEvent>;
}
