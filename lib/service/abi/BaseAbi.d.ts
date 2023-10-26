import { type ConnectInfo } from '../../ConnectInfo';
import { type AddressInfo } from '../vo';
import { Contract, type Provider } from 'ethers';
import { MulContract } from '../../mulcall';
import { type Fragment, type JsonFragment } from '@ethersproject/abi';
export declare class BaseAbi {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected addressInfo: AddressInfo;
    mulContract: MulContract;
    contract: Contract;
    constructor(connectInfo: ConnectInfo, address: string, abi: JsonFragment[] | string[] | Fragment[]);
}
