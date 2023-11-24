"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mostSignificantBit = mostSignificantBit;
var _internalConstants = require("../internalConstants.cjs");
var _Common = require("../../../math/Common.cjs");
var _constants = require("../../constants.cjs");
const TWO = 2n;
const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map(pow => [pow, TWO ** BigInt(pow)]);
function mostSignificantBit(x) {
  (0, _Common.invariant)(x > _internalConstants.ZERO, "ZERO");
  (0, _Common.invariant)(x <= _constants.MaxUint256, "MAX");
  let msb = 0;
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      x = x >> BigInt(power);
      msb += power;
    }
  }
  return msb;
}