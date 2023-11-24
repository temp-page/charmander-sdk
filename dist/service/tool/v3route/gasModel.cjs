"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGasModel = createGasModel;
var _forEach = _interopRequireDefault(require("lodash/forEach"));
var _sum = _interopRequireDefault(require("lodash/sum"));
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _sdk = require("../sdk/index.cjs");
var _Constant = require("../../../Constant.cjs");
var _constants = require("./constants/index.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function createGasModel({
  gasPriceWei,
  quoteCurrency
}) {
  const currentAddressInfo = (0, _Constant.getCurrentAddressInfo)();
  const nativeWrappedToken = currentAddressInfo.getApi().tokenMangerApi().WNATIVE();
  const USDTToken = currentAddressInfo.getApi().tokenMangerApi().USDT();
  const {
    chainId
  } = quoteCurrency;
  const gasPrice = BigInt(gasPriceWei);
  const tokenPrice = await currentAddressInfo.api.tokenMangerApi().tokenPrice(quoteCurrency, nativeWrappedToken);
  const estimateGasCost = (pools, initializedTickCrossedList) => {
    const totalInitializedTicksCrossed = BigInt(Math.max(1, (0, _sum.default)(initializedTickCrossedList)));
    let baseGasUse = 0n;
    baseGasUse += (0, _constants.BASE_SWAP_COST_V3)(chainId);
    (0, _forEach.default)(pools, () => {
      baseGasUse += (0, _constants.COST_PER_HOP_V3)(chainId);
    });
    const tickGasUse = (0, _constants.COST_PER_INIT_TICK)(chainId) * totalInitializedTicksCrossed;
    const uninitializedTickGasUse = _constants.COST_PER_UNINIT_TICK * 0n;
    baseGasUse = baseGasUse + tickGasUse + uninitializedTickGasUse;
    const baseGasCostWei = gasPrice * baseGasUse;
    const totalGasCostNativeCurrency = _sdk.CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei);
    const isQuoteNative = nativeWrappedToken.equals(quoteCurrency.wrapped);
    let gasCostInToken = _sdk.CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, 0);
    let gasCostInUSD = _sdk.CurrencyAmount.fromRawAmount(USDTToken, 0);
    const quoteCurrencyPrice = tokenPrice[0];
    const nativeWrappedTokenPrice = tokenPrice[1];
    try {
      if (isQuoteNative) gasCostInToken = totalGasCostNativeCurrency;
      if (!isQuoteNative) {
        const price = new _sdk.Price(nativeWrappedToken, quoteCurrency, new _bignumber.default(1).multipliedBy(10 ** nativeWrappedToken.decimals).toFixed(0, _bignumber.default.ROUND_DOWN), new _bignumber.default(quoteCurrencyPrice.priceMNT).multipliedBy(10 ** quoteCurrency.decimals).toFixed(0, _bignumber.default.ROUND_DOWN));
        gasCostInToken = price.quote(totalGasCostNativeCurrency);
      }
      if (nativeWrappedTokenPrice) {
        const nativeTokenUsdPrice = new _sdk.Price(nativeWrappedToken, USDTToken, new _bignumber.default(1).multipliedBy(10 ** nativeWrappedToken.decimals).toFixed(0, _bignumber.default.ROUND_DOWN), new _bignumber.default(quoteCurrencyPrice.priceUSD).multipliedBy(10 ** USDTToken.decimals).toFixed(0, _bignumber.default.ROUND_DOWN));
        gasCostInUSD = nativeTokenUsdPrice.quote(totalGasCostNativeCurrency);
      }
    } catch (e) {}
    return {
      gasEstimate: baseGasUse,
      gasCostInToken,
      gasCostInUSD
    };
  };
  return {
    estimateGasCost
  };
}