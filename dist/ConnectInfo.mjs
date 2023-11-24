import {
  Erc20Service,
  MultiCallContract,
  Trace,
  TransactionService,
  clearCache,
  createProxy
} from "./service/index.mjs";
import { BasicException } from "./BasicException.mjs";
export class ConnectInfo {
  _provider;
  _wallet;
  _status;
  _msg;
  _account;
  _chainId;
  walletConnect;
  _addressInfo;
  _instanceCache = /* @__PURE__ */ new Map();
  create(clazz, ...args) {
    const cacheKey = clazz.CACHE_KEY;
    if (!cacheKey)
      return new clazz(this, ...args);
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    const element = this._instanceCache.get(key);
    if (typeof element !== "undefined") {
      return element;
    } else {
      const instance = createProxy(new clazz(this, ...args));
      this._instanceCache.set(key, instance);
      return instance;
    }
  }
  clear() {
    this._instanceCache.clear();
    clearCache();
  }
  /**
   * 获取 ERC20 API
   */
  erc20() {
    return this.create(Erc20Service);
  }
  /**
   * 获取交易API
   */
  tx() {
    return this.create(TransactionService);
  }
  /**
   * multiCall service
   */
  multiCall() {
    return this.create(MultiCallContract);
  }
  get provider() {
    if (this._status)
      return this._provider;
    throw new BasicException("Wallet not connected!");
  }
  set provider(value) {
    this._provider = value;
  }
  /**
   * 获取连接的状态
   */
  get status() {
    return this._status;
  }
  set status(value) {
    this._status = value;
  }
  /**
   * 获取连接的消息
   */
  get msg() {
    return this._msg;
  }
  set msg(value) {
    this._msg = value;
  }
  /**
   * 获取连接的地址
   */
  get account() {
    return this._account;
  }
  set account(value) {
    this._account = value;
  }
  /**
   * 获取连接的网络ID
   */
  get chainId() {
    return this._chainId;
  }
  set chainId(value) {
    this._chainId = value;
  }
  /**
   * 获取连接的地址信息
   */
  get addressInfo() {
    return this._addressInfo;
  }
  set addressInfo(value) {
    this._addressInfo = value;
  }
  // eslint-disable-next-line accessor-pairs
  set wallet(value) {
    this._wallet = value;
  }
  getWalletOrProvider() {
    return this._wallet || this._provider;
  }
  getScan() {
    return this.addressInfo.scan;
  }
  async addToken(tokenAddress) {
    const token = await this.erc20().getTokenInfo(tokenAddress);
    Trace.debug("token info", token);
    try {
      const wasAdded = await this.provider.send("wallet_watchAsset", {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimal
        }
      });
      if (wasAdded)
        return true;
    } catch (error) {
      Trace.error(error);
    }
    return false;
  }
}
