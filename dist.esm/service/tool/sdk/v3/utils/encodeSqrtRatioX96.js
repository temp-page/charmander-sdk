import { sqrt } from '../../utils';
export function encodeSqrtRatioX96(amount1, amount0) {
    const numerator = BigInt(amount1) << 192n;
    const denominator = BigInt(amount0);
    const ratioX192 = numerator / denominator;
    return sqrt(ratioX192);
}
