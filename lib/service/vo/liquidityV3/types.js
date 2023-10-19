"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityInfo = exports.LiquidityListData = exports.AddLiquidityV3Info = exports.TICK_SPACINGS = exports.FeeAmount = void 0;
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
class AddLiquidityV3Info {
    constructor() {
        this.token0Amount = '';
        this.token1Amount = '';
        // Set Starting Price
        this.first = null;
        this.firstPrice = null;
        this.minPrice = null;
        this.maxPrice = null;
        this.pool = null;
        this.rate = null;
        // 无需关心的数据
        this.tickLower = null;
        this.tickUpper = null;
        this.tickData = null;
    }
}
exports.AddLiquidityV3Info = AddLiquidityV3Info;
class LiquidityListData {
}
exports.LiquidityListData = LiquidityListData;
class LiquidityInfo {
}
exports.LiquidityInfo = LiquidityInfo;
