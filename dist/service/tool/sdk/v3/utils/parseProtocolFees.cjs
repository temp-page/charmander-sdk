"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseProtocolFees = parseProtocolFees;
var _fractions = require("../../fractions/index.cjs");
const FEE_BASE = 10n ** 4n;
function parseProtocolFees(feeProtocol) {
  const packed = Number(feeProtocol);
  if (Number.isNaN(packed)) throw new Error(`Invalid fee protocol ${feeProtocol}`);
  const token0ProtocolFee = packed % 2 ** 16;
  const token1ProtocolFee = packed >> 16;
  return [new _fractions.Percent(token0ProtocolFee, FEE_BASE), new _fractions.Percent(token1ProtocolFee, FEE_BASE)];
}