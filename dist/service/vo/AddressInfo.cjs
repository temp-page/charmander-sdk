"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddressInfo = void 0;
var _ethers = require("ethers");
var _ConnectInfo = require("../../ConnectInfo.cjs");
var _api = require("../api/index.cjs");
var _tool = require("../tool/index.cjs");
class AddressInfo {
  /**
   * chainID
   */
  chainId;
  /**
   * 链上区块浏览器地址
   */
  scan;
  rpc;
  multicall;
  gasMulticall;
  initCodeHashAddress;
  initCodeHash;
  swapRouter;
  quoterV2;
  tickLens;
  nftDescriptor;
  nonfungibleTokenPositionDescriptor;
  nonfungiblePositionManager;
  agniPoolDeployer;
  WMNT;
  USDT;
  RUSDY;
  USDY;
  AgniProjectPartyReward;
  blockGraphApi;
  exchangeGraphApi;
  projectPartyRewardGraphApi;
  launchpadStakeToken;
  launchpadStakePool;
  launchpadInsurancePool;
  launchpadGraphApi;
  baseApiUrl;
  baseTradeToken;
  readonlyConnectInfoInstance;
  api;
  chainName;
  storage;
  getApi() {
    if (typeof this.api === "undefined") this.api = (0, _tool.createProxy)(new _api.ApiProvider());
    return this.api;
  }
  readonlyConnectInfo() {
    if (typeof this.readonlyConnectInfoInstance === "undefined") {
      const provider = new _ethers.JsonRpcProvider(this.rpc, this.chainId, {
        staticNetwork: new _ethers.Network(this.chainName, this.chainId),
        batchStallTime: 100
      });
      const connectInfo = new _ConnectInfo.ConnectInfo();
      connectInfo.provider = provider;
      connectInfo.wallet = void 0;
      connectInfo.status = true;
      connectInfo.addressInfo = this;
      this.readonlyConnectInfoInstance = connectInfo;
    }
    return this.readonlyConnectInfoInstance;
  }
  getEtherscanAddress(address) {
    return this.getEtherscanLink(address, "address");
  }
  getEtherscanTx(tx) {
    return this.getEtherscanLink(tx, "transaction");
  }
  getEtherscanLink(data, type) {
    const prefix = this.scan;
    switch (type) {
      case "transaction":
        {
          return `${prefix}/tx/${data}`;
        }
      case "token":
        {
          return `${prefix}/token/${data}`;
        }
      case "block":
        {
          return `${prefix}/block/${data}`;
        }
      case "address":
      default:
        {
          return `${prefix}/address/${data}`;
        }
    }
  }
}
exports.AddressInfo = AddressInfo;