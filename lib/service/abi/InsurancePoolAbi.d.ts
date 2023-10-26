import { ConnectInfo } from '../../ConnectInfo';
import { BaseAbi } from './BaseAbi';
import { TransactionEvent } from "../vo";
export declare class InsurancePoolAbi extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    claimLoss(insuranceId: string): Promise<TransactionEvent>;
}
