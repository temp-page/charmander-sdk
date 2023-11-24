import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import { CacheKey } from "../tool/index.mjs";
import { Multicall2 } from "../../abi/index.mjs";
import { multicallExecute } from "../../mulcall/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("MultiCallContract")
export class MultiCallContract extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.multicall, Multicall2);
  }
  async singleCall(shapeWithLabel) {
    const [res] = await this.call(...[shapeWithLabel]);
    return res;
  }
  async call(...shapeWithLabels) {
    const calls = [];
    shapeWithLabels.forEach((relay) => {
      const pairs = toPairs(relay);
      pairs.forEach(([, value]) => {
        if (typeof value !== "string")
          calls.push(value);
      });
    });
    const res = await multicallExecute(this.contract, calls);
    let index = 0;
    const datas = shapeWithLabels.map((relay) => {
      const pairs = toPairs(relay);
      pairs.forEach((obj) => {
        if (typeof obj[1] !== "string") {
          obj[1] = res[index];
          index++;
        }
      });
      return fromPairs(pairs);
    });
    return datas;
  }
}
