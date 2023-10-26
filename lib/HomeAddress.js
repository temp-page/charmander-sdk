"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAddress = exports.MAINNET_ADDRESSES = exports.TESTNET_ADDRESSES = void 0;
const Constant_1 = require("./Constant");
const WalletConnect_1 = require("./WalletConnect");
const service_1 = require("./service");
exports.TESTNET_ADDRESSES = {
    AgniPoolDeployer: '0x0B7e80F0e664ae80bbE0c56f7908ef14f5898b1d',
    AgniFactory: '0x503Ca2ad7C9C70F4157d14CF94D3ef5Fa96D7032',
    InitCodeHashAddress: '0xECeFAd547Dd6E5556065dF7797D9fC892B5EA864',
    InitCodeHash: '0xaf9bd540c3449b723624376f906d8d3a0e6441ff18b847f05f4f85789ab64d9a',
    WMNT: '0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A',
    SwapRouter: '0xe2DB835566F8677d6889ffFC4F3304e8Df5Fc1df',
    QuoterV2: '0x49C8bb51C6bb791e8D6C31310cE0C14f68492991',
    TickLens: '0x0DC832e8cA4a7E1CE073096709474A5422029DB3',
    NFTDescriptor: '0x8002eb63E37728ddf15bd42Bf2607CBbBa714b3f',
    NonfungibleTokenPositionDescriptor: '0xDc7E9B3E927f2880CEa359e659321F9d232aCb2c',
    NonfungiblePositionManager: '0xb04a19EF7853c52EDe6FBb28F8FfBecb73329eD7',
    AgniInterfaceMulticall: '0xF9Ae3Cc6D6483722b94d7075C9B366bcbbbab9d3',
    MasterChef: '0x0BC31D78e06ef928658e0B6AB50460552f3D91c4',
    MasterChefV3Receiver: '0x882a2c07Bf04DEcCA36Be060B07d8BC0EE50D2Ff',
    AgniLmPoolDeployer: '0x8e8a453Bc0d968bBb284766aa4fE018a367E3106',
    ScoreCalculator: {
        Proxy: '0x9Cecf546DC36A2DaA5eC7375C3cF35FEd1ADD7a2',
        Admin: '0x077e4C7F653FFe83cb560d994aDFF5685b3F0e6B',
        Implementation: '0xF3FaF04d1FeF0bce0a3cCD7a817810B9071fDa36',
    },
    StakingPool: '0x31Fa04284049BD9C3Aff46503482270f0Be4BC5E',
    IdoPoolTemplate: '0xae411e11D9fA2773CEaC200cC2C73F17324Fc93B',
    IdoPoolFactory: '0xBfdb61b73Ad4647f3EcBeeeE5e875F081C486d53',
    InsurancePool: '0xccc6A1C40BCFd5458CE3ebB731644fc62E3041e9',
    Multicall3: '0x70f0c400171158c29B61a3E79C92c72e95679541',
    tokens: [
        '0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A',
        '0x3e163F861826C3f7878bD8fa8117A179d80731Ab',
        '0x82a2eb46a64e4908bbc403854bc8aa699bf058e9',
        '0x74a0e7118480bdff5f812c7a879a41db09ac2c39',
        '0xd0c049ee0b0832e5678d837c1519e1b2380e32e4',
        '0x113667C49c053230D3232AC7d74F471Dcd42f11E',
    ],
};
exports.MAINNET_ADDRESSES = {
    AgniPoolDeployer: '0xe9827B4EBeB9AE41FC57efDdDd79EDddC2EA4d03',
    AgniFactory: '0x25780dc8Fc3cfBD75F33bFDAB65e969b603b2035',
    InitCodeHashAddress: '0x5cfa0f1c4067C90a50B973e5F98CD265de5Df724',
    InitCodeHash: '0xaf9bd540c3449b723624376f906d8d3a0e6441ff18b847f05f4f85789ab64d9a',
    WMNT: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
    SwapRouter: '0x319B69888b0d11cEC22caA5034e25FfFBDc88421',
    Quoter: '0x9488C05a7b75a6FefdcAE4f11a33467bcBA60177',
    QuoterV2: '0xc4aaDc921E1cdb66c5300Bc158a313292923C0cb',
    TickLens: '0xEcDbA665AA209247CD334d0D037B913528a7bf67',
    NFTDescriptor: '0x70153a35c3005385b45c47cDcfc7197c1a22477a',
    NonfungibleTokenPositionDescriptor: '0xcb814b767D41b4BD94dA6Abb860D25b607ad5764',
    NonfungiblePositionManager: '0x218bf598D1453383e2F4AA7b14fFB9BfB102D637',
    AgniInterfaceMulticall: '0xBE592EFcF174b3E0E4208DC8c1658822d017568f',
    Multicall3: '0x05f3105fc9FC531712b2570f1C6E11dD4bCf7B3c',
    tokens: [
        '0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8',
        '0x201eba5cc46d216ce6dc03f6a759e8e766e956ae',
        '0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111',
        '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9',
    ],
};
function initAddress(ENV) {
    if (ENV === "dev" || ENV === "test") {
        const addressInfo = new service_1.AddressInfo();
        addressInfo.chainId = 5001;
        addressInfo.chainName = "Mantle Testnet";
        addressInfo.scan = "https://explorer.testnet.mantle.xyz";
        addressInfo.rpc = "https://rpc.testnet.mantle.xyz";
        addressInfo.multicall = exports.TESTNET_ADDRESSES.Multicall3;
        addressInfo.initCodeHashAddress = exports.TESTNET_ADDRESSES.InitCodeHashAddress;
        addressInfo.initCodeHash = exports.TESTNET_ADDRESSES.InitCodeHash;
        addressInfo.swapRouter = exports.TESTNET_ADDRESSES.SwapRouter;
        addressInfo.quoterV2 = exports.TESTNET_ADDRESSES.QuoterV2;
        addressInfo.tickLens = exports.TESTNET_ADDRESSES.TickLens;
        addressInfo.nftDescriptor = exports.TESTNET_ADDRESSES.NFTDescriptor;
        addressInfo.nonfungibleTokenPositionDescriptor = exports.TESTNET_ADDRESSES.NonfungibleTokenPositionDescriptor;
        addressInfo.nonfungiblePositionManager = exports.TESTNET_ADDRESSES.NonfungiblePositionManager;
        addressInfo.agniPoolDeployer = exports.TESTNET_ADDRESSES.AgniPoolDeployer;
        addressInfo.WMNT = exports.TESTNET_ADDRESSES.WMNT;
        addressInfo.exchangeGraphApi = "https://testnet.agni.finance/graph/subgraphs/name/agni/exchange-v3";
        addressInfo.blockGraphApi = "https://testnet.agni.finance/graph/subgraphs/name/agni/blocks";
        addressInfo.launchpadGraphApi = "https://testnet.agni.finance/graph/subgraphs/name/agni/launchpad";
        addressInfo.launchpadStakePool = exports.TESTNET_ADDRESSES.StakingPool;
        addressInfo.launchpadInsurancePool = exports.TESTNET_ADDRESSES.InsurancePool;
        addressInfo.launchpadStakeToken = "0x113667C49c053230D3232AC7d74F471Dcd42f11E";
        addressInfo.baseApiUrl = 'https://testnet.agni.finance';
        if (ENV == "dev") {
            addressInfo.storage = new service_1.StorageProvider('node');
        }
        if (ENV == "test") {
            addressInfo.storage = new service_1.StorageProvider('web');
        }
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else if (ENV === "prod" || ENV === 'prod_node') {
        const addressInfo = new service_1.AddressInfo();
        addressInfo.chainId = 5000;
        addressInfo.chainName = "Mantle";
        addressInfo.scan = "https://explorer.mantle.xyz";
        addressInfo.rpc = "https://rpc.mantle.xyz";
        addressInfo.multicall = exports.MAINNET_ADDRESSES.Multicall3;
        addressInfo.initCodeHashAddress = exports.MAINNET_ADDRESSES.InitCodeHashAddress;
        addressInfo.initCodeHash = exports.MAINNET_ADDRESSES.InitCodeHash;
        addressInfo.swapRouter = exports.MAINNET_ADDRESSES.SwapRouter;
        addressInfo.quoterV2 = exports.MAINNET_ADDRESSES.QuoterV2;
        addressInfo.tickLens = exports.MAINNET_ADDRESSES.TickLens;
        addressInfo.nftDescriptor = exports.MAINNET_ADDRESSES.NFTDescriptor;
        addressInfo.nonfungibleTokenPositionDescriptor = exports.MAINNET_ADDRESSES.NonfungibleTokenPositionDescriptor;
        addressInfo.nonfungiblePositionManager = exports.MAINNET_ADDRESSES.NonfungiblePositionManager;
        addressInfo.agniPoolDeployer = exports.MAINNET_ADDRESSES.AgniPoolDeployer;
        addressInfo.WMNT = exports.MAINNET_ADDRESSES.WMNT;
        addressInfo.exchangeGraphApi = "https://agni.finance/graph/subgraphs/name/agni/exchange-v3";
        addressInfo.launchpadGraphApi = "https://agni.finance/graph/subgraphs/name/agni/launchpad";
        addressInfo.blockGraphApi = "https://agni.finance/graph/subgraphs/name/agni/blocks";
        addressInfo.launchpadStakePool = '';
        addressInfo.launchpadStakeToken = '';
        addressInfo.launchpadInsurancePool = '';
        addressInfo.baseApiUrl = 'https://agni.finance';
        if (ENV === "prod") {
            addressInfo.storage = new service_1.StorageProvider('web');
        }
        if (ENV === "prod_node") {
            addressInfo.storage = new service_1.StorageProvider('node');
        }
        (0, Constant_1.updateCurrentAddressInfo)(addressInfo);
    }
    else {
        throw new Error(ENV + " is not support");
    }
    service_1.Trace.debug("address config init", ENV);
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
