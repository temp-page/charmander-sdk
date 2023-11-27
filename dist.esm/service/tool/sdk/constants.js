export var ChainId;
(function (ChainId) {
    ChainId[ChainId["MANTLE"] = 5000] = "MANTLE";
    ChainId[ChainId["MANTLE_TESTNET"] = 5001] = "MANTLE_TESTNET";
})(ChainId || (ChainId = {}));
export var TradeType;
(function (TradeType) {
    TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
    TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType || (TradeType = {}));
export var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));
export const MINIMUM_LIQUIDITY = 1000n;
// exports for internal consumption
export const ZERO = 0n;
export const ONE = 1n;
export const TWO = 2n;
export const THREE = 3n;
export const FIVE = 5n;
export const TEN = 10n;
export const _100 = 100n;
export const _9975 = 9975n;
export const _10000 = 10000n;
export const MaxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
export var VMType;
(function (VMType) {
    VMType["uint8"] = "uint8";
    VMType["uint256"] = "uint256";
})(VMType || (VMType = {}));
export const VM_TYPE_MAXIMA = {
    [VMType.uint8]: BigInt('0xff'),
    [VMType.uint256]: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
};
