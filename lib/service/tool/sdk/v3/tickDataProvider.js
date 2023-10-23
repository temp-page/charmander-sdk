"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTickDataProvider = void 0;
/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
class NoTickDataProvider {
    async getTick(_tick) {
        throw new Error(NoTickDataProvider.ERROR_MESSAGE);
    }
    async nextInitializedTickWithinOneWord(_tick, _lte, _tickSpacing) {
        throw new Error(NoTickDataProvider.ERROR_MESSAGE);
    }
}
exports.NoTickDataProvider = NoTickDataProvider;
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';
