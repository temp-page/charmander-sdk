import forEach from 'lodash/forEach';
import sum from 'lodash/sum';
import BigNumber from 'bignumber.js';
import { CurrencyAmount, Price } from '../sdk';
import { getCurrentAddressInfo } from '../../../Constant';
import { BASE_SWAP_COST_V3, COST_PER_HOP_V3, COST_PER_INIT_TICK, COST_PER_UNINIT_TICK } from './constants';
export async function createGasModel({ gasPriceWei, quoteCurrency, }) {
    const currentAddressInfo = getCurrentAddressInfo();
    const nativeWrappedToken = currentAddressInfo.getApi().tokenMangerApi().WNATIVE();
    const USDTToken = currentAddressInfo.getApi().tokenMangerApi().USDT();
    const { chainId } = quoteCurrency;
    const gasPrice = BigInt(gasPriceWei);
    const tokenPrice = await currentAddressInfo.api.tokenMangerApi().tokenPrice(quoteCurrency, nativeWrappedToken);
    const estimateGasCost = (pools, initializedTickCrossedList) => {
        const totalInitializedTicksCrossed = BigInt(Math.max(1, sum(initializedTickCrossedList)));
        /**
         * Since we must make a separate call to multicall for each v3 and v2 section, we will have to
         * add the BASE_SWAP_COST to each section.
         */
        let baseGasUse = 0n;
        baseGasUse += BASE_SWAP_COST_V3(chainId);
        // for (const pool of pools) {
        //   baseGasUse += COST_PER_HOP_V3(chainId)
        //   continue
        // }
        forEach(pools, () => {
            baseGasUse += COST_PER_HOP_V3(chainId);
        });
        const tickGasUse = COST_PER_INIT_TICK(chainId) * totalInitializedTicksCrossed;
        const uninitializedTickGasUse = COST_PER_UNINIT_TICK * 0n;
        baseGasUse = baseGasUse + tickGasUse + uninitializedTickGasUse;
        const baseGasCostWei = gasPrice * baseGasUse;
        const totalGasCostNativeCurrency = CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei);
        const isQuoteNative = nativeWrappedToken.equals(quoteCurrency.wrapped);
        let gasCostInToken = CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, 0);
        let gasCostInUSD = CurrencyAmount.fromRawAmount(USDTToken, 0);
        const quoteCurrencyPrice = tokenPrice[0];
        const nativeWrappedTokenPrice = tokenPrice[1];
        try {
            if (isQuoteNative)
                gasCostInToken = totalGasCostNativeCurrency;
            if (!isQuoteNative) {
                const price = new Price(nativeWrappedToken, quoteCurrency, new BigNumber(1).multipliedBy(10 ** nativeWrappedToken.decimals).toFixed(0, BigNumber.ROUND_DOWN), new BigNumber(quoteCurrencyPrice.priceMNT).multipliedBy(10 ** quoteCurrency.decimals).toFixed(0, BigNumber.ROUND_DOWN));
                gasCostInToken = price.quote(totalGasCostNativeCurrency);
            }
            if (nativeWrappedTokenPrice) {
                const nativeTokenUsdPrice = new Price(nativeWrappedToken, USDTToken, new BigNumber(1).multipliedBy(10 ** nativeWrappedToken.decimals).toFixed(0, BigNumber.ROUND_DOWN), new BigNumber(quoteCurrencyPrice.priceUSD).multipliedBy(10 ** USDTToken.decimals).toFixed(0, BigNumber.ROUND_DOWN));
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
