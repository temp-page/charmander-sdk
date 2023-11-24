import { IAgniPool } from "../../abi/index.mjs";
import { CacheKey } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("PoolV3")
export class PoolV3 extends BaseAbi {
  constructor(connectInfo, poolAddress) {
    super(connectInfo, poolAddress, IAgniPool);
  }
}
