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
    get serialize(): SerializedToken;
    iconUrl(): string;
    scanUrl(): string;
}
