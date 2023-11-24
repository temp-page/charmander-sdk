import get from "lodash/get";
import { BasicException } from "../BasicException.mjs";
import { getCurrentAddressInfo } from "../Constant.mjs";
import { CacheKey, EnableProxy, SLEEP_MS, Trace, calculateGasMargin, retry, sleep } from "./tool/index.mjs";
import { BaseService } from "./BaseService.mjs";
import { TransactionEvent } from "./vo/index.mjs";
@CacheKey("TransactionService")
export class TransactionService extends BaseService {
  constructor(connectInfo) {
    super(connectInfo);
  }
  defaultErrorMsg = "Please try again. Confirm the transaction and make sure you are paying enough gas!";
  @EnableProxy()
  async checkTransactionError(txId) {
    let count = 1e3;
    while (count >= 0) {
      const res = await retry(async () => {
        return await this.provider.getTransactionReceipt(txId);
      });
      Trace.print("checkTransactionError", res);
      if (res && res.status !== null && res.hash.toLowerCase() === txId.toLowerCase()) {
        if (res.status) {
          return res;
        } else {
          const errorRes = await this.transactionErrorHandler(txId);
          throw new BasicException(errorRes.message, errorRes.error);
        }
      }
      await sleep(SLEEP_MS);
      count--;
    }
    throw new BasicException("Transaction timeout");
  }
  @EnableProxy()
  async sendContractTransaction(contract, method, args = [], config = {}) {
    const currentChain = getCurrentAddressInfo().chainId;
    const chainId = Number.parseInt((await this.connectInfo.provider.getNetwork()).chainId.toString());
    if (chainId !== currentChain)
      throw new BasicException(`Check your wallet network chain id = ${currentChain}!`);
    return await this.sendRpcTransaction(contract, method, args, config);
  }
  async sendRpcTransaction(contract, method, args, config) {
    try {
      const estimatedGasLimit = await contract[method].estimateGas(...args, config);
      config.gasLimit = calculateGasMargin(estimatedGasLimit.toString());
      const awaitTransactionResponse = contract[method];
      const response = await awaitTransactionResponse(...args, config);
      return new TransactionEvent(this.connectInfo, response.hash);
    } catch (e) {
      throw new BasicException(this.convertErrorMsg(e), e);
    }
  }
  convertErrorMsg(e) {
    Trace.error("ERROR", e);
    let recursiveErr = e;
    let reason;
    if (get(recursiveErr, "data.message")) {
      reason = get(recursiveErr, "data.message");
    } else {
      while (recursiveErr) {
        reason = get(recursiveErr, "reason") || get(recursiveErr, "data.message") || get(recursiveErr, "message") || get(recursiveErr, "info.error.message") || reason;
        recursiveErr = get(recursiveErr, "error") || get(recursiveErr, "data.originalError") || get(recursiveErr, "info");
      }
    }
    reason = reason || this.defaultErrorMsg;
    const REVERT_STR = "execution reverted: ";
    const indexInfo = reason.indexOf(REVERT_STR);
    const isRevertedError = indexInfo >= 0;
    if (isRevertedError)
      reason = reason.substring(indexInfo + REVERT_STR.length);
    let msg = reason;
    if (!/[A-Za-z0-9\. _\:：%]+/.test(msg))
      msg = this.defaultErrorMsg;
    return msg;
  }
  /**
   *
   * @param txId
   * @param message
   */
  async transactionErrorHandler(txId, message = this.defaultErrorMsg) {
    let error;
    let errorCode = "";
    try {
      const txData = await this.provider.getTransaction(txId);
      try {
        const s = await this.provider.call(txData);
        Trace.debug(s);
      } catch (e) {
        errorCode = this.convertErrorMsg(e);
        error = e;
        Trace.debug("TransactionService.transactionErrorHandler error ", txId, e);
      }
    } catch (e) {
      error = e;
      Trace.debug("TransactionService.transactionErrorHandler error ", txId, e);
    }
    if (errorCode !== "")
      message = errorCode;
    return {
      error,
      message
    };
  }
  /**
   * 等待几个区块
   * @param web3
   * @param count
   */
  async sleepBlock(count = 1) {
    const fistBlock = await retry(async () => {
      return await this.provider.getBlockNumber();
    });
    while (true) {
      const lastBlock = await retry(async () => {
        return await this.provider.getBlockNumber();
      });
      if (lastBlock - fistBlock >= count)
        return;
      await sleep(SLEEP_MS);
    }
  }
}
