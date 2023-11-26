var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IERC20 } from '../../abi';
import { CacheKey } from '../tool';
import { BaseAbi } from './BaseAbi';
let ERC20 = class ERC20 extends BaseAbi {
    constructor(connectInfo, token) {
        super(connectInfo, token, IERC20);
    }
    async allowance(owner, sender) {
        return (await this.contract.allowance(owner, sender)).toString();
    }
    async approve(spender, value) {
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'approve', [spender, value], {});
    }
    async transfer(to, value) {
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'transfer', [to, value], {});
    }
    async transferFrom(from, to, value) {
        return await this.connectInfo
            .tx()
            .sendContractTransaction(this.contract, 'transferFrom', [from, to, value], {});
    }
    async totalSupply() {
        return (await this.contract.totalSupply()).toString();
    }
    async balanceOf(owner) {
        return (await this.contract.balanceOf(owner)).toString();
    }
    async name() {
        return (await this.contract.name()).toString();
    }
    async symbol() {
        return (await this.contract.symbol()).toString();
    }
    async decimals() {
        return Number.parseInt((await this.contract.decimals()).toString(), 10);
    }
};
ERC20 = __decorate([
    CacheKey('ERC20'),
    __metadata("design:paramtypes", [Function, String])
], ERC20);
export { ERC20 };
