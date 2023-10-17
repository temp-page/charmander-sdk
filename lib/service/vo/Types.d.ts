import { TransactionEvent } from "./TransactionEvent";
import { ConnectInfo } from "../../ConnectInfo";
import { Token } from "../tool/sdk";
export declare const ETH_ADDRESS = "MNT";
export declare const DEFAULT_ICON: string;
export declare class Balance {
    token: Token;
    user: string;
    balance: string;
    constructor(token: Token, user: string, balance: string);
}
export declare class BalanceAndAllowance extends Balance {
    allowance: string;
    spender: string;
    constructor(token: Token, user: string, balance: string, allowance: string, spender: string);
    showApprove(inputAmount: string): boolean;
    approve(connectInfo: ConnectInfo): Promise<TransactionEvent>;
    static unavailable(token: Token): BalanceAndAllowance;
}
