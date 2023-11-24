import { IStakingPool } from "../../abi/index.mjs";
import { CacheKey, EnableLogs } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("StakingPoolAbi")
export class StakingPoolAbi extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.launchpadStakePool, IStakingPool);
  }
  @EnableLogs()
  async stake(token, tokenIdOrAmount) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "stake", args);
  }
  @EnableLogs()
  async unstake(stakeIds) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "unstake", args);
  }
}
