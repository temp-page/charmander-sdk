import { CacheKey, Trace } from "../tool/index.mjs";
import { MAX_GAS_LIMIT } from "../../mulcall/index.mjs";
import { GasLimitMulticall } from "../../abi/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("GasMultiCallContract")
export class GasMultiCallContract extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.gasMulticall, GasLimitMulticall);
  }
  async multicall(callRequests) {
    const splitCallsIntoChunks = (calls) => {
      const chunks = [[]];
      const gasLimit = Number.parseInt(Number(MAX_GAS_LIMIT * 0.9).toString());
      let gasLeft = gasLimit;
      for (const callRequest of calls) {
        const { target, callData, gasLimit: gasCostLimit } = callRequest;
        const singleGasLimit = gasCostLimit;
        const currentChunk = chunks[chunks.length - 1];
        if (singleGasLimit > gasLeft) {
          chunks.push([callRequest]);
          gasLeft = gasLimit - singleGasLimit;
          if (gasLeft < 0) {
            throw new Error(
              `Multicall request may fail as the gas cost of a single call exceeds the gas limit ${gasLimit}. Gas cost: ${singleGasLimit}. To: ${target}. Data: ${callData}`
            );
          }
          continue;
        }
        currentChunk.push(callRequest);
        gasLeft -= singleGasLimit;
      }
      return chunks;
    };
    const callRequestsChuck = splitCallsIntoChunks(callRequests);
    try {
      const response = [];
      for (const callChuck of callRequestsChuck) {
        const {
          returnData
        } = await this.contract.multicall.staticCall(callChuck, { gasLimit: MAX_GAS_LIMIT });
        response.push(...returnData);
      }
      return response;
    } catch (e) {
      Trace.error("multicall call error", e);
      throw e;
    }
  }
}
