import template from "lodash/template";
import { Contract } from "ethers";
import { BasicException } from "../../BasicException.mjs";
import { Trace } from "./Tool.mjs";
import { Cache } from "./Cache.mjs";
export class ErrorInfo {
  error;
  msg;
  method;
  args;
  target;
}
let availableErrorHandler = (error) => {
  Trace.error("availableErrorHandler", error);
};
export function registerTransactionErrorHandler(errorHandler) {
  availableErrorHandler = errorHandler;
}
export function errorHandlerController(e, method, args, target) {
  try {
    const errorInfo = new ErrorInfo();
    errorInfo.error = e;
    errorInfo.method = method;
    try {
      errorInfo.args = JSON.stringify(args);
    } catch (e2) {
      errorInfo.args = args;
    }
    errorInfo.target = target;
    if (e instanceof BasicException)
      errorInfo.msg = e.msg;
    else
      errorInfo.msg = e.toString();
    availableErrorHandler(errorInfo);
  } catch (e2) {
    Trace.error(e2);
  }
}
let cache = new Cache(10 * 1e3);
export function clearCache() {
  cache = new Cache(10 * 1e3);
}
export function createProxy(obj) {
  return new Proxy(obj, {
    get(target, propKey) {
      const ins = target[propKey];
      if (ins instanceof Contract)
        return ins;
      if (ins && (ins.proxyEnable || ins.logEnable || ins.methodCache)) {
        return function() {
          const args = arguments;
          const showError = (err) => {
            if (ins.proxyEnable)
              errorHandlerController(err, propKey, args, target);
            if (ins.logEnable) {
              errorHandlerController(err, propKey, args, target);
              Trace.debug(`${target.constructor.CACHE_KEY}.${propKey}`, "args=", args, "error", err);
            }
          };
          const showLog = (data) => {
            if (ins.logEnable) {
              Trace.debug(
                `${target.constructor.CACHE_KEY}.${propKey} `,
                "args=",
                args,
                "result",
                data
              );
            }
          };
          const call = (saveCache = (data) => {
            if (data) {
            }
          }) => {
            const res = ins.apply(target, args);
            if (res instanceof Promise) {
              return new Promise((resolve, reject) => {
                res.then((data) => {
                  showLog(data);
                  saveCache(data);
                  resolve(data);
                }).catch((err) => {
                  showError(err);
                  reject(err);
                });
              });
            } else {
              showLog(res);
              saveCache(res);
              return res;
            }
          };
          try {
            if (ins.methodCache) {
              const ttl = ins.methodCacheTTL;
              const compiled = template(ins.methodCacheKey);
              const key = compiled(args);
              const data = cache.get(key);
              if (data) {
                Trace.debug("hit cache", key, data);
                return Promise.resolve(data);
              } else {
                Trace.debug("miss cache", key);
              }
              return call((v) => {
                Trace.debug("save cache", key, v, ttl);
                cache.put(key, v, ttl);
              });
            } else {
              return call();
            }
          } catch (err) {
            showError(err);
            throw err;
          }
        };
      } else {
        return ins;
      }
    }
  });
}
