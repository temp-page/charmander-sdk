import { type ContractCall } from './types';
import { type JsonRpcApiProvider } from 'ethers';
export declare function all<T extends any[] = any[]>(calls: ContractCall[], multicallAddress: string, provider: JsonRpcApiProvider): Promise<T>;
