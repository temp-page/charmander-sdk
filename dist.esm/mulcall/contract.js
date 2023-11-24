import { Fragment, FunctionFragment } from 'ethers';
export class MulContract {
    get address() {
        return this._address;
    }
    get abi() {
        return this._abi;
    }
    get functions() {
        return this._functions;
    }
    constructor(address, abi) {
        this._address = address;
        this._abi = toFragment(abi);
        this._functions = this._abi.filter(x => x.type === 'function').map(x => FunctionFragment.from(x));
        const callFunctions = this._functions.filter(x => x.stateMutability === 'pure' || x.stateMutability === 'view');
        for (const callFunction of callFunctions) {
            const { name } = callFunction;
            const getCall = makeCallFunction(this, name);
            if (!this[name])
                defineReadOnly(this, name, getCall);
        }
    }
}
function toFragment(abi) {
    return abi.map((item) => Fragment.from(item));
}
function makeCallFunction(contract, name) {
    return (...params) => {
        const { address } = contract;
        const f1 = contract.functions.find(f => f.name === name);
        const f2 = contract.functions.find(f => f.name === name);
        return {
            contract: {
                address,
            },
            name,
            inputs: f1?.inputs,
            outputs: f2?.outputs,
            params,
        };
    };
}
function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value,
        writable: false,
    });
}
