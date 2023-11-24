"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AgniTokenListSchema", {
  enumerable: true,
  get: function () {
    return _AgniTokenListSchema.default;
  }
});
exports.TokenSelectInfo = exports.TokenPrice = exports.TokenManagerInfo = exports.TokenManagerAddInfo = exports.TokenListInfo = exports.StorageTokenListInfo = void 0;
var _AgniTokenListSchema = _interopRequireDefault(require("./AgniTokenListSchema.json"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class StorageTokenListInfo {
  url;
  enable;
}
exports.StorageTokenListInfo = StorageTokenListInfo;
class TokenManagerAddInfo {
  active;
  token;
  import = () => {};
}
exports.TokenManagerAddInfo = TokenManagerAddInfo;
class TokenManagerInfo {
  token;
  remove = () => {};
}
exports.TokenManagerInfo = TokenManagerInfo;
class TokenSelectInfo {
  token;
  balance;
}
exports.TokenSelectInfo = TokenSelectInfo;
class TokenPrice {
  token;
  priceUSD;
  priceMNT;
  constructor(token, priceUSD, priceMNT) {
    this.token = token;
    this.priceUSD = priceUSD;
    this.priceMNT = priceMNT;
  }
}
exports.TokenPrice = TokenPrice;
class TokenListInfo {
  storageTokenListInfo;
  tokenList;
  showRemove;
  remove = () => {};
  updateEnable = () => {};
  tokenListUrl = () => {
    return `https://tokenlists.org/token-list?url=${this.storageTokenListInfo.url}`;
  };
  version = () => {
    return `${this.tokenList.version.major}.${this.tokenList.version.minor}.${this.tokenList.version.patch}`;
  };
}
exports.TokenListInfo = TokenListInfo;