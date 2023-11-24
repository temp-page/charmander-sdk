import { NEGATIVE_ONE, ZERO } from "../internalConstants.mjs";
export class LiquidityMath {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  static addDelta(x, y) {
    if (y < ZERO)
      return x - y * NEGATIVE_ONE;
    return x + y;
  }
}
