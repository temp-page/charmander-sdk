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
exports.NonfungiblePositionManager = exports.isMint = exports.MaxUint128 = void 0;
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const BaseAbi_1 = require("./BaseAbi");
const v3_1 = require("../tool/sdk/v3");
const Common_1 = require("../tool/math/Common");
exports.MaxUint128 = 2n ** 128n - 1n;
// type guard
function isMint(options) {
    return Object.keys(options).some((k) => k === 'recipient');
}
exports.isMint = isMint;
let NonfungiblePositionManager = class NonfungiblePositionManager extends BaseAbi_1.BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.nonfungiblePositionManager, abi_1.INonfungiblePositionManager);
    }
    encodeCreate(pool) {
        return this.contract.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [pool.token0.erc20Address(), pool.token1.erc20Address(), pool.fee, pool.sqrtRatioX96]);
    }
    async add(position, options) {
        let methodParameters = this.addCallParameters(position, options);
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'multicall', [methodParameters.calldata], {
            value: methodParameters.value,
        });
    }
    addCallParameters(position, options) {
        (0, Common_1.invariant)(position.liquidity > tool_1.ZERO, 'ZERO_LIQUIDITY');
        const calldatas = [];
        // get amounts
        const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts;
        // adjust for slippage
        const minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance);
        const amount0Min = minimumAmounts.amount0;
        const amount1Min = minimumAmounts.amount1;
        const deadline = BigInt(options.deadline);
        // create pool if needed
        if (isMint(options) && options.createPool) {
            calldatas.push(this.encodeCreate(position.pool));
        }
        // mint
        if (isMint(options)) {
            const recipient = (0, Common_1.validateAndParseAddress)(options.recipient);
            const a = {
                token0: position.pool.token0.erc20Address(),
                token1: position.pool.token1.erc20Address(),
                fee: position.pool.fee,
                tickLower: position.tickLower,
                tickUpper: position.tickUpper,
                amount0Desired,
                amount1Desired,
                amount0Min,
                amount1Min,
                recipient,
                deadline,
            };
            console.log(`---addCallParameters---: mint`);
            console.log(`params:`, a);
            calldatas.push(this.contract.interface.encodeFunctionData('mint', [a]));
        }
        else {
            calldatas.push(this.contract.interface.encodeFunctionData('increaseLiquidity', [
                {
                    tokenId: BigInt(options.tokenId),
                    amount0Desired,
                    amount1Desired,
                    amount0Min,
                    amount1Min,
                    deadline,
                },
            ]));
        }
        let value = "0";
        if (options.useNative) {
            const { wrapped } = options.useNative;
            (0, Common_1.invariant)(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped), 'NO_WETH');
            const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired;
            // we only need to refund if we're actually sending ETH
            if (wrappedValue > tool_1.ZERO) {
                calldatas.push(this.contract.interface.encodeFunctionData('refundMNT', []));
            }
            value = wrappedValue.toString();
        }
        return {
            calldata: calldatas,
            value,
        };
    }
};
exports.NonfungiblePositionManager = NonfungiblePositionManager;
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [v3_1.Position, Object]),
    __metadata("design:returntype", Promise)
], NonfungiblePositionManager.prototype, "add", null);
exports.NonfungiblePositionManager = NonfungiblePositionManager = __decorate([
    (0, tool_1.CacheKey)('NonfungiblePositionManager'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], NonfungiblePositionManager);
