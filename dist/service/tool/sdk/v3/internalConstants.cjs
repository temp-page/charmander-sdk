"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZERO_PERCENT = exports.ZERO = exports.Q96 = exports.Q192 = exports.Q128 = exports.ONE_HUNDRED_PERCENT = exports.ONE = exports.NEGATIVE_ONE = exports.MAX_FEE = void 0;
var _fractions = require("../fractions/index.cjs");
const NEGATIVE_ONE = exports.NEGATIVE_ONE = BigInt(-1);
const ZERO = exports.ZERO = 0n;
const ONE = exports.ONE = 1n;
const Q96 = exports.Q96 = 2n ** 96n;
const Q192 = exports.Q192 = Q96 ** 2n;
const MAX_FEE = exports.MAX_FEE = 10n ** 6n;
const ONE_HUNDRED_PERCENT = exports.ONE_HUNDRED_PERCENT = new _fractions.Percent("1");
const ZERO_PERCENT = exports.ZERO_PERCENT = new _fractions.Percent("0");
const Q128 = exports.Q128 = 2n ** 128n;