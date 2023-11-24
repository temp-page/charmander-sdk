import { MAX_FEE, ONE_HUNDRED_PERCENT, ZERO_PERCENT } from '../internalConstants';
import { CurrencyAmount, Fraction } from '../../fractions';
import { MaxUint256, ZERO } from '../../constants';
import { invariant } from '../../../math/Common';
import { Tick } from '../tick';
import { TickList } from './tickList';
import { PositionMath } from './positionMath';
import { TickMath } from './tickMath';
import { maxLiquidityForAmounts } from './maxLiquidityForAmounts';
export const FeeCalculator = {
    getEstimatedLPFee,
    getEstimatedLPFeeByAmounts,
    getLiquidityFromTick,
    getLiquidityFromSqrtRatioX96,
    getAverageLiquidity,
    getLiquidityBySingleAmount,
    getDependentAmount,
    getLiquidityByAmountsAndPrice,
    getAmountsByLiquidityAndPrice,
    getAmountsAtNewPrice,
};
export function parseNumberToFraction(num, precision = 6) {
    if (Number.isNaN(num) || !Number.isFinite(num))
        return undefined;
    const scalar = 10 ** precision;
    return new Fraction(BigInt(Math.floor(num * scalar)), BigInt(scalar));
}
export function getEstimatedLPFeeWithProtocolFee({ amount, currency, ...rest }) {
    return getEstimatedLPFeeByAmountsWithProtocolFee({
        ...rest,
        amountA: amount,
        amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
    });
}
export function getEstimatedLPFee({ amount, currency, ...rest }) {
    return getEstimatedLPFeeByAmounts({
        ...rest,
        amountA: amount,
        amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
    });
}
export function getEstimatedLPFeeByAmountsWithProtocolFee(options) {
    try {
        return tryGetEstimatedLPFeeByAmounts(options);
    }
    catch (e) {
        console.error(e);
        return new Fraction(ZERO);
    }
}
export function getEstimatedLPFeeByAmounts({ protocolFee = ZERO_PERCENT, ...rest }) {
    try {
        const fee = tryGetEstimatedLPFeeByAmounts(rest);
        return ONE_HUNDRED_PERCENT.subtract(protocolFee).multiply(fee).asFraction;
    }
    catch (e) {
        console.error(e);
        return new Fraction(ZERO);
    }
}
function tryGetEstimatedLPFeeByAmounts({ amountA, amountB, volume24H, sqrtRatioX96, tickLower, tickUpper, mostActiveLiquidity, fee, insidePercentage = ONE_HUNDRED_PERCENT, }) {
    invariant(!Number.isNaN(fee) && fee >= 0, 'INVALID_FEE');
    const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
    if (tickCurrent < tickLower || tickCurrent > tickUpper)
        return new Fraction(ZERO);
    const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice({
        amountA,
        amountB,
        tickUpper,
        tickLower,
        sqrtRatioX96,
    });
    const volumeInFraction = parseNumberToFraction(volume24H) || new Fraction(ZERO);
    return insidePercentage
        .multiply(volumeInFraction.multiply(BigInt(fee)).multiply(liquidity))
        .divide(MAX_FEE * (liquidity + mostActiveLiquidity)).asFraction;
}
export function getDependentAmount(options) {
    const { currency, amount, sqrtRatioX96, tickLower, tickUpper } = options;
    const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
    const liquidity = FeeCalculator.getLiquidityBySingleAmount(options);
    const isToken0 = currency.wrapped.sortsBefore(amount.currency.wrapped);
    const getTokenAmount = isToken0 ? PositionMath.getToken0Amount : PositionMath.getToken1Amount;
    return CurrencyAmount.fromRawAmount(currency, getTokenAmount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity));
}
export function getLiquidityBySingleAmount({ amount, currency, ...rest }) {
    return getLiquidityByAmountsAndPrice({
        amountA: amount,
        amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
        ...rest,
    });
}
export function getLiquidityByAmountsAndPrice({ amountA, amountB, tickUpper, tickLower, sqrtRatioX96, }) {
    const isToken0 = amountA.currency.wrapped.sortsBefore(amountB.currency.wrapped);
    const [inputAmount0, inputAmount1] = isToken0
        ? [amountA.quotient, amountB.quotient]
        : [amountB.quotient, amountA.quotient];
    const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return maxLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true);
}
export function getAmountsByLiquidityAndPrice(options) {
    const { currencyA, currencyB, liquidity, sqrtRatioX96, tickLower, tickUpper } = options;
    const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
    const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
    const adjustedAmount0 = PositionMath.getToken0Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity);
    const adjustedAmount1 = PositionMath.getToken1Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity);
    return [
        CurrencyAmount.fromRawAmount(currencyA, isToken0 ? adjustedAmount0 : adjustedAmount1),
        CurrencyAmount.fromRawAmount(currencyB, isToken0 ? adjustedAmount1 : adjustedAmount0),
    ];
}
export function getAmountsAtNewPrice({ newSqrtRatioX96, ...rest }) {
    const { tickLower, tickUpper, amountA, amountB } = rest;
    const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice(rest);
    return FeeCalculator.getAmountsByLiquidityAndPrice({
        liquidity,
        currencyA: amountA.currency,
        currencyB: amountB.currency,
        tickLower,
        tickUpper,
        sqrtRatioX96: newSqrtRatioX96,
    });
}
export function getAverageLiquidity(ticks, tickSpacing, tickLower, tickUpper) {
    invariant(tickLower <= tickUpper, 'INVALID_TICK_RANGE');
    TickList.validateList(ticks, tickSpacing);
    if (tickLower === tickUpper)
        return FeeCalculator.getLiquidityFromTick(ticks, tickLower);
    const lowerOutOfBound = tickLower < ticks[0].index;
    let lastTick = lowerOutOfBound
        ? new Tick({ index: TickMath.MIN_TICK, liquidityNet: ZERO, liquidityGross: ZERO })
        : TickList.nextInitializedTick(ticks, tickLower, true);
    let currentTick = TickList.nextInitializedTick(ticks, tickLower, false);
    let currentL = lowerOutOfBound ? ZERO : FeeCalculator.getLiquidityFromTick(ticks, currentTick.index);
    let weightedL = ZERO;
    const getWeightedLFromLastTickTo = (toTick) => currentL * BigInt(toTick - Math.max(lastTick.index, tickLower));
    while (currentTick.index < tickUpper) {
        weightedL += getWeightedLFromLastTickTo(currentTick.index);
        currentL += currentTick.liquidityNet;
        lastTick = currentTick;
        // Tick upper is out of initialized tick range
        if (currentTick.index === ticks[ticks.length - 1].index)
            break;
        currentTick = TickList.nextInitializedTick(ticks, currentTick.index, false);
    }
    weightedL += getWeightedLFromLastTickTo(tickUpper);
    return weightedL / BigInt(tickUpper - tickLower);
}
export function getLiquidityFromSqrtRatioX96(ticks, sqrtRatioX96) {
    const tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
    return FeeCalculator.getLiquidityFromTick(ticks, tick);
}
export function getLiquidityFromTick(ticks, tick) {
    // calculate a cumulative of liquidityNet from all ticks that poolTicks[i] <= tick
    let liquidity = ZERO;
    if (!ticks?.length)
        return liquidity;
    if (tick < ticks[0].index || tick > ticks[ticks.length - 1].index)
        return liquidity;
    for (let i = 0; i < ticks.length - 1; ++i) {
        liquidity += ticks[i].liquidityNet;
        const lowerTick = ticks[i].index;
        const upperTick = ticks[i + 1]?.index;
        if (lowerTick <= tick && tick <= upperTick)
            break;
    }
    return liquidity;
}
