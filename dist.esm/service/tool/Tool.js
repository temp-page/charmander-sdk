import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { BasicException } from '../../BasicException';
/**
 * 轮询休眠时长 ms
 */
export const SLEEP_MS = 1000;
/**
 * 0 地址
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const INVALID_ADDRESS = '0x0000000000000000000000000000030000000000';
export const ONE_ADDRESS = '0x0000000000000000000000000000000000000001';
/**
 * uint(-1)
 */
export const MAXIMUM_U256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
/**
 *  b / 1e18
 * @param bnAmount
 * @param precision
 */
export function convertBigNumber(bnAmount, precision = 1e18) {
    return new BigNumber(bnAmount).dividedBy(new BigNumber(precision)).toFixed();
}
/**
 *  b / (10 ** decimals)
 * @param bnAmount
 * @param decimals
 */
export function convertBigNumber1(bnAmount, decimals = 18) {
    return new BigNumber(bnAmount).dividedBy(new BigNumber('10').pow(decimals)).toFixed();
}
/**
 * b * 1e18
 * @param bnAmount
 * @param precision
 */
export function convertAmount(bnAmount, precision = 1e18) {
    return new BigNumber(bnAmount).multipliedBy(new BigNumber(precision)).toFixed();
}
/**
 * amount * (10 ** decimals)
 * @param amount
 * @param decimals
 */
export function convertAmount1(amount, decimals = 18) {
    return new BigNumber(amount).multipliedBy(new BigNumber('10').pow(decimals)).toFixed();
}
/**
 * 休眠指定时间
 * @param ms
 */
export async function sleep(ms) {
    return await new Promise(resolve => setTimeout(() => {
        resolve(1);
    }, ms));
}
/**
 * 判断未空字符串
 * @param value
 */
export function isNullOrBlank(value) {
    return isNullOrUndefined(value) || value === '' || value.length === 0;
}
/**
 * 判断Null Or Undefined
 * @param value
 */
export function isNullOrUndefined(value) {
    return value === undefined || value === null;
}
/**
 * 重试
 * @param func
 * @param retryCount
 */
export async function retry(func, retryCount = 3) {
    let count = retryCount;
    do {
        try {
            return await func();
        }
        catch (e) {
            // eslint-disable-next-line curly
            if (count > 0) {
                count--;
            }
            if (count <= 0)
                throw new BasicException(e.toString(), e);
            console.error('retry', e);
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
    return new BigNumber(amount).comparedTo('100000000') <= 0;
}
export function getValue(obj, path, defaultValue) {
    return get(obj, path, defaultValue) || defaultValue;
}
export function isNumber(input) {
    const tempValue = new BigNumber(input);
    return !(tempValue.isNaN()
        || !tempValue.isFinite()
        || tempValue.comparedTo(new BigNumber('0')) < 0);
}
/**
 * 日志工具
 */
export class TraceTool {
    constructor() {
        this.logShow = true;
        this.errorShow = true;
        this.debugShow = true;
    }
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
