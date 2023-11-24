import { Tick } from "./tick.mjs";
import { TickList } from "./utils/index.mjs";
export class TickListDataProvider {
  ticks;
  constructor(ticks) {
    const ticksMapped = ticks.map((t) => t instanceof Tick ? t : new Tick(t));
    this.ticks = ticksMapped;
  }
  async getTick(tick) {
    return TickList.getTick(this.ticks, tick);
  }
  async nextInitializedTickWithinOneWord(tick, lte, tickSpacing) {
    return TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing);
  }
}
