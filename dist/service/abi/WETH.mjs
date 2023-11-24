import { WETHAbi } from "../../abi/index.mjs";
import { CacheKey, EnableLogs } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("WETH")
export class WETH extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.WMNT, WETHAbi);
  }
  @EnableLogs()
  async deposit(amount) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "deposit", [], { value: amount });
  }
  @EnableLogs()
  async withdraw(amount) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "withdraw", args);
  }
}
