import { ConnectInfo } from '../../ConnectInfo';
import { ContractCall, Provider } from '../../mulcall';
import { BaseAbi } from './BaseAbi';
export type ShapeWithLabel = Record<string, ContractCall | string>;
export declare class MultiCallContract extends BaseAbi {
    multiCallInstance: Provider;
    constructor(connectInfo: ConnectInfo);
    encodeMulticall(calldatas: string | string[]): string;
    singleCall(shapeWithLabel: ShapeWithLabel): Promise<any>;
    call(...shapeWithLabels: ShapeWithLabel[]): Promise<any[]>;
}
