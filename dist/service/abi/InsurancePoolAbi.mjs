import { InsurancePool } from "../../abi/index.mjs";
import { CacheKey, EnableLogs } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("InsurancePoolAbi")
export class InsurancePoolAbi extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.launchpadInsurancePool, InsurancePool);
  }
  @EnableLogs()
  async claimLoss(insuranceId) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "claimLoss", args);
  }
}
