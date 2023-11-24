"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardMath = void 0;
var _bignumber = _interopRequireDefault(require("bignumber.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DashboardMath {
  static get2DayChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
    const currentChange = new _bignumber.default(valueNow).minus(value24HoursAgo).toNumber();
    const previousChange = new _bignumber.default(value24HoursAgo).minus(value48HoursAgo).toNumber();
    const adjustedPercentChange = new _bignumber.default(currentChange).minus(previousChange).multipliedBy("100").div(previousChange).toNumber();
    if (new _bignumber.default(adjustedPercentChange).isNaN() || !new _bignumber.default(adjustedPercentChange).isFinite()) return [currentChange, 0];
    return [currentChange, adjustedPercentChange];
  };
  /**
   * get standard percent change between two values
   * @param {*} valueNow
   * @param {*} value24HoursAgo
   */
  static getPercentChange = (valueNow, value24HoursAgo) => {
    if (valueNow && value24HoursAgo) {
      const change = (Number.parseFloat(valueNow.toString()) - Number.parseFloat(value24HoursAgo.toString())) / Number.parseFloat(value24HoursAgo.toString()) * 100;
      if (Number.isFinite(change)) return change;
    }
    return 0;
  };
}
exports.DashboardMath = DashboardMath;