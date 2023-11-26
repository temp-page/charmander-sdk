/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
export class NoTickDataProvider {
    async getTick(_tick) {
        throw new Error(NoTickDataProvider.ERROR_MESSAGE);
    }
    async nextInitializedTickWithinOneWord(_tick, _lte, _tickSpacing) {
        throw new Error(NoTickDataProvider.ERROR_MESSAGE);
    }
}
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';
