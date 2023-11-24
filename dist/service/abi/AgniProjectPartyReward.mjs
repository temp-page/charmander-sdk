import { AgniProjectPartyRewardAbi } from "../../abi/index.mjs";
import { CacheKey } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("AgniProjectPartyReward")
export class AgniProjectPartyReward extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.AgniProjectPartyReward, AgniProjectPartyRewardAbi);
  }
  async claim() {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "claim", [], {});
  }
}
