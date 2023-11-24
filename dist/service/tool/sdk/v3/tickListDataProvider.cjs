"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TickListDataProvider = void 0;
var _tick = require("./tick.cjs");
var _utils = require("./utils/index.cjs");
class TickListDataProvider {
  ticks;
  constructor(ticks) {
    const ticksMapped = ticks.map(t => t instanceof _tick.Tick ? t : new _tick.Tick(t));
    this.ticks = ticksMapped;
  }
  async getTick(tick) {
    return _utils.TickList.getTick(this.ticks, tick);
  }
  async nextInitializedTickWithinOneWord(tick, lte, tickSpacing) {
    return _utils.TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing);
  }
}
exports.TickListDataProvider = TickListDataProvider;