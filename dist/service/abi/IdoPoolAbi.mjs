import { IdoPool } from "../../abi/index.mjs";
import { CacheKey } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("IdoPoolAbi")
export class IdoPoolAbi extends BaseAbi {
  constructor(connectInfo, address) {
    super(connectInfo, address, IdoPool);
  }
  async enroll() {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "enroll", args);
  }
  async presaleDeposit(buyQuota, buyInsurance) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "presaleDeposit", args);
  }
  async publicSaleDeposit(buyInsurance, buyQuota, extraDeposit) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "publicSaleDeposit", args);
  }
  async claim() {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "claim(", args);
  }
}
