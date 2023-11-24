"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheKey = CacheKey;
exports.EnableLogs = EnableLogs;
exports.EnableProxy = EnableProxy;
exports.MethodCache = MethodCache;
function CacheKey(key) {
  return function (target) {
    target.CACHE_KEY = key;
  };
}
function EnableProxy() {
  return function (target, propertyKey, descriptor) {
    target[propertyKey].proxyEnable = true;
  };
}
function EnableLogs() {
  return function (target, propertyKey, descriptor) {
    target[propertyKey].logEnable = true;
  };
}
function MethodCache(key, ttl) {
  return function (target, propertyKey, descriptor) {
    target[propertyKey].methodCache = true;
    target[propertyKey].methodCacheKey = key;
    target[propertyKey].methodCacheTTL = ttl;
  };
}