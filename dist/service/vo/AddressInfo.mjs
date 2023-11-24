import { JsonRpcProvider, Network } from "ethers";
import { ConnectInfo } from "../../ConnectInfo.mjs";
import { ApiProvider } from "../api/index.mjs";
import { createProxy } from "../tool/index.mjs";
export class AddressInfo {
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
    if (typeof this.api === "undefined")
      this.api = createProxy(new ApiProvider());
    return this.api;
  }
  readonlyConnectInfo() {
    if (typeof this.readonlyConnectInfoInstance === "undefined") {
      const provider = new JsonRpcProvider(this.rpc, this.chainId, { staticNetwork: new Network(this.chainName, this.chainId), batchStallTime: 100 });
      const connectInfo = new ConnectInfo();
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
      case "transaction": {
        return `${prefix}/tx/${data}`;
      }
      case "token": {
        return `${prefix}/token/${data}`;
      }
      case "block": {
        return `${prefix}/block/${data}`;
      }
      case "address":
      default: {
        return `${prefix}/address/${data}`;
      }
    }
  }
}
