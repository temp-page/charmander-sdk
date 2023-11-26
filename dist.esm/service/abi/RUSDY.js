var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import BigNumber from 'bignumber.js';
import { RUSDYAbi } from '../../abi';
import { CacheKey, EnableLogs } from '../tool';
import { BaseAbi } from './BaseAbi';
let RUSDY = class RUSDY extends BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.RUSDY, RUSDYAbi);
        this.BPS_DENOMINATOR = 10000;
    }
    async wrap(amount) {
        // eslint-disable-next-line prefer-rest-params
        const args = Array.from(arguments);
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'wrap', args);
    }
    async unwrap(amount) {
        // eslint-disable-next-line prefer-rest-params
        const args = Array.from(arguments);
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'unwrap', args);
    }
    async getRUSDYByShares(_USDYAmount) {
        const amount = new BigNumber(_USDYAmount).multipliedBy(1e18).multipliedBy(this.BPS_DENOMINATOR).toFixed();
        return new BigNumber(this.contract.getRUSDYByShares(amount).toString()).div(1e18).toFixed();
    }
    async getSharesByRUSDY(_rUSDYAmount) {
        const amount = new BigNumber(_rUSDYAmount).multipliedBy(1e18).toFixed();
        return new BigNumber(this.contract.getSharesByRUSDY(amount).toString()).div(1e18).div(this.BPS_DENOMINATOR).toFixed();
    }
};
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RUSDY.prototype, "wrap", null);
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RUSDY.prototype, "unwrap", null);
RUSDY = __decorate([
    CacheKey('RUSDY'),
    __metadata("design:paramtypes", [Function])
], RUSDY);
export { RUSDY };
