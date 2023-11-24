"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAmountDistribution = getAmountDistribution;
var _sdk = require("../../sdk/index.cjs");
function getAmountDistribution(amount, distributionPercent) {
  const percents = [];
  const amounts = [];
  for (let i = 1; i <= 100 / distributionPercent; i++) {
    percents.push(i * distributionPercent);
    amounts.push(amount.multiply(new _sdk.Fraction(i * distributionPercent, 100)));
  }
  return [percents, amounts];
}