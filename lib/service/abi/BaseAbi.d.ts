import { type ConnectInfo } from '../../ConnectInfo';
import { type AddressInfo } from '../vo';
import { Contract, type Provider, type Fragment, type JsonFragment } from 'ethers';
import { MulContract } from '../../mulcall';
export declare class BaseAbi {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected addressInfo: AddressInfo;
    mulContract: MulContract;
    contract: Contract;
    constructor(connectInfo: ConnectInfo, address: string, abi: JsonFragment[] | string[] | Fragment[]);
}
