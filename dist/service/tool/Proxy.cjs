"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorInfo = void 0;
exports.clearCache = clearCache;
exports.createProxy = createProxy;
exports.errorHandlerController = errorHandlerController;
exports.registerTransactionErrorHandler = registerTransactionErrorHandler;
var _template = _interopRequireDefault(require("lodash/template"));
var _ethers = require("ethers");
var _BasicException = require("../../BasicException.cjs");
var _Tool = require("./Tool.cjs");
var _Cache = require("./Cache.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ErrorInfo {
  error;
  msg;
  method;
  args;
  target;
}
exports.ErrorInfo = ErrorInfo;
let availableErrorHandler = error => {
  _Tool.Trace.error("availableErrorHandler", error);
};
function registerTransactionErrorHandler(errorHandler) {
  availableErrorHandler = errorHandler;
}
function errorHandlerController(e, method, args, target) {
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
    if (e instanceof _BasicException.BasicException) errorInfo.msg = e.msg;else errorInfo.msg = e.toString();
    availableErrorHandler(errorInfo);
  } catch (e2) {
    _Tool.Trace.error(e2);
  }
}
let cache = new _Cache.Cache(10 * 1e3);
function clearCache() {
  cache = new _Cache.Cache(10 * 1e3);
}
function createProxy(obj) {
  return new Proxy(obj, {
    get(target, propKey) {
      const ins = target[propKey];
      if (ins instanceof _ethers.Contract) return ins;
      if (ins && (ins.proxyEnable || ins.logEnable || ins.methodCache)) {
        return function () {
          const args = arguments;
          const showError = err => {
            if (ins.proxyEnable) errorHandlerController(err, propKey, args, target);
            if (ins.logEnable) {
              errorHandlerController(err, propKey, args, target);
              _Tool.Trace.debug(`${target.constructor.CACHE_KEY}.${propKey}`, "args=", args, "error", err);
            }
          };
          const showLog = data => {
            if (ins.logEnable) {
              _Tool.Trace.debug(`${target.constructor.CACHE_KEY}.${propKey} `, "args=", args, "result", data);
            }
          };
          const call = (saveCache = data => {
            if (data) {}
          }) => {
            const res = ins.apply(target, args);
            if (res instanceof Promise) {
              return new Promise((resolve, reject) => {
                res.then(data => {
                  showLog(data);
                  saveCache(data);
                  resolve(data);
                }).catch(err => {
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
              const compiled = (0, _template.default)(ins.methodCacheKey);
              const key = compiled(args);
              const data = cache.get(key);
              if (data) {
                _Tool.Trace.debug("hit cache", key, data);
                return Promise.resolve(data);
              } else {
                _Tool.Trace.debug("miss cache", key);
              }
              return call(v => {
                _Tool.Trace.debug("save cache", key, v, ttl);
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