import flatMap from 'lodash/flatMap';
import { ethers } from 'ethers';
import { getCurrentAddressInfo } from '../../../Constant';
import { eqAddress } from '../Tool';
import { getOutputCurrency } from '../v3route/functions/pool';
import { CurrencyAmount, Percent, ZERO } from '../sdk';
import { ONE_HUNDRED_PERCENT } from '../sdk/v3/internalConstants';
import { getMidPrice } from '../v3route/functions/route';
export function getPairCombinations(currencyA, currencyB) {
    const currentAddressInfo = getCurrentAddressInfo();
    const [tokenA, tokenB] = [currencyA, currencyB].sort((a, b) => a.sortsBefore(b) ? -1 : 1);
    const bases = currentAddressInfo.getApi().tokenMangerApi().tradeTokens();
    const basePairs = flatMap(bases, (base) => bases.map(otherBase => [base, otherBase]));
    const keySet = new Set();
    const result = [];
    [
        // the direct pair
        [tokenA, tokenB],
        // token A against all bases
        ...bases.map((base) => [tokenA, base]),
        // token B against all bases
        ...bases.map((base) => [tokenB, base]),
        // each base against all bases
        ...basePairs,
    ]
        .filter((tokens) => Boolean(tokens[0] && tokens[1]))
        .filter(([t0, t1]) => !eqAddress(t0.erc20Address(), t1.erc20Address()))
        .forEach((it) => {
        const [t0, t1] = it.sort((a, b) => a.sortsBefore(b) ? -1 : 1);
        const key = `${t0.erc20Address()}-${t1.erc20Address()}`;
        if (!keySet.has(key)) {
            keySet.add(key);
            result.push(it);
        }
    });
    return result;
}
export function encodeMixedRouteToPath(route, exactOutput) {
    const firstInputToken = route.input.wrapped;
    const { path, types } = route.pools.reduce(({ inputToken, path, types }, pool, index) => {
        const outputToken = getOutputCurrency(pool, inputToken).wrapped;
        const fee = pool.fee;
        if (index === 0) {
            return {
                inputToken: outputToken,
                types: ['address', 'uint24', 'address'],
                path: [inputToken.address, fee, outputToken.address],
            };
        }
        return {
            inputToken: outputToken,
            types: [...types, 'uint24', 'address'],
            path: [...path, fee, outputToken.address],
        };
    }, { inputToken: firstInputToken, path: [], types: [] });
    return exactOutput ? ethers.solidityPacked(types.reverse(), path.reverse()) : ethers.solidityPacked(types, path);
}
// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade) {
    if (!trade) {
        return {
            priceImpactWithoutFee: undefined,
            lpFeeAmount: null,
        };
    }
    const { routes, outputAmount, inputAmount } = trade;
    let feePercent = new Percent(0);
    let outputAmountWithoutPriceImpact = CurrencyAmount.fromRawAmount(trade.outputAmount.wrapped.currency, 0);
    for (const route of routes) {
        const { inputAmount: routeInputAmount, pools, percent } = route;
        const routeFeePercent = ONE_HUNDRED_PERCENT.subtract(pools.reduce((currentFee, pool) => {
            return currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(v3FeeToPercent(pool.fee)));
        }, ONE_HUNDRED_PERCENT));
        // Not accurate since for stable swap, the lp fee is deducted on the output side
        feePercent = feePercent.add(routeFeePercent.multiply(new Percent(percent, 100)));
        const midPrice = getMidPrice(route);
        outputAmountWithoutPriceImpact = outputAmountWithoutPriceImpact.add(midPrice.quote(routeInputAmount.wrapped));
    }
    if (outputAmountWithoutPriceImpact.quotient === ZERO) {
        return {
            priceImpactWithoutFee: undefined,
            lpFeeAmount: null,
        };
    }
    const priceImpactRaw = outputAmountWithoutPriceImpact
        .subtract(outputAmount.wrapped)
        .divide(outputAmountWithoutPriceImpact);
    const priceImpactPercent = new Percent(priceImpactRaw.numerator, priceImpactRaw.denominator);
    const priceImpactWithoutFee = priceImpactPercent.subtract(feePercent);
    const lpFeeAmount = inputAmount.multiply(feePercent);
    return {
        priceImpactWithoutFee,
        lpFeeAmount,
    };
}
function v3FeeToPercent(fee) {
    return new Percent(fee, 10000n * 100n);
}
