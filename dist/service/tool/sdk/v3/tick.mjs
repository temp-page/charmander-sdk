import { invariant } from "../../math/Common.mjs";
import { TickMath } from "./utils/index.mjs";
export class Tick {
  index;
  liquidityGross;
  liquidityNet;
  constructor({ index, liquidityGross, liquidityNet }) {
    invariant(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK, "TICK");
    this.index = index;
    this.liquidityGross = BigInt(liquidityGross);
    this.liquidityNet = BigInt(liquidityNet);
  }
}
