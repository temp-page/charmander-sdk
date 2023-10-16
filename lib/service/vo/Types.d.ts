import { TransactionEvent } from "./TransactionEvent";
import { ConnectInfo } from "../../ConnectInfo";
export declare const ETH_ADDRESS = "MNT";
export declare const DEFAULT_ICON: string;
export interface SerializedToken {
    chainId: number;
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    logoURI: string;
}
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
}
export declare class Token implements SerializedToken {
    chainId: number;
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    logoURI: string;
    constructor(address: string, decimals: number, symbol: string, name: string, logoURI: string);
    static fromSerialized(serialized: SerializedToken): Token;
    equals(other: Token): boolean;
    sortsBefore(other: Token): boolean;
    erc20Address(): string;
    get serialize(): SerializedToken;
    iconUrl(): string;
    scanUrl(): string;
}
