"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WalletConnect = exports.PrivateWallet = exports.ConnectManager = void 0;
var _ethers = require("ethers");
var _get = _interopRequireDefault(require("lodash/get"));
var _ConnectInfo = require("./ConnectInfo.cjs");
var _service = require("./service/index.cjs");
var _Constant = require("./Constant.cjs");
var _BasicException = require("./BasicException.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class PrivateWallet {
  provider;
  wallet;
}
exports.PrivateWallet = PrivateWallet;
class WalletConnect {
  // 钱包链接名称
  wallet;
  connectInfo;
  provider;
  constructor(walletName) {
    this.wallet = walletName;
    const connectInfo = new _ConnectInfo.ConnectInfo();
    connectInfo.status = false;
    connectInfo.msg = "Check your wallet!";
    this.connectInfo = connectInfo;
  }
  disConnect() {
    const connectInfo = this.connectInfo;
    connectInfo.status = false;
    connectInfo.msg = "Check your wallet!";
    this.update();
  }
  update() {
    const connectInfo = this.connectInfo;
    connectInfo.walletConnect = this;
    if (typeof connectInfo.account === "undefined" || connectInfo.account === "") {
      connectInfo.status = false;
      _service.transactionHistory.initUpdateTransaction(connectInfo, false);
    }
    const currentAddressInfo = (0, _Constant.getCurrentAddressInfo)();
    if (connectInfo.status) {
      connectInfo.account = connectInfo.account.toLowerCase();
      connectInfo.addressInfo = currentAddressInfo;
      _service.Trace.debug("connect success ", connectInfo.account);
    }
    if (connectInfo.status) {
      connectInfo.clear();
      _service.transactionHistory.initUpdateTransaction(connectInfo, true);
    }
  }
  // 测试用，直接私钥+rpc链接
  async privateWallet() {
    const connectInfo = this.connectInfo;
    const privateWallet = this.wallet;
    const provider = privateWallet.provider;
    const wallet = privateWallet.wallet;
    connectInfo.chainId = Number.parseInt((await provider.getNetwork()).chainId.toString());
    connectInfo.msg = "success";
    connectInfo.provider = provider;
    connectInfo.account = wallet.address;
    connectInfo.status = true;
    connectInfo.wallet = wallet;
    this.update();
  }
  async web3Provider() {
    const connectInfo = this.connectInfo;
    const web3Provider = this.wallet;
    connectInfo.chainId = Number.parseInt((await web3Provider.getNetwork()).chainId.toString());
    connectInfo.msg = "success";
    connectInfo.provider = web3Provider;
    connectInfo.account = await (await web3Provider.getSigner()).getAddress();
    connectInfo.status = true;
    connectInfo.wallet = await web3Provider.getSigner();
    this.update();
  }
  static async connectMetaMask() {
    const _ethereum = WalletConnect.getEthereum();
    if (!_ethereum) throw new _BasicException.BasicException("Check your wallet!");
    await _ethereum.enable();
    const provider = new _ethers.BrowserProvider(_ethereum, "any");
    const walletConnect = new WalletConnect(provider);
    walletConnect.provider = _ethereum;
    return walletConnect;
  }
  static getEthereum() {
    return (0, _get.default)(window, "ethereum");
  }
  /**
   * 链接钱包
   * @returns ConnectInfo
   */
  async connect() {
    try {
      if (this.wallet instanceof PrivateWallet) await this.privateWallet();else if (this.wallet instanceof _ethers.BrowserProvider) await this.web3Provider();else if (this.wallet.provider) await this.web3Provider();else throw new _BasicException.BasicException("Wallet type error");
      return this.connectInfo;
    } catch (e) {
      this.connectInfo.status = false;
      this.connectInfo.msg = e.message || e.toString();
      this.update();
      throw e;
    }
  }
}
exports.WalletConnect = WalletConnect;
class ConnectManager {
  static connectInfo;
  static walletConnect;
  static chainMap = {
    rinkeby: "0x4",
    mainnet: "0x1"
  };
  /**
   * 初始化
   * @param wallet
   */
  static async connect(wallet) {
    ConnectManager.walletConnect = wallet;
    ConnectManager.connectInfo = await wallet.connect();
    return ConnectManager.connectInfo;
  }
  /**
   * 断开连接
   */
  static async disConnect() {
    if (ConnectManager.walletConnect) {
      ConnectManager.walletConnect.disConnect();
      ConnectManager.walletConnect = void 0;
    }
    if (ConnectManager.connectInfo) ConnectManager.connectInfo = void 0;
  }
  /**
   * 获取连接
   */
  static getConnect() {
    if (ConnectManager.connectInfo) {
      if (ConnectManager.connectInfo.status) return ConnectManager.connectInfo;
    }
    throw new Error("Wallet not connected");
  }
  static addMetamaskChain(chainName) {
    const _ethereum = WalletConnect.getEthereum();
    if (!_ethereum) return;
    const data = ConnectManager.chainMap[chainName];
    if (!data) return;
    if (typeof data === "string") {
      _ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
          chainId: data
        }]
      }).catch();
      return;
    }
    _ethereum.request({
      method: "wallet_addEthereumChain",
      params: data
    }).catch();
  }
}
exports.ConnectManager = ConnectManager;