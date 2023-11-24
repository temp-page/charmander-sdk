import { invariant } from '../../math/Common';
import { TickMath } from './utils';
export class Tick {
    constructor({ index, liquidityGross, liquidityNet }) {
        invariant(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK, 'TICK');
        this.index = index;
        this.liquidityGross = BigInt(liquidityGross);
        this.liquidityNet = BigInt(liquidityNet);
    }
}
