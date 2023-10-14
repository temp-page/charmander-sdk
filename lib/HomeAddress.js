"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAddress = void 0;
const Constant_1 = require("./Constant");
const WalletConnect_1 = require("./WalletConnect");
const service_1 = require("./service");
function initAddress(ENV) {
    if (ENV === "dev") {
        const addressInfo = new service_1.AddressInfo();
        addressInfo.chainId = 5001;
        addressInfo.chainName = "Mantle Testnet";
        addressInfo.scan = "https://explorer.testnet.mantle.xyz/";
        addressInfo.rpc = "https://rpc.testnet.mantle.xyz";
        addressInfo.multicall = "0x70f0c400171158c29B61a3E79C92c72e95679541";
        addressInfo.storage = new service_1.StorageProvider('node');
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else if (ENV === "test") {
        const addressInfo = new service_1.AddressInfo();
        addressInfo.chainId = 5001;
        addressInfo.chainName = "Mantle Testnet";
        addressInfo.scan = "https://explorer.testnet.mantle.xyz/";
        addressInfo.rpc = "https://rpc.testnet.mantle.xyz";
        addressInfo.multicall = "0x70f0c400171158c29B61a3E79C92c72e95679541";
        addressInfo.storage = new service_1.StorageProvider('web');
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else if (ENV === "prod") {
        const addressInfo = new service_1.AddressInfo();
        addressInfo.chainId = 5000;
        addressInfo.chainName = "Mantle";
        addressInfo.scan = "https://explorer.mantle.xyz/";
        addressInfo.rpc = "https://rpc.mantle.xyz";
        addressInfo.multicall = "0x05f3105fc9FC531712b2570f1C6E11dD4bCf7B3c";
        addressInfo.storage = new service_1.StorageProvider('web');
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else {
        throw new Error(ENV + " is not support");
    }
    service_1.Trace.debug("address config init", ENV, (0, Constant_1.getCurrentAddressInfo)());
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
