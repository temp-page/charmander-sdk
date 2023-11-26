import { TICK_SPACINGS } from '../../../vo';
import { CurrencyAmount, Price } from '../fractions';
import { invariant } from '../../math/Common';
import { PoolV3Api } from '../../../api';
import { LiquidityMath, SwapMath, TickMath } from './utils';
import { NoTickDataProvider } from './tickDataProvider';
import { TickListDataProvider } from './tickListDataProvider';
import { NEGATIVE_ONE, ONE, Q192, ZERO } from './internalConstants';
/**
 * By default, pools will not allow operations that require ticks.
 */
const NO_TICK_DATA_PROVIDER_DEFAULT = new NoTickDataProvider();
/**
 * Represents a V3 pool
 */
export class Pool {
    static getAddress(token0, token1, feeAmount) {
        return PoolV3Api.computePoolAddress(token0, token1, feeAmount);
    }
    /**
     * Construct a pool
     * @param tokenA One of the tokens in the pool
     * @param tokenB The other token in the pool
     * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
     * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
     * @param liquidity The current value of in range liquidity
     * @param tickCurrent The current tick of the pool
     * @param ticks The current state of the pool ticks or a data provider that can return tick data
     */
    constructor(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent, ticks = NO_TICK_DATA_PROVIDER_DEFAULT) {
        invariant(Number.isInteger(fee) && fee < 1000000, 'FEE');
        [this.token0, this.token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
        this.fee = fee;
        this.sqrtRatioX96 = BigInt(sqrtRatioX96);
        this.liquidity = BigInt(liquidity);
        this.tickCurrent = tickCurrent;
        this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks) : ticks;
    }
    /**
     * Returns true if the token is either token0 or token1
     * @param token The token to check
     * @returns True if token is either token0 or token
     */
    involvesToken(token) {
        return token.equals(this.token0) || token.equals(this.token1);
    }
    /**
     * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
     */
    get token0Price() {
        return (this._token0Price
            ?? (this._token0Price = new Price(this.token0, this.token1, Q192, this.sqrtRatioX96 * this.sqrtRatioX96)));
    }
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */
    get token1Price() {
        return (this._token1Price
            ?? (this._token1Price = new Price(this.token1, this.token0, this.sqrtRatioX96 * this.sqrtRatioX96, Q192)));
    }
    /**
     * Return the price of the given token in terms of the other token in the pool.
     * @param token The token to return price of
     * @returns The price of the given token, in terms of the other.
     */
    priceOf(token) {
        invariant(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0) ? this.token0Price : this.token1Price;
    }
    /**
     * Returns the chain ID of the tokens in the pool.
     */
    get chainId() {
        return this.token0.chainId;
    }
    /**
     * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
     * @param inputAmount The input amount for which to quote the output amount
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
     * @returns The output amount and the pool with updated state
     */
    async getOutputAmount(inputAmount, sqrtPriceLimitX96) {
        invariant(this.involvesToken(inputAmount.currency), 'TOKEN');
        const zeroForOne = inputAmount.currency.equals(this.token0);
        const { amountCalculated: outputAmount, sqrtRatioX96, liquidity, tickCurrent, } = await this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);
        const outputToken = zeroForOne ? this.token1 : this.token0;
        return [
            CurrencyAmount.fromRawAmount(outputToken, outputAmount * NEGATIVE_ONE),
            new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider),
        ];
    }
    /**
     * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
     * @param outputAmount the output amount for which to quote the input amount
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
     * @returns The input amount and the pool with updated state
     */
    async getInputAmount(outputAmount, sqrtPriceLimitX96) {
        invariant(outputAmount.currency.isToken && this.involvesToken(outputAmount.currency), 'TOKEN');
        const zeroForOne = outputAmount.currency.equals(this.token1);
        const { amountSpecifiedRemaining, amountCalculated: inputAmount, sqrtRatioX96, liquidity, tickCurrent, } = await this.swap(zeroForOne, outputAmount.quotient * NEGATIVE_ONE, sqrtPriceLimitX96);
        invariant(amountSpecifiedRemaining === ZERO, 'INSUFICIENT_LIQUIDITY');
        const inputToken = zeroForOne ? this.token0 : this.token1;
        return [
            CurrencyAmount.fromRawAmount(inputToken, inputAmount),
            new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider),
        ];
    }
    /**
     * Executes a swap
     * @param zeroForOne Whether the amount in is token0 or token1
     * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
     * @returns amountCalculated
     * @returns sqrtRatioX96
     * @returns liquidity
     * @returns tickCurrent
     */
    async swap(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
        if (!sqrtPriceLimitX96)
            sqrtPriceLimitX96 = zeroForOne ? TickMath.MIN_SQRT_RATIO + ONE : TickMath.MAX_SQRT_RATIO - ONE;
        if (zeroForOne) {
            invariant(sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO, 'RATIO_MIN');
            invariant(sqrtPriceLimitX96 < this.sqrtRatioX96, 'RATIO_CURRENT');
        }
        else {
            invariant(sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO, 'RATIO_MAX');
            invariant(sqrtPriceLimitX96 > this.sqrtRatioX96, 'RATIO_CURRENT');
        }
        const exactInput = amountSpecified >= ZERO;
        // keep track of swap state
        const state = {
            amountSpecifiedRemaining: amountSpecified,
            amountCalculated: ZERO,
            sqrtPriceX96: this.sqrtRatioX96,
            tick: this.tickCurrent,
            liquidity: this.liquidity,
        };
        // start swap while loop
        while (state.amountSpecifiedRemaining !== ZERO && state.sqrtPriceX96 !== sqrtPriceLimitX96) {
            const step = {};
            step.sqrtPriceStartX96 = state.sqrtPriceX96;
            [step.tickNext, step.initialized] = await this.tickDataProvider.nextInitializedTickWithinOneWord(state.tick, zeroForOne, this.tickSpacing);
            if (step.tickNext < TickMath.MIN_TICK)
                step.tickNext = TickMath.MIN_TICK;
            else if (step.tickNext > TickMath.MAX_TICK)
                step.tickNext = TickMath.MAX_TICK;
            step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
            [state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount] = SwapMath.computeSwapStep(state.sqrtPriceX96, (zeroForOne ? step.sqrtPriceNextX96 < sqrtPriceLimitX96 : step.sqrtPriceNextX96 > sqrtPriceLimitX96)
                ? sqrtPriceLimitX96
                : step.sqrtPriceNextX96, state.liquidity, state.amountSpecifiedRemaining, this.fee);
            if (exactInput) {
                state.amountSpecifiedRemaining = state.amountSpecifiedRemaining - (step.amountIn + step.feeAmount);
                state.amountCalculated = state.amountCalculated - step.amountOut;
            }
            else {
                state.amountSpecifiedRemaining = state.amountSpecifiedRemaining + step.amountOut;
                state.amountCalculated = state.amountCalculated + (step.amountIn + step.feeAmount);
            }
            // TODO
            if (state.sqrtPriceX96 === step.sqrtPriceNextX96) {
                // if the tick is initialized, run the tick transition
                if (step.initialized) {
                    let liquidityNet = BigInt((await this.tickDataProvider.getTick(step.tickNext)).liquidityNet);
                    // if we're moving leftward, we interpret liquidityNet as the opposite sign
                    // safe because liquidityNet cannot be type(int128).min
                    if (zeroForOne)
                        liquidityNet = liquidityNet * NEGATIVE_ONE;
                    state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
                }
                state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
            }
            else if (state.sqrtPriceX96 !== step.sqrtPriceStartX96) {
                // updated comparison function
                // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
                state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
            }
        }
        return {
            amountSpecifiedRemaining: state.amountSpecifiedRemaining,
            amountCalculated: state.amountCalculated,
            sqrtRatioX96: state.sqrtPriceX96,
            liquidity: state.liquidity,
            tickCurrent: state.tick,
        };
    }
    get tickSpacing() {
        return TICK_SPACINGS[this.fee];
    }
}
