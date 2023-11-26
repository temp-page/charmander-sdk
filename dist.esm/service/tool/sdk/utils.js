import { invariant } from '../math/Common';
import { ONE, THREE, TWO, VM_TYPE_MAXIMA, ZERO } from './constants';
import { Percent } from './fractions';
export function validateVMTypeInstance(value, vmType) {
    invariant(value >= ZERO, `${value} is not a ${vmType}.`);
    invariant(value <= VM_TYPE_MAXIMA[vmType], `${value} is not a ${vmType}.`);
}
// mock the on-chain sqrt function
export function sqrt(y) {
    invariant(y >= ZERO, 'NEGATIVE');
    let z = ZERO;
    let x;
    if (y > THREE) {
        z = y;
        x = y / TWO + ONE;
        while (x < z) {
            z = x;
            x = (y / x + x) / TWO;
        }
    }
    else if (y !== ZERO) {
        z = ONE;
    }
    return z;
}
// given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item
export function sortedInsert(items, add, maxSize, comparator) {
    invariant(maxSize > 0, 'MAX_SIZE_ZERO');
    // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize
    invariant(items.length <= maxSize, 'ITEMS_SIZE');
    // short circuit first item add
    if (items.length === 0) {
        items.push(add);
        return null;
    }
    else {
        const isFull = items.length === maxSize;
        // short circuit if full and the additional item does not come before the last item
        if (isFull && comparator(items[items.length - 1], add) <= 0)
            return add;
        let lo = 0;
        let hi = items.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (comparator(items[mid], add) <= 0)
                lo = mid + 1;
            else
                hi = mid;
        }
        items.splice(lo, 0, add);
        return isFull ? items.pop() : null;
    }
}
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
export function computePriceImpact(midPrice, inputAmount, outputAmount) {
    const quotedOutputAmount = midPrice.quote(inputAmount);
    // calculate price impact := (exactQuote - outputAmount) / exactQuote
    const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
    return new Percent(priceImpact.numerator, priceImpact.denominator);
}
// compare two token amounts with highest one coming first
function balanceComparator(balanceA, balanceB) {
    if (balanceA && balanceB)
        return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1;
    if (balanceA && balanceA.greaterThan('0'))
        return -1;
    if (balanceB && balanceB.greaterThan('0'))
        return 1;
    return 0;
}
export function getTokenComparator(balances) {
    return function sortTokens(tokenA, tokenB) {
        // -1 = a is first
        // 1 = b is first
        // sort by balances
        const balanceA = balances[tokenA.erc20Address()];
        const balanceB = balances[tokenB.erc20Address()];
        const balanceComp = balanceComparator(balanceA, balanceB);
        if (balanceComp !== 0)
            return balanceComp;
        if (tokenA.symbol && tokenB.symbol) {
            // sort by symbol
            return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
        }
        return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
    };
}
