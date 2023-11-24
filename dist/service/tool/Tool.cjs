"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZERO_ADDRESS = exports.TraceTool = exports.Trace = exports.SLEEP_MS = exports.ONE_ADDRESS = exports.MAXIMUM_U256 = exports.INVALID_ADDRESS = void 0;
exports.calculateGasMargin = calculateGasMargin;
exports.convertAmount = convertAmount;
exports.convertAmount1 = convertAmount1;
exports.convertBigNumber = convertBigNumber;
exports.convertBigNumber1 = convertBigNumber1;
exports.eqAddress = eqAddress;
exports.getValue = getValue;
exports.isNullOrBlank = isNullOrBlank;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isNumber = isNumber;
exports.retry = retry;
exports.showApprove = showApprove;
exports.sleep = sleep;
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _get = _interopRequireDefault(require("lodash/get"));
var _BasicException = require("../../BasicException.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SLEEP_MS = exports.SLEEP_MS = 1e3;
const ZERO_ADDRESS = exports.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const INVALID_ADDRESS = exports.INVALID_ADDRESS = "0x0000000000000000000000000000030000000000";
const ONE_ADDRESS = exports.ONE_ADDRESS = "0x0000000000000000000000000000000000000001";
const MAXIMUM_U256 = exports.MAXIMUM_U256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
function convertBigNumber(bnAmount, precision = 1e18) {
  return new _bignumber.default(bnAmount).dividedBy(new _bignumber.default(precision)).toFixed();
}
function convertBigNumber1(bnAmount, decimals = 18) {
  return new _bignumber.default(bnAmount).dividedBy(new _bignumber.default("10").pow(decimals)).toFixed();
}
function convertAmount(bnAmount, precision = 1e18) {
  return new _bignumber.default(bnAmount).multipliedBy(new _bignumber.default(precision)).toFixed();
}
function convertAmount1(amount, decimals = 18) {
  return new _bignumber.default(amount).multipliedBy(new _bignumber.default("10").pow(decimals)).toFixed();
}
async function sleep(ms) {
  return await new Promise(resolve => setTimeout(() => {
    resolve(1);
  }, ms));
}
function isNullOrBlank(value) {
  return isNullOrUndefined(value) || value === "" || value.length === 0;
}
function isNullOrUndefined(value) {
  return value === void 0 || value === null;
}
async function retry(func, retryCount = 3) {
  let count = retryCount;
  do {
    try {
      return await func();
    } catch (e) {
      if (count > 0) {
        count--;
      }
      if (count <= 0) throw new _BasicException.BasicException(e.toString(), e);
      console.error("retry", e);
      await sleep(SLEEP_MS);
    }
  } while (true);
}
function calculateGasMargin(value) {
  return Number.parseInt(new _bignumber.default(value).multipliedBy(1.2).toFixed(0, _bignumber.default.ROUND_DOWN), 10);
}
function eqAddress(addr0, addr1) {
  return addr0.toLowerCase() === addr1.toLowerCase();
}
function showApprove(balanceInfo) {
  const amount = convertBigNumber1(balanceInfo.allowance, balanceInfo.decimals);
  return new _bignumber.default(amount).comparedTo("100000000") <= 0;
}
function getValue(obj, path, defaultValue) {
  return (0, _get.default)(obj, path, defaultValue) || defaultValue;
}
function isNumber(input) {
  const tempValue = new _bignumber.default(input);
  return !(tempValue.isNaN() || !tempValue.isFinite() || tempValue.comparedTo(new _bignumber.default("0")) < 0);
}
class TraceTool {
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
    if (this.logShow) this.log(...args);
  }
  error(...args) {
    if (this.errorShow) this.log(...args);
  }
  debug(...args) {
    if (this.debugShow) this.log(...args);
  }
}
exports.TraceTool = TraceTool;
const Trace = exports.Trace = new TraceTool();