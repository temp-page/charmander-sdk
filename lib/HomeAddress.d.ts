export declare const TESTNET_ADDRESSES: {
    AgniPoolDeployer: string;
    AgniFactory: string;
    InitCodeHashAddress: string;
    InitCodeHash: string;
    WMNT: string;
    SwapRouter: string;
    QuoterV2: string;
    TickLens: string;
    NFTDescriptor: string;
    NonfungibleTokenPositionDescriptor: string;
    NonfungiblePositionManager: string;
    AgniInterfaceMulticall: string;
    MasterChef: string;
    MasterChefV3Receiver: string;
    AgniLmPoolDeployer: string;
    ScoreCalculator: {
        Proxy: string;
        Admin: string;
        Implementation: string;
    };
    StakingPool: string;
    IdoPoolTemplate: string;
    IdoPoolFactory: string;
    InsurancePool: string;
    Multicall3: string;
    tokens: string[];
};
export declare const MAINNET_ADDRESSES: {
    AgniPoolDeployer: string;
    AgniFactory: string;
    InitCodeHashAddress: string;
    InitCodeHash: string;
    WMNT: string;
    SwapRouter: string;
    Quoter: string;
    QuoterV2: string;
    TickLens: string;
    NFTDescriptor: string;
    NonfungibleTokenPositionDescriptor: string;
    NonfungiblePositionManager: string;
    AgniInterfaceMulticall: string;
    Multicall3: string;
    tokens: string[];
};
export declare function initAddress(ENV: "dev" | "test" | "prod" | "prod_node"): void;
