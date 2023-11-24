"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentAddressInfo = getCurrentAddressInfo;
exports.updateCurrentAddressInfo = updateCurrentAddressInfo;
var _BasicException = require("./BasicException.cjs");
let currentAddressInfo;
function updateCurrentAddressInfo(addressInfo) {
  currentAddressInfo = addressInfo;
}
function getCurrentAddressInfo() {
  if (currentAddressInfo === void 0) throw new _BasicException.BasicException("not initialized");
  return currentAddressInfo;
}