/**
 * 增加 静态属性 方便对对象进行缓存
 * @param key
 * @constructor
 */
export function CacheKey(key) {
    return function (target) {
        target.CACHE_KEY = key;
    };
}
/**
 * 对方法进行标记
 * @param key
 * @constructor
 */
export function EnableProxy() {
    return function (target, propertyKey, descriptor) {
        target[propertyKey].proxyEnable = true;
    };
}
/**
 * 对方法进行标记,打印LOG
 * @param key
 * @constructor
 */
export function EnableLogs() {
    return function (target, propertyKey, descriptor) {
        target[propertyKey].logEnable = true;
    };
}
/**
 * 方法缓存
 * @param key 缓存Key
 * @param ttl milliseconds
 * @constructor
 */
export function MethodCache(key, ttl) {
    return function (target, propertyKey, descriptor) {
        target[propertyKey].methodCache = true;
        target[propertyKey].methodCacheKey = key;
        target[propertyKey].methodCacheTTL = ttl;
    };
}
