var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WETHAbi } from '../../abi';
import { CacheKey, EnableLogs } from '../tool';
import { BaseAbi } from './BaseAbi';
let WETH = class WETH extends BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.WMNT, WETHAbi);
    }
    async deposit(amount) {
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'deposit', [], { value: amount });
    }
    async withdraw(amount) {
        // eslint-disable-next-line prefer-rest-params
        const args = Array.from(arguments);
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'withdraw', args);
    }
};
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WETH.prototype, "deposit", null);
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WETH.prototype, "withdraw", null);
WETH = __decorate([
    CacheKey('WETH'),
    __metadata("design:paramtypes", [Function])
], WETH);
export { WETH };
