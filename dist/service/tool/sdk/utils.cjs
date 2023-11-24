"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computePriceImpact = computePriceImpact;
exports.getTokenComparator = getTokenComparator;
exports.sortedInsert = sortedInsert;
exports.sqrt = sqrt;
exports.validateVMTypeInstance = validateVMTypeInstance;
var _Common = require("../math/Common.cjs");
var _constants = require("./constants.cjs");
var _fractions = require("./fractions/index.cjs");
function validateVMTypeInstance(value, vmType) {
  (0, _Common.invariant)(value >= _constants.ZERO, `${value} is not a ${vmType}.`);
  (0, _Common.invariant)(value <= _constants.VM_TYPE_MAXIMA[vmType], `${value} is not a ${vmType}.`);
}
function sqrt(y) {
  (0, _Common.invariant)(y >= _constants.ZERO, "NEGATIVE");
  let z = _constants.ZERO;
  let x;
  if (y > _constants.THREE) {
    z = y;
    x = y / _constants.TWO + _constants.ONE;
    while (x < z) {
      z = x;
      x = (y / x + x) / _constants.TWO;
    }
  } else if (y !== _constants.ZERO) {
    z = _constants.ONE;
  }
  return z;
}
function sortedInsert(items, add, maxSize, comparator) {
  (0, _Common.invariant)(maxSize > 0, "MAX_SIZE_ZERO");
  (0, _Common.invariant)(items.length <= maxSize, "ITEMS_SIZE");
  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    const isFull = items.length === maxSize;
    if (isFull && comparator(items[items.length - 1], add) <= 0) return add;
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (comparator(items[mid], add) <= 0) lo = mid + 1;else hi = mid;
    }
    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}
function computePriceImpact(midPrice, inputAmount, outputAmount) {
  const quotedOutputAmount = midPrice.quote(inputAmount);
  const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
  return new _fractions.Percent(priceImpact.numerator, priceImpact.denominator);
}
function balanceComparator(balanceA, balanceB) {
  if (balanceA && balanceB) return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1;
  if (balanceA && balanceA.greaterThan("0")) return -1;
  if (balanceB && balanceB.greaterThan("0")) return 1;
  return 0;
}
function getTokenComparator(balances) {
  return function sortTokens(tokenA, tokenB) {
    const balanceA = balances[tokenA.erc20Address()];
    const balanceB = balances[tokenB.erc20Address()];
    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0) return balanceComp;
    if (tokenA.symbol && tokenB.symbol) {
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    }
    return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
  };
}