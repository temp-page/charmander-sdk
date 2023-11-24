import { IERC20 } from "../../abi/index.mjs";
import { CacheKey } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("ERC20")
export class ERC20 extends BaseAbi {
  constructor(connectInfo, token) {
    super(connectInfo, token, IERC20);
  }
  async allowance(owner, sender) {
    return (await this.contract.allowance(owner, sender)).toString();
  }
  async approve(spender, value) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "approve", [spender, value], {});
  }
  async transfer(to, value) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "transfer", [to, value], {});
  }
  async transferFrom(from, to, value) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "transferFrom", [from, to, value], {});
  }
  async totalSupply() {
    return (await this.contract.totalSupply()).toString();
  }
  async balanceOf(owner) {
    return (await this.contract.balanceOf(owner)).toString();
  }
  async name() {
    return (await this.contract.name()).toString();
  }
  async symbol() {
    return (await this.contract.symbol()).toString();
  }
  async decimals() {
    return Number.parseInt((await this.contract.decimals()).toString(), 10);
  }
}
