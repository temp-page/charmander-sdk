export var ChainId = /* @__PURE__ */ ((ChainId2) => {
  ChainId2[ChainId2["MANTLE"] = 5e3] = "MANTLE";
  ChainId2[ChainId2["MANTLE_TESTNET"] = 5001] = "MANTLE_TESTNET";
  return ChainId2;
})(ChainId || {});
export var TradeType = /* @__PURE__ */ ((TradeType2) => {
  TradeType2[TradeType2["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType2[TradeType2["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
  return TradeType2;
})(TradeType || {});
export var Rounding = /* @__PURE__ */ ((Rounding2) => {
  Rounding2[Rounding2["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding2[Rounding2["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding2[Rounding2["ROUND_UP"] = 2] = "ROUND_UP";
  return Rounding2;
})(Rounding || {});
export const MINIMUM_LIQUIDITY = 1000n;
export const ZERO = 0n;
export const ONE = 1n;
export const TWO = 2n;
export const THREE = 3n;
export const FIVE = 5n;
export const TEN = 10n;
export const _100 = 100n;
export const _9975 = 9975n;
export const _10000 = 10000n;
export const MaxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
export var VMType = /* @__PURE__ */ ((VMType2) => {
  VMType2["uint8"] = "uint8";
  VMType2["uint256"] = "uint256";
  return VMType2;
})(VMType || {});
export const VM_TYPE_MAXIMA = {
  ["uint8" /* uint8 */]: BigInt("0xff"),
  ["uint256" /* uint256 */]: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
};
