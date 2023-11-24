"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeRouteToPath = encodeRouteToPath;
var _ethers = require("ethers");
function encodeRouteToPath(route, exactOutput) {
  const firstInputToken = route.input.wrapped;
  const {
    path,
    types
  } = route.pools.reduce(({
    inputToken,
    path: path2,
    types: types2
  }, pool, index) => {
    const outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0;
    if (index === 0) {
      return {
        inputToken: outputToken,
        types: ["address", "uint24", "address"],
        path: [inputToken.erc20Address(), pool.fee, outputToken.erc20Address()]
      };
    }
    return {
      inputToken: outputToken,
      types: [...types2, "uint24", "address"],
      path: [...path2, pool.fee, outputToken.erc20Address()]
    };
  }, {
    inputToken: firstInputToken,
    path: [],
    types: []
  });
  return exactOutput ? (0, _ethers.solidityPacked)(types.reverse(), path.reverse()) : (0, _ethers.solidityPacked)(types, path);
}