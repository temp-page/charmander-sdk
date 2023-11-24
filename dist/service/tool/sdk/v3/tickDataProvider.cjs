"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoTickDataProvider = void 0;
class NoTickDataProvider {
  static ERROR_MESSAGE = "No tick data provider was given";
  async getTick(_tick) {
    throw new Error(NoTickDataProvider.ERROR_MESSAGE);
  }
  async nextInitializedTickWithinOneWord(_tick, _lte, _tickSpacing) {
    throw new Error(NoTickDataProvider.ERROR_MESSAGE);
  }
}
exports.NoTickDataProvider = NoTickDataProvider;