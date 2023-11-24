import AgniTokenListSchema from "./AgniTokenListSchema.json";
export {
  AgniTokenListSchema
};
export class StorageTokenListInfo {
  url;
  enable;
}
export class TokenManagerAddInfo {
  active;
  token;
  import = () => {
  };
}
export class TokenManagerInfo {
  token;
  remove = () => {
  };
}
export class TokenSelectInfo {
  token;
  balance;
}
export class TokenPrice {
  token;
  priceUSD;
  priceMNT;
  constructor(token, priceUSD, priceMNT) {
    this.token = token;
    this.priceUSD = priceUSD;
    this.priceMNT = priceMNT;
  }
}
export class TokenListInfo {
  storageTokenListInfo;
  tokenList;
  showRemove;
  remove = () => {
  };
  updateEnable = () => {
  };
  tokenListUrl = () => {
    return `https://tokenlists.org/token-list?url=${this.storageTokenListInfo.url}`;
  };
  version = () => {
    return `${this.tokenList.version.major}.${this.tokenList.version.minor}.${this.tokenList.version.patch}`;
  };
}
