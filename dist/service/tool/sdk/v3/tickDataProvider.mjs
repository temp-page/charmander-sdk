export class NoTickDataProvider {
  static ERROR_MESSAGE = "No tick data provider was given";
  async getTick(_tick) {
    throw new Error(NoTickDataProvider.ERROR_MESSAGE);
  }
  async nextInitializedTickWithinOneWord(_tick, _lte, _tickSpacing) {
    throw new Error(NoTickDataProvider.ERROR_MESSAGE);
  }
}
