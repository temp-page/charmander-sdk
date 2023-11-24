export function CacheKey(key) {
  return function(target) {
    target.CACHE_KEY = key;
  };
}
export function EnableProxy() {
  return function(target, propertyKey, descriptor) {
    target[propertyKey].proxyEnable = true;
  };
}
export function EnableLogs() {
  return function(target, propertyKey, descriptor) {
    target[propertyKey].logEnable = true;
  };
}
export function MethodCache(key, ttl) {
  return function(target, propertyKey, descriptor) {
    target[propertyKey].methodCache = true;
    target[propertyKey].methodCacheKey = key;
    target[propertyKey].methodCacheTTL = ttl;
  };
}
