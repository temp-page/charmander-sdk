import { ConnectInfo } from '../../ConnectInfo';
import { ContractCall, Provider } from '../../mulcall';
import { BaseAbi } from './BaseAbi';
export type ShapeWithLabel = Record<string, ContractCall | string>;
export declare class MultiCallContract extends BaseAbi {
    multiCallInstance: Provider;
    constructor(connectInfo: ConnectInfo);
    singleCall<T = any>(shapeWithLabel: ShapeWithLabel): Promise<T>;
    call<T = any[]>(...shapeWithLabels: ShapeWithLabel[]): Promise<T>;
}
