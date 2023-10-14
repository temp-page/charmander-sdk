"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressInfo = void 0;
const ethers_1 = require("ethers");
const ConnectInfo_1 = require("../../ConnectInfo");
const WalletConnect_1 = require("../../WalletConnect");
const api_1 = require("../api");
const tool_1 = require("../tool");
/**
 * 地址信息
 */
class AddressInfo {
    constructor() {
        this.readonlyConnectInfoInstance = null;
        this.api = null;
    }
    getApi() {
        if (this.api == null) {
            this.api = (0, tool_1.createProxy)(new api_1.ApiProvider());
        }
        return this.api;
    }
    readonlyConnectInfo() {
        const currentConnect = (0, WalletConnect_1.getCurrentConnect)();
        if (currentConnect != null) {
            return currentConnect;
        }
        if (this.readonlyConnectInfoInstance == null) {
            const provider = new ethers_1.JsonRpcProvider(this.rpc, this.chainId);
            const connectInfo = new ConnectInfo_1.ConnectInfo();
            connectInfo.provider = provider;
            connectInfo.wallet = null;
            connectInfo.status = true;
            connectInfo.addressInfo = this;
            this.readonlyConnectInfoInstance = connectInfo;
        }
        return this.readonlyConnectInfoInstance;
    }
    getEtherscanAddress(address) {
        return `${this.scan}/address/${address}`;
    }
    getEtherscanTx(tx) {
        return `${this.scan}/tx/${tx}`;
    }
}
exports.AddressInfo = AddressInfo;
