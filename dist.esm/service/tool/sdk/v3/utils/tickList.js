import { ZERO } from '../internalConstants';
import { invariant } from '../../../math/Common';
import { isSorted } from './isSorted';
function tickComparator(a, b) {
    return a.index - b.index;
}
/**
 * Utility methods for interacting with sorted lists of ticks
 */
export class TickList {
    /**
     * Cannot be constructed
     */
    constructor() { }
    static validateList(ticks, tickSpacing) {
        invariant(tickSpacing > 0, 'TICK_SPACING_NONZERO');
        // ensure ticks are spaced appropriately
        invariant(ticks.every(({ index }) => index % tickSpacing === 0), 'TICK_SPACING');
        // ensure tick liquidity deltas sum to 0
        invariant(ticks.reduce((accumulator, { liquidityNet }) => accumulator + liquidityNet, ZERO) === ZERO, 'ZERO_NET');
        invariant(isSorted(ticks, tickComparator), 'SORTED');
    }
    static isBelowSmallest(ticks, tick) {
        invariant(ticks.length > 0, 'LENGTH');
        return tick < ticks[0].index;
    }
    static isAtOrAboveLargest(ticks, tick) {
        invariant(ticks.length > 0, 'LENGTH');
        return tick >= ticks[ticks.length - 1].index;
    }
    static getTick(ticks, index) {
        const tick = ticks[this.binarySearch(ticks, index)];
        invariant(tick.index === index, 'NOT_CONTAINED');
        return tick;
    }
    /**
     * Finds the largest tick in the list of ticks that is less than or equal to tick
     * @param ticks list of ticks
     * @param tick tick to find the largest tick that is less than or equal to tick
     * @private
     */
    static binarySearch(ticks, tick) {
        invariant(!this.isBelowSmallest(ticks, tick), 'BELOW_SMALLEST');
        let l = 0;
        let r = ticks.length - 1;
        let i;
        while (true) {
            i = Math.floor((l + r) / 2);
            if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick))
                return i;
            if (ticks[i].index < tick)
                l = i + 1;
            else
                r = i - 1;
        }
    }
    static nextInitializedTick(ticks, tick, lte) {
        if (lte) {
            invariant(!TickList.isBelowSmallest(ticks, tick), 'BELOW_SMALLEST');
            if (TickList.isAtOrAboveLargest(ticks, tick))
                return ticks[ticks.length - 1];
            const index = this.binarySearch(ticks, tick);
            return ticks[index];
        }
        invariant(!this.isAtOrAboveLargest(ticks, tick), 'AT_OR_ABOVE_LARGEST');
        if (this.isBelowSmallest(ticks, tick))
            return ticks[0];
        const index = this.binarySearch(ticks, tick);
        return ticks[index + 1];
    }
    static nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
        const compressed = Math.floor(tick / tickSpacing); // matches rounding in the code
        if (lte) {
            const wordPos = compressed >> 8;
            const minimum = (wordPos << 8) * tickSpacing;
            if (TickList.isBelowSmallest(ticks, tick))
                return [minimum, false];
            const { index } = TickList.nextInitializedTick(ticks, tick, lte);
            const nextInitializedTick = Math.max(minimum, index);
            return [nextInitializedTick, nextInitializedTick === index];
        }
        const wordPos = (compressed + 1) >> 8;
        const maximum = (((wordPos + 1) << 8) - 1) * tickSpacing;
        if (this.isAtOrAboveLargest(ticks, tick))
            return [maximum, false];
        const { index } = this.nextInitializedTick(ticks, tick, lte);
        const nextInitializedTick = Math.min(maximum, index);
        return [nextInitializedTick, nextInitializedTick === index];
    }
    static countInitializedTicksCrossed(ticks, tickBefore, tickAfter) {
        if (tickBefore === tickAfter)
            return 0;
        const beforeIndex = this.binarySearch(ticks, tickBefore);
        const afterIndex = this.binarySearch(ticks, tickAfter);
        return Math.abs(beforeIndex - afterIndex);
    }
}
