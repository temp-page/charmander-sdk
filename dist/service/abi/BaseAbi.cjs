"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseAbi = void 0;
var _ethers = require("ethers");
var _mulcall = require("../../mulcall/index.cjs");
class BaseAbi {
  provider;
  connectInfo;
  addressInfo;
  mulContract;
  contract;
  constructor(connectInfo, address, abi) {
    this.provider = connectInfo.provider;
    this.connectInfo = connectInfo;
    this.addressInfo = connectInfo.addressInfo;
    this.mulContract = new _mulcall.MulContract(address, abi);
    this.contract = new _ethers.Contract(address, abi, connectInfo.getWalletOrProvider());
  }
}
exports.BaseAbi = BaseAbi;