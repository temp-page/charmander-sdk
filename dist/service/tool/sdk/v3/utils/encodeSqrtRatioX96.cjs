"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeSqrtRatioX96 = encodeSqrtRatioX96;
var _utils = require("../../utils.cjs");
function encodeSqrtRatioX96(amount1, amount0) {
  const numerator = BigInt(amount1) << 192n;
  const denominator = BigInt(amount0);
  const ratioX192 = numerator / denominator;
  return (0, _utils.sqrt)(ratioX192);
}