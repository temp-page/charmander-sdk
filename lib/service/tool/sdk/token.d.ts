import { BaseCurrency } from './baseCurrency';
import { Currency } from './currency';
export interface SerializedToken {
    chainId: number;
    address: string;
    decimals: number;
    symbol: string;
    name?: string;
    logoURI?: string;
}
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export declare class Token extends BaseCurrency {
    readonly isNative: boolean;
    readonly isToken: boolean;
    /**
     * The contract address on the chain on which this token lives
     */
    readonly address: string;
    readonly logoURI?: string;
    static fromSerialized(serializedToken: SerializedToken): Token;
    constructor(chainId: number, address: string, decimals: number, symbol: string, name?: string, logoURI?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Currency): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
    /**
     * Return this token, which does not need to be wrapped
     */
    get wrapped(): Token;
    get serialize(): SerializedToken;
    erc20Address(): string;
    iconUrl(): string;
    scanUrl(): string;
}
