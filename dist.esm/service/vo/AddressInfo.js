import { JsonRpcProvider, Network } from 'ethers';
import { ConnectInfo } from '../../ConnectInfo';
import { ApiProvider } from '../api';
import { createProxy } from '../tool';
/**
 * 地址信息
 */
export class AddressInfo {
    getApi() {
        if (typeof this.api === 'undefined')
            this.api = createProxy(new ApiProvider());
        return this.api;
    }
    readonlyConnectInfo() {
        if (typeof this.readonlyConnectInfoInstance === 'undefined') {
            const provider = new JsonRpcProvider(this.rpc, this.chainId, { staticNetwork: new Network(this.chainName, this.chainId), batchStallTime: 100 });
            const connectInfo = new ConnectInfo();
            connectInfo.provider = provider;
            connectInfo.wallet = undefined;
            connectInfo.status = true;
            connectInfo.addressInfo = this;
            this.readonlyConnectInfoInstance = connectInfo;
        }
        return this.readonlyConnectInfoInstance;
    }
    getEtherscanAddress(address) {
        return this.getEtherscanLink(address, 'address');
    }
    getEtherscanTx(tx) {
        return this.getEtherscanLink(tx, 'transaction');
    }
    getEtherscanLink(data, type) {
        const prefix = this.scan;
        switch (type) {
            case 'transaction': {
                return `${prefix}/tx/${data}`;
            }
            case 'token': {
                return `${prefix}/token/${data}`;
            }
            case 'block': {
                return `${prefix}/block/${data}`;
            }
            case 'address':
            default: {
                return `${prefix}/address/${data}`;
            }
        }
    }
}
