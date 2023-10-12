"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressInfo = exports.initAddress = exports.HomeAddress = void 0;
const service_1 = require("./service");
const Constant_1 = require("./Constant");
const WalletConnect_1 = require("./WalletConnect");
class HomeAddress extends service_1.AddressInfo {
}
exports.HomeAddress = HomeAddress;
function initAddress(ENV) {
    if (ENV === "dev") {
        const addressInfo = new HomeAddress();
        addressInfo.chainId = 5001;
        addressInfo.chainName = "Mantle Testnet";
        addressInfo.scan = "https://explorer.mantle.xyz/";
        addressInfo.rpc = "https://rpc.mantle.xyz";
        addressInfo.multicall = "0x70f0c400171158c29B61a3E79C92c72e95679541";
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else if (ENV === "prod") {
        const addressInfo = new HomeAddress();
        addressInfo.chainId = 5000;
        addressInfo.chainName = "Mantle";
        addressInfo.scan = "https://explorer.mantle.xyz/";
        addressInfo.rpc = "https://rpc.mantle.xyz";
        addressInfo.multicall = "0x05f3105fc9FC531712b2570f1C6E11dD4bCf7B3c";
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else {
        throw new Error(ENV + " is not support");
    }
    console.log(ENV, (0, Constant_1.getCurrentAddressInfo)());
    WalletConnect_1.ConnectManager.chainMap["Mantle Testnet"] = [
        {
            chainId: "0x1389",
            chainName: "Mantle Testnet",
            nativeCurrency: {
                name: "MNT",
                symbol: "MNT",
                decimals: 18,
            },
            rpcUrls: ["https://rpc.testnet.mantle.xyz"],
            blockExplorerUrls: ["https://explorer.testnet.mantle.xyz/"],
        },
    ];
    WalletConnect_1.ConnectManager.chainMap["Mantle"] = [
        {
            chainId: "0x1388",
            chainName: "Mantle",
            nativeCurrency: {
                name: "MNT",
                symbol: "MNT",
                decimals: 18,
            },
            rpcUrls: ["https://rpc.mantle.xyz"],
            blockExplorerUrls: ["https://explorer.mantle.xyz/"],
        },
    ];
    WalletConnect_1.ConnectManager.chainMap["Goerli"] = "0x5";
    WalletConnect_1.ConnectManager.chainMap["sepolia"] = "0xaa36a7";
}
exports.initAddress = initAddress;
function getAddressInfo() {
    const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
    return currentAddressInfo;
}
exports.getAddressInfo = getAddressInfo;
