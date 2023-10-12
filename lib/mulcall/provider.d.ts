import { type ContractCall } from './types';
import { type JsonRpcApiProvider } from 'ethers';
export declare class Provider {
    private readonly _provider;
    private readonly _multicallAddress;
    constructor(provider: JsonRpcApiProvider, multicallAddress: string);
    getEthBalance(address: string): any;
    all<T extends any[] = any[]>(calls: ContractCall[]): Promise<T>;
}
