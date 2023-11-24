import { invariant } from "../math/Common.mjs";
import { ONE, THREE, TWO, VM_TYPE_MAXIMA, ZERO } from "./constants.mjs";
import { Percent } from "./fractions/index.mjs";
export function validateVMTypeInstance(value, vmType) {
  invariant(value >= ZERO, `${value} is not a ${vmType}.`);
  invariant(value <= VM_TYPE_MAXIMA[vmType], `${value} is not a ${vmType}.`);
}
export function sqrt(y) {
  invariant(y >= ZERO, "NEGATIVE");
  let z = ZERO;
  let x;
  if (y > THREE) {
    z = y;
    x = y / TWO + ONE;
    while (x < z) {
      z = x;
      x = (y / x + x) / TWO;
    }
  } else if (y !== ZERO) {
    z = ONE;
  }
  return z;
}
export function sortedInsert(items, add, maxSize, comparator) {
  invariant(maxSize > 0, "MAX_SIZE_ZERO");
  invariant(items.length <= maxSize, "ITEMS_SIZE");
  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    const isFull = items.length === maxSize;
    if (isFull && comparator(items[items.length - 1], add) <= 0)
      return add;
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (comparator(items[mid], add) <= 0)
        lo = mid + 1;
      else
        hi = mid;
    }
    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}
export function computePriceImpact(midPrice, inputAmount, outputAmount) {
  const quotedOutputAmount = midPrice.quote(inputAmount);
  const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
  return new Percent(priceImpact.numerator, priceImpact.denominator);
}
function balanceComparator(balanceA, balanceB) {
  if (balanceA && balanceB)
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1;
  if (balanceA && balanceA.greaterThan("0"))
    return -1;
  if (balanceB && balanceB.greaterThan("0"))
    return 1;
  return 0;
}
export function getTokenComparator(balances) {
  return function sortTokens(tokenA, tokenB) {
    const balanceA = balances[tokenA.erc20Address()];
    const balanceB = balances[tokenB.erc20Address()];
    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0)
      return balanceComp;
    if (tokenA.symbol && tokenB.symbol) {
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    }
    return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
  };
}
