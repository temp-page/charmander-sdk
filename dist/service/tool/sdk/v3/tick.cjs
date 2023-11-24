"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tick = void 0;
var _Common = require("../../math/Common.cjs");
var _utils = require("./utils/index.cjs");
class Tick {
  index;
  liquidityGross;
  liquidityNet;
  constructor({
    index,
    liquidityGross,
    liquidityNet
  }) {
    (0, _Common.invariant)(index >= _utils.TickMath.MIN_TICK && index <= _utils.TickMath.MAX_TICK, "TICK");
    this.index = index;
    this.liquidityGross = BigInt(liquidityGross);
    this.liquidityNet = BigInt(liquidityNet);
  }
}
exports.Tick = Tick;