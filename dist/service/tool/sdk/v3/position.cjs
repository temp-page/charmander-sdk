"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Position = void 0;
var _constants = require("../constants.cjs");
var _fractions = require("../fractions/index.cjs");
var _Common = require("../../math/Common.cjs");
var _pool = require("./pool.cjs");
var _utils = require("./utils/index.cjs");
class Position {
  pool;
  tickLower;
  tickUpper;
  liquidity;
  // cached resuts for the getters
  _token0Amount = null;
  _token1Amount = null;
  _mintAmounts = null;
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  constructor({
    pool,
    liquidity,
    tickLower,
    tickUpper
  }) {
    (0, _Common.invariant)(tickLower < tickUpper, "TICK_ORDER");
    (0, _Common.invariant)(tickLower >= _utils.TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0, "TICK_LOWER");
    (0, _Common.invariant)(tickUpper <= _utils.TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0, "TICK_UPPER");
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */
  get token0PriceLower() {
    return (0, _utils.tickToPrice)(this.pool.token0, this.pool.token1, this.tickLower);
  }
  /**
   * Returns the price of token0 at the upper tick
   */
  get token0PriceUpper() {
    return (0, _utils.tickToPrice)(this.pool.token0, this.pool.token1, this.tickUpper);
  }
  /**
   * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
   */
  get amount0() {
    if (this._token0Amount === null) {
      this._token0Amount = _fractions.CurrencyAmount.fromRawAmount(this.pool.token0, _utils.PositionMath.getToken0Amount(this.pool.tickCurrent, this.tickLower, this.tickUpper, this.pool.sqrtRatioX96, this.liquidity));
    }
    return this._token0Amount;
  }
  /**
   * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
   */
  get amount1() {
    if (this._token1Amount === null) {
      this._token1Amount = _fractions.CurrencyAmount.fromRawAmount(this.pool.token1, _utils.PositionMath.getToken1Amount(this.pool.tickCurrent, this.tickLower, this.tickUpper, this.pool.sqrtRatioX96, this.liquidity));
    }
    return this._token1Amount;
  }
  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  ratiosAfterSlippage(slippageTolerance) {
    const priceLower = this.pool.token0Price.asFraction.multiply(new _fractions.Percent(1).subtract(slippageTolerance));
    const priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    let sqrtRatioX96Lower = (0, _utils.encodeSqrtRatioX96)(priceLower.numerator, priceLower.denominator);
    if (sqrtRatioX96Lower <= _utils.TickMath.MIN_SQRT_RATIO) sqrtRatioX96Lower = _utils.TickMath.MIN_SQRT_RATIO + 1n;
    let sqrtRatioX96Upper = (0, _utils.encodeSqrtRatioX96)(priceUpper.numerator, priceUpper.denominator);
    if (sqrtRatioX96Upper >= _utils.TickMath.MAX_SQRT_RATIO) sqrtRatioX96Upper = _utils.TickMath.MAX_SQRT_RATIO - 1n;
    return {
      sqrtRatioX96Lower,
      sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  mintAmountsWithSlippage(slippageTolerance) {
    const {
      sqrtRatioX96Upper,
      sqrtRatioX96Lower
    } = this.ratiosAfterSlippage(slippageTolerance);
    const poolLower = new _pool.Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0, _utils.TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    const poolUpper = new _pool.Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0, _utils.TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper));
    const positionThatWillBeCreated = Position.fromAmounts({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper,
      ...this.mintAmounts,
      // the mint amounts are what will be passed as calldata
      useFullPrecision: false
    });
    const {
      amount0
    } = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts;
    const {
      amount1
    } = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts;
    return {
      amount0,
      amount1
    };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  burnAmountsWithSlippage(slippageTolerance) {
    const {
      sqrtRatioX96Upper,
      sqrtRatioX96Lower
    } = this.ratiosAfterSlippage(slippageTolerance);
    const poolLower = new _pool.Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0, _utils.TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    const poolUpper = new _pool.Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0, _utils.TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper));
    const {
      amount0
    } = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    });
    const {
      amount1
    } = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    });
    return {
      amount0: amount0.quotient,
      amount1: amount1.quotient
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */
  get mintAmounts() {
    if (this._mintAmounts === null) {
      if (this.pool.tickCurrent < this.tickLower) {
        return {
          amount0: _utils.SqrtPriceMath.getAmount0Delta(_utils.TickMath.getSqrtRatioAtTick(this.tickLower), _utils.TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
          amount1: _constants.ZERO
        };
      }
      if (this.pool.tickCurrent < this.tickUpper) {
        return {
          amount0: _utils.SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, _utils.TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
          amount1: _utils.SqrtPriceMath.getAmount1Delta(_utils.TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, true)
        };
      }
      return {
        amount0: _constants.ZERO,
        amount1: _utils.SqrtPriceMath.getAmount1Delta(_utils.TickMath.getSqrtRatioAtTick(this.tickLower), _utils.TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true)
      };
    }
    return this._mintAmounts;
  }
  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  static fromAmounts({
    pool,
    tickLower,
    tickUpper,
    amount0,
    amount1,
    useFullPrecision
  }) {
    const sqrtRatioAX96 = _utils.TickMath.getSqrtRatioAtTick(tickLower);
    const sqrtRatioBX96 = _utils.TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool,
      tickLower,
      tickUpper,
      liquidity: (0, _utils.maxLiquidityForAmounts)(pool.sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision)
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */
  static fromAmount0({
    pool,
    tickLower,
    tickUpper,
    amount0,
    useFullPrecision
  }) {
    return Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0,
      amount1: _constants.MaxUint256,
      useFullPrecision
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */
  static fromAmount1({
    pool,
    tickLower,
    tickUpper,
    amount1
  }) {
    return Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0: _constants.MaxUint256,
      amount1,
      useFullPrecision: true
    });
  }
}
exports.Position = Position;