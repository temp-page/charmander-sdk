"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v3PoolTvlSelector = exports.V3_TOKEN_POOL_SELECTOR_CONFIG = exports.V3_DEFAULT_POOL_SELECTOR_CONFIG = exports.DEFAULT_POOL_SELECTOR_CONFIG = void 0;
var _sdk = require("../../sdk/index.cjs");
var _Constant = require("../../../../Constant.cjs");
const DEFAULT_POOL_SELECTOR_CONFIG = exports.DEFAULT_POOL_SELECTOR_CONFIG = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3
};
const V3_DEFAULT_POOL_SELECTOR_CONFIG = exports.V3_DEFAULT_POOL_SELECTOR_CONFIG = {
  [_sdk.ChainId.MANTLE]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4
  },
  [_sdk.ChainId.MANTLE_TESTNET]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4
  }
};
const V3_TOKEN_POOL_SELECTOR_CONFIG = exports.V3_TOKEN_POOL_SELECTOR_CONFIG = {
  [_sdk.ChainId.MANTLE]: {},
  [_sdk.ChainId.MANTLE_TESTNET]: {}
};
const sortByTvl = (a, b) => a.tvlUSD >= b.tvlUSD ? -1 : 1;
function poolSelectorFactory({
  getPoolSelectorConfig,
  getToken0,
  getToken1,
  getPoolAddress
}) {
  return function tvlSelector(currencyA, currencyB, unorderedPoolsWithTvl) {
    const POOL_SELECTION_CONFIG = getPoolSelectorConfig(currencyA, currencyB);
    if (!currencyA || !currencyB || !unorderedPoolsWithTvl.length) return [];
    const poolsFromSubgraph = unorderedPoolsWithTvl.sort(sortByTvl);
    const {
      chainId
    } = getToken0(poolsFromSubgraph[0]);
    const baseTokens = (0, _Constant.getCurrentAddressInfo)().getApi().tokenMangerApi().tradeTokens();
    const poolSet = /* @__PURE__ */new Set();
    const addToPoolSet = pools2 => {
      for (const pool of pools2) poolSet.add(getPoolAddress(pool));
    };
    const topByBaseWithTokenIn = baseTokens.map(token => {
      return poolsFromSubgraph.filter(subgraphPool => {
        return getToken0(subgraphPool).wrapped.equals(token) && getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(token) && getToken0(subgraphPool).wrapped.equals(currencyA.wrapped);
      }).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken);
    addToPoolSet(topByBaseWithTokenIn);
    const topByBaseWithTokenOut = baseTokens.map(token => {
      return poolsFromSubgraph.filter(subgraphPool => {
        if (poolSet.has(getPoolAddress(subgraphPool))) return false;
        return getToken0(subgraphPool).wrapped.equals(token) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(token) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
      }).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken);
    addToPoolSet(topByBaseWithTokenOut);
    const top2DirectPools = poolsFromSubgraph.filter(subgraphPool => {
      if (poolSet.has(getPoolAddress(subgraphPool))) return false;
      return getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNDirectSwaps);
    addToPoolSet(top2DirectPools);
    const nativeToken = (0, _Constant.getCurrentAddressInfo)().getApi().tokenMangerApi().WNATIVE();
    const top2EthBaseTokenPool = nativeToken ? poolsFromSubgraph.filter(subgraphPool => {
      if (poolSet.has(getPoolAddress(subgraphPool))) return false;
      return getToken0(subgraphPool).wrapped.equals(nativeToken) && getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(nativeToken) && getToken0(subgraphPool).wrapped.equals(currencyA.wrapped);
    }).slice(0, 1) : [];
    addToPoolSet(top2EthBaseTokenPool);
    const top2EthQuoteTokenPool = nativeToken ? poolsFromSubgraph.filter(subgraphPool => {
      if (poolSet.has(getPoolAddress(subgraphPool))) return false;
      return getToken0(subgraphPool).wrapped.equals(nativeToken) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(nativeToken) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, 1) : [];
    addToPoolSet(top2EthQuoteTokenPool);
    const topByTVL = poolsFromSubgraph.slice(0, POOL_SELECTION_CONFIG.topN).filter(pool => !poolSet.has(getPoolAddress(pool)));
    addToPoolSet(topByTVL);
    const topByTVLUsingTokenBase = poolsFromSubgraph.filter(subgraphPool => {
      if (poolSet.has(getPoolAddress(subgraphPool))) return false;
      return getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyA.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNTokenInOut);
    addToPoolSet(topByTVLUsingTokenBase);
    const topByTVLUsingTokenQuote = poolsFromSubgraph.filter(subgraphPool => {
      if (poolSet.has(getPoolAddress(subgraphPool))) return false;
      return getToken0(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNTokenInOut);
    addToPoolSet(topByTVLUsingTokenQuote);
    const getTopByTVLUsingTokenSecondHops = (base, tokenToCompare) => base.map(subgraphPool => {
      return getToken0(subgraphPool).wrapped.equals(tokenToCompare.wrapped) ? getToken1(subgraphPool) : getToken0(subgraphPool);
    }).map(secondHopToken => {
      return poolsFromSubgraph.filter(subgraphPool => {
        if (poolSet.has(getPoolAddress(subgraphPool))) return false;
        return getToken0(subgraphPool).wrapped.equals(secondHopToken.wrapped) || getToken1(subgraphPool).wrapped.equals(secondHopToken.wrapped);
      }).slice(0, POOL_SELECTION_CONFIG.topNSecondHop);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNSecondHop);
    const topByTVLUsingTokenInSecondHops = getTopByTVLUsingTokenSecondHops([...topByTVLUsingTokenBase, ...topByBaseWithTokenIn], currencyA);
    addToPoolSet(topByTVLUsingTokenInSecondHops);
    const topByTVLUsingTokenOutSecondHops = getTopByTVLUsingTokenSecondHops([...topByTVLUsingTokenQuote, ...topByBaseWithTokenOut], currencyB);
    addToPoolSet(topByTVLUsingTokenOutSecondHops);
    const pools = [...topByBaseWithTokenIn, ...topByBaseWithTokenOut, ...top2DirectPools, ...top2EthBaseTokenPool, ...top2EthQuoteTokenPool, ...topByTVL, ...topByTVLUsingTokenBase, ...topByTVLUsingTokenQuote, ...topByTVLUsingTokenInSecondHops, ...topByTVLUsingTokenOutSecondHops];
    return pools.map(({
      tvlUSD,
      ...rest
    }) => rest);
  };
}
const v3PoolTvlSelector = exports.v3PoolTvlSelector = poolSelectorFactory({
  getPoolSelectorConfig: (currencyA, currencyB) => DEFAULT_POOL_SELECTOR_CONFIG,
  getToken0: p => p.token0,
  getToken1: p => p.token1,
  getPoolAddress: p => p.address
});