import { Fragment, FunctionFragment, type JsonFragment } from 'ethers6';
export declare class MulContract {
    private readonly _address;
    private readonly _abi;
    private readonly _functions;
    get address(): string;
    get abi(): Fragment[];
    get functions(): FunctionFragment[];
    constructor(address: string, abi: JsonFragment[] | string[] | Fragment[]);
    [method: string]: any;
}
