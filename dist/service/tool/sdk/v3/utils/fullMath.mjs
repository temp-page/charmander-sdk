import { ONE, ZERO } from "../internalConstants.mjs";
export class FullMath {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  static mulDivRoundingUp(a, b, denominator) {
    const product = a * b;
    let result = product / denominator;
    if (product % denominator !== ZERO)
      result = result + ONE;
    return result;
  }
}
