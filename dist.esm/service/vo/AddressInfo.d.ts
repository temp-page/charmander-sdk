import { ConnectInfo } from '../../ConnectInfo';
import { ApiProvider } from '../api';
import type { StorageProvider } from '../tool';
/**
 * 地址信息
 */
export declare class AddressInfo {
    /**
     * chainID
     */
    chainId: number;
    /**
     * 链上区块浏览器地址
     */
    scan: string;
    rpc: string;
    multicall: string;
    gasMulticall: string;
    initCodeHashAddress: string;
    initCodeHash: string;
    swapRouter: string;
    quoterV2: string;
    tickLens: string;
    nftDescriptor: string;
    nonfungibleTokenPositionDescriptor: string;
    nonfungiblePositionManager: string;
    agniPoolDeployer: string;
    WMNT: string;
    USDT: string;
    RUSDY: string;
    USDY: string;
    AgniProjectPartyReward: string;
    blockGraphApi: string;
    exchangeGraphApi: string;
    projectPartyRewardGraphApi: string;
    launchpadStakeToken: string;
    launchpadStakePool: string;
    launchpadInsurancePool: string;
    launchpadGraphApi: string;
    baseApiUrl: string;
    baseTradeToken: string[];
    readonlyConnectInfoInstance: ConnectInfo;
    api: ApiProvider;
    chainName: string;
    storage: StorageProvider;
    getApi(): ApiProvider;
    readonlyConnectInfo(): ConnectInfo;
    getEtherscanAddress(address: string): string;
    getEtherscanTx(tx: string): string;
    getEtherscanLink(data: string, type: 'transaction' | 'token' | 'address' | 'block'): string;
}
