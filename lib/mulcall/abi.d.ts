import { ParamType, BytesLike } from 'ethers';
export declare class Abi {
    static encode(name: string, inputs: ParamType[], params: any[]): string;
    static decode(outputs: ParamType[], data: BytesLike): import("ethers").Result;
}
