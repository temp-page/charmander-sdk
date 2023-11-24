import BigNumber from "bignumber.js";
import get from "lodash/get";
import { BasicException } from "../../BasicException.mjs";
export const SLEEP_MS = 1e3;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const INVALID_ADDRESS = "0x0000000000000000000000000000030000000000";
export const ONE_ADDRESS = "0x0000000000000000000000000000000000000001";
export const MAXIMUM_U256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
export function convertBigNumber(bnAmount, precision = 1e18) {
  return new BigNumber(bnAmount).dividedBy(new BigNumber(precision)).toFixed();
}
export function convertBigNumber1(bnAmount, decimals = 18) {
  return new BigNumber(bnAmount).dividedBy(new BigNumber("10").pow(decimals)).toFixed();
}
export function convertAmount(bnAmount, precision = 1e18) {
  return new BigNumber(bnAmount).multipliedBy(new BigNumber(precision)).toFixed();
}
export function convertAmount1(amount, decimals = 18) {
  return new BigNumber(amount).multipliedBy(new BigNumber("10").pow(decimals)).toFixed();
}
export async function sleep(ms) {
  return await new Promise(
    (resolve) => setTimeout(() => {
      resolve(1);
    }, ms)
  );
}
export function isNullOrBlank(value) {
  return isNullOrUndefined(value) || value === "" || value.length === 0;
}
export function isNullOrUndefined(value) {
  return value === void 0 || value === null;
}
export async function retry(func, retryCount = 3) {
  let count = retryCount;
  do {
    try {
      return await func();
    } catch (e) {
      if (count > 0) {
        count--;
      }
      if (count <= 0)
        throw new BasicException(e.toString(), e);
      console.error("retry", e);
      await sleep(SLEEP_MS);
    }
  } while (true);
}
export function calculateGasMargin(value) {
  return Number.parseInt(new BigNumber(value).multipliedBy(1.2).toFixed(0, BigNumber.ROUND_DOWN), 10);
}
export function eqAddress(addr0, addr1) {
  return addr0.toLowerCase() === addr1.toLowerCase();
}
export function showApprove(balanceInfo) {
  const amount = convertBigNumber1(balanceInfo.allowance, balanceInfo.decimals);
  return new BigNumber(amount).comparedTo("100000000") <= 0;
}
export function getValue(obj, path, defaultValue) {
  return get(obj, path, defaultValue) || defaultValue;
}
export function isNumber(input) {
  const tempValue = new BigNumber(input);
  return !(tempValue.isNaN() || !tempValue.isFinite() || tempValue.comparedTo(new BigNumber("0")) < 0);
}
export class TraceTool {
  logShow = true;
  errorShow = true;
  debugShow = true;
  setLogShow(b) {
    this.logShow = b;
  }
  setErrorShow(b) {
    this.errorShow = b;
  }
  setDebugShow(b) {
    this.debugShow = b;
  }
  log(...args) {
    console.log(...args);
  }
  print(...args) {
    if (this.logShow)
      this.log(...args);
  }
  error(...args) {
    if (this.errorShow)
      this.log(...args);
  }
  debug(...args) {
    if (this.debugShow)
      this.log(...args);
  }
}
export const Trace = new TraceTool();
