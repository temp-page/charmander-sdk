import { ConnectInfo } from '../../ConnectInfo';
import { ApiProvider } from "../api";
import { StorageProvider } from "../tool";
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
    blockGraphApi: string;
    exchangeGraphApi: string;
    readonlyConnectInfoInstance: ConnectInfo;
    api: ApiProvider;
    chainName: string;
    storage: StorageProvider;
    getApi(): ApiProvider;
    readonlyConnectInfo(): ConnectInfo;
    getEtherscanAddress(address: string): string;
    getEtherscanTx(tx: string): string;
}
