var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IQuoterV2 } from '../../abi';
import { CacheKey } from '../tool';
import { BaseAbi } from './BaseAbi';
let IQuoterV2Abi = class IQuoterV2Abi extends BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.quoterV2, IQuoterV2);
    }
};
IQuoterV2Abi = __decorate([
    CacheKey('IQuoterV2Abi'),
    __metadata("design:paramtypes", [Function])
], IQuoterV2Abi);
export { IQuoterV2Abi };
