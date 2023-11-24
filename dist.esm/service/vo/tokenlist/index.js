import AgniTokenListSchema from './AgniTokenListSchema.json';
export { AgniTokenListSchema, };
export class StorageTokenListInfo {
}
export class TokenManagerAddInfo {
    constructor() {
        this.import = () => {
        };
    }
}
export class TokenManagerInfo {
    constructor() {
        this.remove = () => {
        };
    }
}
export class TokenSelectInfo {
}
export class TokenPrice {
    constructor(token, priceUSD, priceMNT) {
        this.token = token;
        this.priceUSD = priceUSD;
        this.priceMNT = priceMNT;
    }
}
export class TokenListInfo {
    constructor() {
        this.remove = () => {
        };
        this.updateEnable = () => {
        };
        this.tokenListUrl = () => {
            return `https://tokenlists.org/token-list?url=${this.storageTokenListInfo.url}`;
        };
        this.version = () => {
            return `${this.tokenList.version.major}.${this.tokenList.version.minor}.${this.tokenList.version.patch}`;
        };
    }
}
