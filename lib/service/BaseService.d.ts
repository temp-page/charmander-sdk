import { type ConnectInfo } from '../ConnectInfo';
import { type AddressInfo } from './vo';
import { type Provider } from 'ethers';
export declare class BaseService {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected addressInfo: AddressInfo;
    constructor(connectInfo: ConnectInfo);
}
