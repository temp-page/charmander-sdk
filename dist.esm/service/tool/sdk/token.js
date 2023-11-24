import { invariant } from '../math/Common';
import { getCurrentAddressInfo } from '../../../Constant';
import { DEFAULT_ICON, ETH_ADDRESS } from '../../vo';
import { isNullOrUndefined } from '../Tool';
import { BaseCurrency } from './baseCurrency';
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends BaseCurrency {
    static fromSerialized(serializedToken) {
        return new Token(serializedToken.chainId, serializedToken.address, serializedToken.decimals, serializedToken.symbol, serializedToken.name, serializedToken.logoURI);
    }
    constructor(chainId, address, decimals, symbol, name, logoURI) {
        super(chainId, decimals, symbol, name);
        this.address = address;
        this.logoURI = logoURI;
        this.isNative = this.address === ETH_ADDRESS;
        this.isToken = !this.isNative;
    }
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other) {
        return !isNullOrUndefined(other) && this.chainId === other.chainId && this.address === other.address;
    }
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other) {
        invariant(this.chainId === other.chainId, 'CHAIN_IDS');
        // console.log('this.address', this.address, other?.address)
        // invariant(this.address !== other?.address, 'ADDRESSES')
        return this.erc20Address().toLowerCase() < other?.erc20Address().toLowerCase();
    }
    get wrapped() {
        if (this.isNative)
            return getCurrentAddressInfo().getApi().tokenMangerApi().WNATIVE();
        return this;
    }
    get serialize() {
        return {
            address: this.address,
            chainId: this.chainId,
            decimals: this.decimals,
            symbol: this.symbol,
            name: this.name,
            logoURI: this.logoURI,
        };
    }
    erc20Address() {
        return this.address === ETH_ADDRESS ? getCurrentAddressInfo().WMNT : this.address;
    }
    iconUrl() {
        return this.logoURI ? this.logoURI : DEFAULT_ICON;
    }
    scanUrl() {
        return this.address === ETH_ADDRESS ? '' : getCurrentAddressInfo().getEtherscanAddress(this.address);
    }
}
