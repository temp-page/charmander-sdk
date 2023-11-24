"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHex = toHex;
function toHex(bigintIsh) {
  const bigInt = BigInt(bigintIsh);
  let hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) hex = `0${hex}`;
  return `0x${hex}`;
}