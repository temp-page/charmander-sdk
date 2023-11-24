import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
export class BaseAbi {
    constructor(connectInfo, address, abi) {
        this.provider = connectInfo.provider;
        this.connectInfo = connectInfo;
        this.addressInfo = connectInfo.addressInfo;
        this.mulContract = new MulContract(address, abi);
        this.contract = new Contract(address, abi, connectInfo.getWalletOrProvider());
    }
}
