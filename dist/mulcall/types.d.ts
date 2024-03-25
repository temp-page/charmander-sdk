import type { ParamType } from 'ethers6';
export interface ContractCall {
    contract: {
        address: string;
    };
    name: string;
    inputs: ParamType[];
    outputs: ParamType[];
    params: any[];
}
