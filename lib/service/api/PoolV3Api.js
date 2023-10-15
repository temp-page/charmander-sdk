"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolV3Api = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const vo_1 = require("../vo");
const ethers_1 = require("ethers");
let PoolV3Api = class PoolV3Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    computePoolAddress(tokenA, tokenB, fee) {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
        const poolInitCodeHash = this.baseApi.address().initCodeHash;
        const agniPoolDeployer = this.baseApi.address().agniPoolDeployer;
        const encodedParams = ethers_1.AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint24'], [token0.erc20Address(), token1.erc20Address(), fee]);
        const salt = (0, ethers_1.solidityPackedKeccak256)(['bytes'], [encodedParams]);
        const create2Address = (0, ethers_1.getCreate2Address)(agniPoolDeployer, salt, poolInitCodeHash);
        return create2Address;
    }
    async info(token0, token1) {
        let addLiquidityV3Info = new vo_1.AddLiquidityV3Info();
        return addLiquidityV3Info;
    }
};
exports.PoolV3Api = PoolV3Api;
exports.PoolV3Api = PoolV3Api = __decorate([
    (0, tool_1.CacheKey)("PoolV3Api"),
    __metadata("design:paramtypes", [])
], PoolV3Api);
