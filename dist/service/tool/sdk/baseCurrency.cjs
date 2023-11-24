"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCurrency = void 0;
var _Common = require("../math/Common.cjs");
class BaseCurrency {
  /**
   * The chain ID on which this currency resides
   */
  chainId;
  /**
   * The decimals used in representing currency amounts
   */
  decimals;
  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  symbol;
  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  name;
  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  constructor(chainId, decimals, symbol, name) {
    (0, _Common.invariant)(Number.isSafeInteger(chainId), "CHAIN_ID");
    (0, _Common.invariant)(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "DECIMALS");
    this.chainId = chainId;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
}
exports.BaseCurrency = BaseCurrency;