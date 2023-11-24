"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sqrtRatioX96ToPrice = sqrtRatioX96ToPrice;
var _internalConstants = require("../internalConstants.cjs");
var _fractions = require("../../fractions/index.cjs");
function sqrtRatioX96ToPrice(sqrtRatioX96, currencyA, currencyB) {
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96;
  return currencyA.wrapped.sortsBefore(currencyB.wrapped) ? new _fractions.Price(currencyA.wrapped, currencyB.wrapped, _internalConstants.Q192, ratioX192) : new _fractions.Price(currencyA.wrapped, currencyB.wrapped, ratioX192, _internalConstants.Q192);
}