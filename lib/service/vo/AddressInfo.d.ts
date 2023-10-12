import { ConnectInfo } from '../../ConnectInfo';
import { ApiProvider } from "../api/ApiProvider";
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
    readonlyConnectInfoInstance: ConnectInfo;
    api: ApiProvider;
    getApi(): ApiProvider;
    readonlyConnectInfo(): ConnectInfo;
    getEtherscanAddress(address: any): string;
    getEtherscanTx(tx: any): string;
}
