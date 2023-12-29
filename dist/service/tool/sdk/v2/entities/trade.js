"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trade = exports.tradeComparator = exports.inputOutputComparator = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const route_1 = require("./route");
const fractions_1 = require("../../fractions");
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
function inputOutputComparator(a, b) {
    // must have same input and output token for comparison
    (0, tiny_invariant_1.default)(a.inputAmount.currency.equals(b.inputAmount.currency), 'INPUT_CURRENCY');
    (0, tiny_invariant_1.default)(a.outputAmount.currency.equals(b.outputAmount.currency), 'OUTPUT_CURRENCY');
    if (a.outputAmount.equalTo(b.outputAmount)) {
        if (a.inputAmount.equalTo(b.inputAmount)) {
            return 0;
        }
        // trade A requires less input than trade B, so A should come first
        if (a.inputAmount.lessThan(b.inputAmount)) {
            return -1;
        }
        return 1;
    }
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
        return 1;
    }
    return -1;
}
exports.inputOutputComparator = inputOutputComparator;
// extension of the input output comparator that also considers other dimensions of the trade in ranking them
function tradeComparator(a, b) {
    const ioComp = inputOutputComparator(a, b);
    if (ioComp !== 0) {
        return ioComp;
    }
    // consider lowest slippage next, since these are less likely to fail
    if (a.priceImpact.lessThan(b.priceImpact)) {
        return -1;
    }
    if (a.priceImpact.greaterThan(b.priceImpact)) {
        return 1;
    }
    // finally consider the number of hops since each hop costs gas
    return a.route.path.length - b.route.path.length;
}
exports.tradeComparator = tradeComparator;
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
class Trade {
    /**
     * Constructs an exact in trade with the given amount in and route
     * @param route route of the exact in trade
     * @param amountIn the amount being passed in
     */
    static exactIn(route, amountIn) {
        return new Trade(route, amountIn, constants_1.TradeType.EXACT_INPUT);
    }
    /**
     * Constructs an exact out trade with the given amount out and route
     * @param route route of the exact out trade
     * @param amountOut the amount returned by the trade
     */
    static exactOut(route, amountOut) {
        return new Trade(route, amountOut, constants_1.TradeType.EXACT_OUTPUT);
    }
    constructor(route, amount, tradeType) {
        this.route = route;
        this.tradeType = tradeType;
        const tokenAmounts = new Array(route.path.length);
        if (tradeType === constants_1.TradeType.EXACT_INPUT) {
            (0, tiny_invariant_1.default)(amount.currency.equals(route.input), 'INPUT');
            tokenAmounts[0] = amount.wrapped;
            for (let i = 0; i < route.path.length - 1; i++) {
                const pair = route.pairs[i];
                const [outputAmount] = pair.getOutputAmount(tokenAmounts[i]);
                tokenAmounts[i + 1] = outputAmount;
            }
            this.inputAmount = fractions_1.CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
            this.outputAmount = fractions_1.CurrencyAmount.fromFractionalAmount(route.output, tokenAmounts[tokenAmounts.length - 1].numerator, tokenAmounts[tokenAmounts.length - 1].denominator);
        }
        else {
            (0, tiny_invariant_1.default)(amount.currency.equals(route.output), 'OUTPUT');
            tokenAmounts[tokenAmounts.length - 1] = amount.wrapped;
            for (let i = route.path.length - 1; i > 0; i--) {
                const pair = route.pairs[i - 1];
                const [inputAmount] = pair.getInputAmount(tokenAmounts[i]);
                tokenAmounts[i - 1] = inputAmount;
            }
            this.inputAmount = fractions_1.CurrencyAmount.fromFractionalAmount(route.input, tokenAmounts[0].numerator, tokenAmounts[0].denominator);
            this.outputAmount = fractions_1.CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
        }
        this.executionPrice = new fractions_1.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
        this.priceImpact = (0, utils_1.computePriceImpact)(route.midPrice, this.inputAmount, this.outputAmount);
    }
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    minimumAmountOut(slippageTolerance) {
        (0, tiny_invariant_1.default)(!slippageTolerance.lessThan(constants_1.ZERO), 'SLIPPAGE_TOLERANCE');
        if (this.tradeType === constants_1.TradeType.EXACT_OUTPUT) {
            return this.outputAmount;
        }
        const slippageAdjustedAmountOut = new fractions_1.Fraction(constants_1.ONE)
            .add(slippageTolerance)
            .invert()
            .multiply(this.outputAmount.quotient).quotient;
        return fractions_1.CurrencyAmount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut);
    }
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    maximumAmountIn(slippageTolerance) {
        (0, tiny_invariant_1.default)(!slippageTolerance.lessThan(constants_1.ZERO), 'SLIPPAGE_TOLERANCE');
        if (this.tradeType === constants_1.TradeType.EXACT_INPUT) {
            return this.inputAmount;
        }
        const slippageAdjustedAmountIn = new fractions_1.Fraction(constants_1.ONE)
            .add(slippageTolerance)
            .multiply(this.inputAmount.quotient).quotient;
        return fractions_1.CurrencyAmount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn);
    }
    /**
     * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
     * amount to an output token, making at most `maxHops` hops.
     * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param nextAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactIn(pairs, currencyAmountIn, currencyOut, { maxNumResults = 3, maxHops = 3 } = {}, 
    // used in recursion.
    currentPairs = [], nextAmountIn = currencyAmountIn, bestTrades = []) {
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(currencyAmountIn === nextAmountIn || currentPairs.length > 0, 'INVALID_RECURSION');
        const amountIn = nextAmountIn.wrapped;
        const tokenOut = currencyOut.wrapped;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            // pair irrelevant
            // eslint-disable-next-line no-continue
            if (!pair.token0.equals(amountIn.currency) && !pair.token1.equals(amountIn.currency))
                continue;
            // eslint-disable-next-line no-continue
            if (pair.reserve0.equalTo(constants_1.ZERO) || pair.reserve1.equalTo(constants_1.ZERO))
                continue;
            let amountOut;
            try {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                [amountOut] = pair.getOutputAmount(amountIn);
            }
            catch (error) {
                // input too low
                if (error.isInsufficientInputAmountError) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                throw error;
            }
            // we have arrived at the output token, so this is the final trade of one of the paths
            if (amountOut.currency.equals(tokenOut)) {
                (0, utils_1.sortedInsert)(bestTrades, new Trade(new route_1.Route([...currentPairs, pair], currencyAmountIn.currency, currencyOut), currencyAmountIn, constants_1.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
                Trade.bestTradeExactIn(pairsExcludingThisPair, currencyAmountIn, currencyOut, {
                    maxNumResults,
                    maxHops: maxHops - 1,
                }, [...currentPairs, pair], amountOut, bestTrades);
            }
        }
        return bestTrades;
    }
    /**
     * Return the execution price after accounting for slippage tolerance
     * @param slippageTolerance the allowed tolerated slippage
     */
    worstExecutionPrice(slippageTolerance) {
        return new fractions_1.Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
    }
    /**
     * similar to the above method but instead targets a fixed output amount
     * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
     * to an output token amount, making at most `maxHops` hops
     * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyIn the currency to spend
     * @param nextAmountOut the exact amount of currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param currencyAmountOut used in recursion; the original value of the currencyAmountOut parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactOut(pairs, currencyIn, currencyAmountOut, { maxNumResults = 3, maxHops = 3 } = {}, 
    // used in recursion.
    currentPairs = [], nextAmountOut = currencyAmountOut, bestTrades = []) {
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(currencyAmountOut === nextAmountOut || currentPairs.length > 0, 'INVALID_RECURSION');
        const amountOut = nextAmountOut.wrapped;
        const tokenIn = currencyIn.wrapped;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            // pair irrelevant
            // eslint-disable-next-line no-continue
            if (!pair.token0.equals(amountOut.currency) && !pair.token1.equals(amountOut.currency))
                continue;
            // eslint-disable-next-line no-continue
            if (pair.reserve0.equalTo(constants_1.ZERO) || pair.reserve1.equalTo(constants_1.ZERO))
                continue;
            let amountIn;
            try {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                [amountIn] = pair.getInputAmount(amountOut);
            }
            catch (error) {
                // not enough liquidity in this pair
                if (error.isInsufficientReservesError) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                throw error;
            }
            // we have arrived at the input token, so this is the first trade of one of the paths
            if (amountIn.currency.equals(tokenIn)) {
                (0, utils_1.sortedInsert)(bestTrades, new Trade(new route_1.Route([pair, ...currentPairs], currencyIn, currencyAmountOut.currency), currencyAmountOut, constants_1.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
                Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, currencyAmountOut, {
                    maxNumResults,
                    maxHops: maxHops - 1,
                }, [pair, ...currentPairs], amountIn, bestTrades);
            }
        }
        return bestTrades;
    }
}
exports.Trade = Trade;
