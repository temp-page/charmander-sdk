"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGasModel = void 0;
const forEach_1 = __importDefault(require("lodash/forEach"));
const sum_1 = __importDefault(require("lodash/sum"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const sdk_1 = require("../sdk");
const Constant_1 = require("../../../Constant");
const constants_1 = require("./constants");
async function createGasModel({ gasPriceWei, quoteCurrency, }) {
    const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
    const nativeWrappedToken = currentAddressInfo.getApi().tokenMangerApi().WNATIVE();
    const USDTToken = currentAddressInfo.getApi().tokenMangerApi().USDT();
    const { chainId } = quoteCurrency;
    const gasPrice = BigInt(gasPriceWei);
    const tokenPrice = await currentAddressInfo.api.tokenMangerApi().tokenPrice(quoteCurrency, nativeWrappedToken);
    const estimateGasCost = (pools, initializedTickCrossedList) => {
        const totalInitializedTicksCrossed = BigInt(Math.max(1, (0, sum_1.default)(initializedTickCrossedList)));
        /**
         * Since we must make a separate call to multicall for each v3 and v2 section, we will have to
         * add the BASE_SWAP_COST to each section.
         */
        let baseGasUse = 0n;
        baseGasUse += (0, constants_1.BASE_SWAP_COST_V3)(chainId);
        // for (const pool of pools) {
        //   baseGasUse += COST_PER_HOP_V3(chainId)
        //   continue
        // }
        (0, forEach_1.default)(pools, () => {
            baseGasUse += (0, constants_1.COST_PER_HOP_V3)(chainId);
        });
        const tickGasUse = (0, constants_1.COST_PER_INIT_TICK)(chainId) * totalInitializedTicksCrossed;
        const uninitializedTickGasUse = constants_1.COST_PER_UNINIT_TICK * 0n;
        baseGasUse = baseGasUse + tickGasUse + uninitializedTickGasUse;
        const baseGasCostWei = gasPrice * baseGasUse;
        const totalGasCostNativeCurrency = sdk_1.CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei);
        const isQuoteNative = nativeWrappedToken.equals(quoteCurrency.wrapped);
        let gasCostInToken = sdk_1.CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, 0);
        let gasCostInUSD = sdk_1.CurrencyAmount.fromRawAmount(USDTToken, 0);
        const quoteCurrencyPrice = tokenPrice[0];
        const nativeWrappedTokenPrice = tokenPrice[1];
        try {
            if (isQuoteNative)
                gasCostInToken = totalGasCostNativeCurrency;
            if (!isQuoteNative) {
                const price = new sdk_1.Price(nativeWrappedToken, quoteCurrency, new bignumber_js_1.default(1).multipliedBy(10 ** nativeWrappedToken.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN), new bignumber_js_1.default(quoteCurrencyPrice.priceMNT).multipliedBy(10 ** quoteCurrency.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
                gasCostInToken = price.quote(totalGasCostNativeCurrency);
            }
            if (nativeWrappedTokenPrice) {
                const nativeTokenUsdPrice = new sdk_1.Price(nativeWrappedToken, USDTToken, new bignumber_js_1.default(1).multipliedBy(10 ** nativeWrappedToken.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN), new bignumber_js_1.default(quoteCurrencyPrice.priceUSD).multipliedBy(10 ** USDTToken.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
                gasCostInUSD = nativeTokenUsdPrice.quote(totalGasCostNativeCurrency);
            }
        }
        catch (e) {
            // console.warn('Cannot estimate gas cost', e)
        }
        return {
            gasEstimate: baseGasUse,
            gasCostInToken,
            gasCostInUSD,
        };
    };
    return {
        estimateGasCost,
    };
}
exports.createGasModel = createGasModel;
