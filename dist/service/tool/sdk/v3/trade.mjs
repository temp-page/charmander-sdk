import { ONE, TradeType, ZERO } from "../constants.mjs";
import { invariant } from "../../math/Common.mjs";
import { CurrencyAmount, Fraction, Percent, Price } from "../fractions/index.mjs";
import { sortedInsert } from "../utils.mjs";
import { Route } from "./route.mjs";
import { Pool } from "./pool.mjs";
export function tradeComparator(a, b) {
  invariant(a.inputAmount.currency.equals(b.inputAmount.currency), "INPUT_CURRENCY");
  invariant(a.outputAmount.currency.equals(b.outputAmount.currency), "OUTPUT_CURRENCY");
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      const aHops = a.swaps.reduce((total, cur) => total + cur.route.tokenPath.length, 0);
      const bHops = b.swaps.reduce((total, cur) => total + cur.route.tokenPath.length, 0);
      return aHops - bHops;
    }
    if (a.inputAmount.lessThan(b.inputAmount))
      return -1;
    return 1;
  }
  if (a.outputAmount.lessThan(b.outputAmount))
    return 1;
  return -1;
}
export class Trade {
  /**
   * @deprecated Deprecated in favor of 'swaps' property. If the trade consists of multiple routes
   * this will return an error.
   *
   * When the trade consists of just a single route, this returns the route of the trade,
   * i.e. which pools the trade goes through.
   */
  get route() {
    invariant(this.swaps.length === 1, "MULTIPLE_ROUTES");
    return this.swaps[0].route;
  }
  /**
   * The swaps of the trade, i.e. which routes and how much is swapped in each that
   * make up the trade.
   */
  swaps;
  /**
   * The type of the trade, either exact in or exact out.
   */
  tradeType;
  /**
   * The cached result of the input amount computation
   * @private
   */
  _inputAmount;
  /**
   * The input amount for the trade assuming no slippage.
   */
  get inputAmount() {
    if (this._inputAmount)
      return this._inputAmount;
    const inputCurrency = this.swaps[0].inputAmount.currency;
    const totalInputFromRoutes = this.swaps.map(({ inputAmount }) => inputAmount).reduce((total, cur) => total.add(cur), CurrencyAmount.fromRawAmount(inputCurrency, 0));
    this._inputAmount = totalInputFromRoutes;
    return this._inputAmount;
  }
  /**
   * The cached result of the output amount computation
   * @private
   */
  _outputAmount;
  /**
   * The output amount for the trade assuming no slippage.
   */
  get outputAmount() {
    if (this._outputAmount)
      return this._outputAmount;
    const outputCurrency = this.swaps[0].outputAmount.currency;
    const totalOutputFromRoutes = this.swaps.map(({ outputAmount }) => outputAmount).reduce((total, cur) => total.add(cur), CurrencyAmount.fromRawAmount(outputCurrency, 0));
    this._outputAmount = totalOutputFromRoutes;
    return this._outputAmount;
  }
  /**
   * The cached result of the computed execution price
   * @private
   */
  _executionPrice;
  /**
   * The price expressed in terms of output amount/input amount.
   */
  get executionPrice() {
    return this._executionPrice ?? (this._executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient
    ));
  }
  /**
   * The cached result of the price impact computation
   * @private
   */
  _priceImpact;
  /**
   * Returns the percent difference between the route's mid price and the price impact
   */
  get priceImpact() {
    if (this._priceImpact)
      return this._priceImpact;
    let spotOutputAmount = CurrencyAmount.fromRawAmount(this.outputAmount.currency, 0);
    for (const { route, inputAmount } of this.swaps) {
      const { midPrice } = route;
      spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount));
    }
    const priceImpact = spotOutputAmount.subtract(this.outputAmount).divide(spotOutputAmount);
    this._priceImpact = new Percent(priceImpact.numerator, priceImpact.denominator);
    return this._priceImpact;
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact in trade
   * @param amountIn The amount being passed in
   * @returns The exact in trade
   */
  static async exactIn(route, amountIn) {
    return Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact out trade
   * @param amountOut The amount returned by the trade
   * @returns The exact out trade
   */
  static async exactOut(route, amountOut) {
    return Trade.fromRoute(route, amountOut, TradeType.EXACT_OUTPUT);
  }
  /**
   * Constructs a trade by simulating swaps through the given route
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param route route to swap through
   * @param amount the amount specified, either input or output, depending on tradeType
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The route
   */
  static async fromRoute(route, amount, tradeType) {
    const amounts = Array.from({ length: route.tokenPath.length });
    let inputAmount;
    let outputAmount;
    if (tradeType === TradeType.EXACT_INPUT) {
      invariant(amount.currency.equals(route.input), "INPUT");
      amounts[0] = amount.wrapped;
      for (let i = 0; i < route.tokenPath.length - 1; i++) {
        const pool = route.pools[i];
        const [outputAmount2] = await pool.getOutputAmount(amounts[i]);
        amounts[i + 1] = outputAmount2;
      }
      inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
      outputAmount = CurrencyAmount.fromFractionalAmount(
        route.output,
        amounts[amounts.length - 1].numerator,
        amounts[amounts.length - 1].denominator
      );
    } else {
      invariant(amount.currency.equals(route.output), "OUTPUT");
      amounts[amounts.length - 1] = amount.wrapped;
      for (let i = route.tokenPath.length - 1; i > 0; i--) {
        const pool = route.pools[i - 1];
        const [inputAmount2] = await pool.getInputAmount(amounts[i]);
        amounts[i - 1] = inputAmount2;
      }
      inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
      outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
    }
    return new Trade({
      routes: [{ inputAmount, outputAmount, route }],
      tradeType
    });
  }
  /**
   * Constructs a trade from routes by simulating swaps
   *
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param routes the routes to swap through and how much of the amount should be routed through each
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The trade
   */
  static async fromRoutes(routes, tradeType) {
    const populatedRoutes = [];
    for (const { route, amount } of routes) {
      const amounts = Array.from({ length: route.tokenPath.length });
      let inputAmount;
      let outputAmount;
      if (tradeType === TradeType.EXACT_INPUT) {
        invariant(amount.currency.equals(route.input), "INPUT");
        inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
        amounts[0] = CurrencyAmount.fromFractionalAmount(route.input.wrapped, amount.numerator, amount.denominator);
        for (let i = 0; i < route.tokenPath.length - 1; i++) {
          const pool = route.pools[i];
          const [outputAmount2] = await pool.getOutputAmount(amounts[i]);
          amounts[i + 1] = outputAmount2;
        }
        outputAmount = CurrencyAmount.fromFractionalAmount(
          route.output,
          amounts[amounts.length - 1].numerator,
          amounts[amounts.length - 1].denominator
        );
      } else {
        invariant(amount.currency.equals(route.output), "OUTPUT");
        outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
        amounts[amounts.length - 1] = CurrencyAmount.fromFractionalAmount(
          route.output.wrapped,
          amount.numerator,
          amount.denominator
        );
        for (let i = route.tokenPath.length - 1; i > 0; i--) {
          const pool = route.pools[i - 1];
          const [inputAmount2] = await pool.getInputAmount(amounts[i]);
          amounts[i - 1] = inputAmount2;
        }
        inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
      }
      populatedRoutes.push({ route, inputAmount, outputAmount });
    }
    return new Trade({
      routes: populatedRoutes,
      tradeType
    });
  }
  /**
   * Creates a trade without computing the result of swapping through the route. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  static createUncheckedTrade(constructorArguments) {
    return new Trade({
      ...constructorArguments,
      routes: [
        {
          inputAmount: constructorArguments.inputAmount,
          outputAmount: constructorArguments.outputAmount,
          route: constructorArguments.route
        }
      ]
    });
  }
  /**
   * Creates a trade without computing the result of swapping through the routes. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  static createUncheckedTradeWithMultipleRoutes(constructorArguments) {
    return new Trade(constructorArguments);
  }
  /**
   * Construct a trade by passing in the pre-computed property values
   * @param routes The routes through which the trade occurs
   * @param tradeType The type of trade, exact input or exact output
   */
  constructor({
    routes,
    tradeType
  }) {
    const inputCurrency = routes[0].inputAmount.currency;
    const outputCurrency = routes[0].outputAmount.currency;
    invariant(
      routes.every(({ route }) => inputCurrency.wrapped.equals(route.input.wrapped)),
      "INPUT_CURRENCY_MATCH"
    );
    invariant(
      routes.every(({ route }) => outputCurrency.wrapped.equals(route.output.wrapped)),
      "OUTPUT_CURRENCY_MATCH"
    );
    const numPools = routes.map(({ route }) => route.pools.length).reduce((total, cur) => total + cur, 0);
    const poolAddressSet = /* @__PURE__ */ new Set();
    for (const { route } of routes) {
      for (const pool of route.pools)
        poolAddressSet.add(Pool.getAddress(pool.token0, pool.token1, pool.fee));
    }
    invariant(numPools === poolAddressSet.size, "POOLS_DUPLICATED");
    this.swaps = routes;
    this.tradeType = tradeType;
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount out
   */
  minimumAmountOut(slippageTolerance, amountOut = this.outputAmount) {
    invariant(!slippageTolerance.lessThan(ZERO), "SLIPPAGE_TOLERANCE");
    if (this.tradeType === TradeType.EXACT_OUTPUT)
      return amountOut;
    const slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(amountOut.quotient).quotient;
    return CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount in
   */
  maximumAmountIn(slippageTolerance, amountIn = this.inputAmount) {
    invariant(!slippageTolerance.lessThan(ZERO), "SLIPPAGE_TOLERANCE");
    if (this.tradeType === TradeType.EXACT_INPUT)
      return amountIn;
    const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
    return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   * @returns The execution price
   */
  worstExecutionPrice(slippageTolerance) {
    return new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.maximumAmountIn(slippageTolerance).quotient,
      this.minimumAmountOut(slippageTolerance).quotient
    );
  }
  /**
   * Given a list of pools, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact in trade
   */
  static async bestTradeExactIn(pools, currencyAmountIn, currencyOut, { maxNumResults = 3, maxHops = 3 } = {}, currentPools = [], nextAmountIn = currencyAmountIn, bestTrades = []) {
    invariant(pools.length > 0, "POOLS");
    invariant(maxHops > 0, "MAX_HOPS");
    invariant(currencyAmountIn === nextAmountIn || currentPools.length > 0, "INVALID_RECURSION");
    const amountIn = nextAmountIn.wrapped;
    const tokenOut = currencyOut.wrapped;
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if (!pool.token0.equals(amountIn.currency) && !pool.token1.equals(amountIn.currency))
        continue;
      let amountOut;
      try {
        const [result] = await pool.getOutputAmount(amountIn);
        amountOut = result;
      } catch (error) {
        if (error.isInsufficientInputAmountError)
          continue;
        throw error;
      }
      if (amountOut.currency.isToken && amountOut.currency.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          await Trade.fromRoute(
            new Route([...currentPools, pool], currencyAmountIn.currency, currencyOut),
            currencyAmountIn,
            TradeType.EXACT_INPUT
          ),
          maxNumResults,
          tradeComparator
        );
      } else if (maxHops > 1 && pools.length > 1) {
        const poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length));
        await Trade.bestTradeExactIn(
          poolsExcludingThisPool,
          currencyAmountIn,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1
          },
          [...currentPools, pool],
          amountOut,
          bestTrades
        );
      }
    }
    return bestTrades;
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pools, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the desired currency amount out
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact out trade
   */
  static async bestTradeExactOut(pools, currencyIn, currencyAmountOut, { maxNumResults = 3, maxHops = 3 } = {}, currentPools = [], nextAmountOut = currencyAmountOut, bestTrades = []) {
    invariant(pools.length > 0, "POOLS");
    invariant(maxHops > 0, "MAX_HOPS");
    invariant(currencyAmountOut === nextAmountOut || currentPools.length > 0, "INVALID_RECURSION");
    const amountOut = nextAmountOut.wrapped;
    const tokenIn = currencyIn.wrapped;
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if (!pool.token0.equals(amountOut.currency) && !pool.token1.equals(amountOut.currency))
        continue;
      let amountIn;
      try {
        const [result] = await pool.getInputAmount(amountOut);
        amountIn = result;
      } catch (error) {
        if (error.isInsufficientReservesError)
          continue;
        throw error;
      }
      if (amountIn.currency.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          await Trade.fromRoute(
            new Route([pool, ...currentPools], currencyIn, currencyAmountOut.currency),
            currencyAmountOut,
            TradeType.EXACT_OUTPUT
          ),
          maxNumResults,
          tradeComparator
        );
      } else if (maxHops > 1 && pools.length > 1) {
        const poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length));
        await Trade.bestTradeExactOut(
          poolsExcludingThisPool,
          currencyIn,
          currencyAmountOut,
          {
            maxNumResults,
            maxHops: maxHops - 1
          },
          [pool, ...currentPools],
          amountIn,
          bestTrades
        );
      }
    }
    return bestTrades;
  }
}
