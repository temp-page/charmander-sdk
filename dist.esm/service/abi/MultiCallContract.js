var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';
import { CacheKey } from '../tool';
import { Multicall2 } from '../../abi';
import { multicallExecute } from '../../mulcall';
import { BaseAbi } from './BaseAbi';
let MultiCallContract = class MultiCallContract extends BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.multicall, Multicall2);
    }
    async singleCall(shapeWithLabel) {
        const [res] = await this.call(...[shapeWithLabel]);
        return res;
    }
    async call(...shapeWithLabels) {
        if (shapeWithLabels.length === 0) {
            return [];
        }
        const calls = [];
        shapeWithLabels.forEach((relay) => {
            const pairs = toPairs(relay);
            pairs.forEach(([, value]) => {
                if (typeof value !== 'string')
                    calls.push(value);
            });
        });
        const res = await multicallExecute(this.contract, calls);
        let index = 0;
        const datas = shapeWithLabels.map((relay) => {
            const pairs = toPairs(relay);
            pairs.forEach((obj) => {
                if (typeof obj[1] !== 'string') {
                    obj[1] = res[index];
                    index++;
                }
            });
            return fromPairs(pairs);
        });
        return datas;
    }
};
MultiCallContract = __decorate([
    CacheKey('MultiCallContract'),
    __metadata("design:paramtypes", [Function])
], MultiCallContract);
export { MultiCallContract };
