import BigNumber from "bignumber.js";
import { RUSDYAbi } from "../../abi/index.mjs";
import { CacheKey, EnableLogs } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("RUSDY")
export class RUSDY extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.RUSDY, RUSDYAbi);
  }
  BPS_DENOMINATOR = 1e4;
  @EnableLogs()
  async wrap(amount) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "wrap", args);
  }
  @EnableLogs()
  async unwrap(amount) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "unwrap", args);
  }
  async getRUSDYByShares(_USDYAmount) {
    const amount = new BigNumber(_USDYAmount).multipliedBy(1e18).multipliedBy(this.BPS_DENOMINATOR).toFixed();
    return new BigNumber(this.contract.getRUSDYByShares(amount).toString()).div(1e18).toFixed();
  }
  async getSharesByRUSDY(_rUSDYAmount) {
    const amount = new BigNumber(_rUSDYAmount).multipliedBy(1e18).toFixed();
    return new BigNumber(this.contract.getSharesByRUSDY(amount).toString()).div(1e18).div(this.BPS_DENOMINATOR).toFixed();
  }
}
