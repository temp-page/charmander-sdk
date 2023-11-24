"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeUtils = void 0;
class TimeUtils {
  static getDeltaTimestamps() {
    const currentTime = /* @__PURE__ */new Date().getTime();
    const t24h = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3) / 1e3).toString());
    const t48h = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3 * 2) / 1e3).toString());
    const t7d = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3 * 7) / 1e3).toString());
    const t14d = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3 * 14) / 1e3).toString());
    return {
      t24h,
      t48h,
      t7d,
      t14d
    };
  }
}
exports.TimeUtils = TimeUtils;