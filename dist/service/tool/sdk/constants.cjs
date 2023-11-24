"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._9975 = exports._10000 = exports._100 = exports.ZERO = exports.VM_TYPE_MAXIMA = exports.VMType = exports.TradeType = exports.TWO = exports.THREE = exports.TEN = exports.Rounding = exports.ONE = exports.MaxUint256 = exports.MINIMUM_LIQUIDITY = exports.FIVE = exports.ChainId = void 0;
var ChainId = exports.ChainId = /* @__PURE__ */(ChainId2 => {
  ChainId2[ChainId2["MANTLE"] = 5e3] = "MANTLE";
  ChainId2[ChainId2["MANTLE_TESTNET"] = 5001] = "MANTLE_TESTNET";
  return ChainId2;
})(ChainId || {});
var TradeType = exports.TradeType = /* @__PURE__ */(TradeType2 => {
  TradeType2[TradeType2["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType2[TradeType2["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
  return TradeType2;
})(TradeType || {});
var Rounding = exports.Rounding = /* @__PURE__ */(Rounding2 => {
  Rounding2[Rounding2["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding2[Rounding2["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding2[Rounding2["ROUND_UP"] = 2] = "ROUND_UP";
  return Rounding2;
})(Rounding || {});
const MINIMUM_LIQUIDITY = exports.MINIMUM_LIQUIDITY = 1000n;
const ZERO = exports.ZERO = 0n;
const ONE = exports.ONE = 1n;
const TWO = exports.TWO = 2n;
const THREE = exports.THREE = 3n;
const FIVE = exports.FIVE = 5n;
const TEN = exports.TEN = 10n;
const _100 = exports._100 = 100n;
const _9975 = exports._9975 = 9975n;
const _10000 = exports._10000 = 10000n;
const MaxUint256 = exports.MaxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
var VMType = exports.VMType = /* @__PURE__ */(VMType2 => {
  VMType2["uint8"] = "uint8";
  VMType2["uint256"] = "uint256";
  return VMType2;
})(VMType || {});
const VM_TYPE_MAXIMA = exports.VM_TYPE_MAXIMA = {
  ["uint8" /* uint8 */]: BigInt("0xff"),
  ["uint256" /* uint256 */]: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
};