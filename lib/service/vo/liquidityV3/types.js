"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLiquidityV3Info = exports.RangeConfig = exports.TICK_SPACINGS = exports.FeeAmount = void 0;
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
var FeeAmount;
(function (FeeAmount) {
    FeeAmount[FeeAmount["LOWEST"] = 100] = "LOWEST";
    FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
    FeeAmount[FeeAmount["MEDIUM"] = 2500] = "MEDIUM";
    FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount || (exports.FeeAmount = FeeAmount = {}));
/**
 * The default factory tick spacings by fee amount.
 */
exports.TICK_SPACINGS = {
    [FeeAmount.LOWEST]: 1,
    [FeeAmount.LOW]: 10,
    [FeeAmount.MEDIUM]: 50,
    [FeeAmount.HIGH]: 200,
};
var RangeConfig;
(function (RangeConfig) {
    RangeConfig[RangeConfig["NONE"] = 0] = "NONE";
    RangeConfig[RangeConfig["R10"] = 10] = "R10";
    RangeConfig[RangeConfig["R20"] = 20] = "R20";
    RangeConfig[RangeConfig["R50"] = 50] = "R50";
    RangeConfig[RangeConfig["R100"] = 100] = "R100";
})(RangeConfig || (exports.RangeConfig = RangeConfig = {}));
class AddLiquidityV3Info {
}
exports.AddLiquidityV3Info = AddLiquidityV3Info;
AddLiquidityV3Info.FEE_TIER_CONFIG = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
AddLiquidityV3Info.RANGE_CONFIG = [RangeConfig.R10, RangeConfig.R20, RangeConfig.R50, RangeConfig.R100];
