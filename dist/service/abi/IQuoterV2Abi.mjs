import { IQuoterV2 } from "../../abi/index.mjs";
import { CacheKey } from "../tool/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("IQuoterV2Abi")
export class IQuoterV2Abi extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.quoterV2, IQuoterV2);
  }
}
