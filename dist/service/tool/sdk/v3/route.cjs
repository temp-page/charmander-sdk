"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = void 0;
var _Common = require("../../math/Common.cjs");
var _fractions = require("../fractions/index.cjs");
class Route {
  pools;
  tokenPath;
  input;
  output;
  _midPrice = null;
  /**
   * Creates an instance of route.
   * @param pools An array of `Pool` objects, ordered by the route the swap will take
   * @param input The input token
   * @param output The output token
   */
  constructor(pools, input, output) {
    (0, _Common.invariant)(pools.length > 0, "POOLS");
    const {
      chainId
    } = pools[0];
    const allOnSameChain = pools.every(pool => pool.chainId === chainId);
    (0, _Common.invariant)(allOnSameChain, "CHAIN_IDS");
    const wrappedInput = input.wrapped;
    (0, _Common.invariant)(pools[0].involvesToken(wrappedInput), "INPUT");
    (0, _Common.invariant)(pools[pools.length - 1].involvesToken(output.wrapped), "OUTPUT");
    const tokenPath = [wrappedInput];
    for (const [i, pool] of pools.entries()) {
      const currentInputToken = tokenPath[i];
      (0, _Common.invariant)(currentInputToken.equals(pool.token0) || currentInputToken.equals(pool.token1), "PATH");
      const nextToken = currentInputToken.equals(pool.token0) ? pool.token1 : pool.token0;
      tokenPath.push(nextToken);
    }
    this.pools = pools;
    this.tokenPath = tokenPath;
    this.input = input;
    this.output = output ?? tokenPath[tokenPath.length - 1];
  }
  get chainId() {
    return this.pools[0].chainId;
  }
  /**
   * Returns the mid price of the route
   */
  get midPrice() {
    if (this._midPrice !== null) return this._midPrice;
    const {
      price
    } = this.pools.slice(1).reduce(({
      nextInput,
      price: price2
    }, pool) => {
      return nextInput.equals(pool.token0) ? {
        nextInput: pool.token1,
        price: price2.multiply(pool.token0Price)
      } : {
        nextInput: pool.token0,
        price: price2.multiply(pool.token1Price)
      };
    }, this.pools[0].token0.equals(this.input.wrapped) ? {
      nextInput: this.pools[0].token1,
      price: this.pools[0].token0Price
    } : {
      nextInput: this.pools[0].token0,
      price: this.pools[0].token1Price
    });
    return this._midPrice = new _fractions.Price(this.input, this.output, price.denominator, price.numerator);
  }
}
exports.Route = Route;