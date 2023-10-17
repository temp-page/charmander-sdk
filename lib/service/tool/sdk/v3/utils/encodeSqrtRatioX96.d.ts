/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */
import { BigintIsh } from "../../constants";
export declare function encodeSqrtRatioX96(amount1: BigintIsh, amount0: BigintIsh): bigint;
