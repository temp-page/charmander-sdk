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
import { INonfungiblePositionManager } from '../../abi';
import { CacheKey, EnableLogs, ZERO, ZERO_ADDRESS, isNullOrUndefined } from '../tool';
import { invariant } from '../tool/math/Common';
import { ETH_ADDRESS } from '../vo';
import { BaseAbi } from './BaseAbi';
const MaxUint128 = 2n ** 128n - 1n;
let NonfungiblePositionManager = class NonfungiblePositionManager extends BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.nonfungiblePositionManager, INonfungiblePositionManager);
    }
    async collect(tokenId, token0, token1, fee0, fee1, involvesMNT) {
        const calldatas = [];
        const involvesETH = involvesMNT && (token0.address === ETH_ADDRESS || token1.address === ETH_ADDRESS);
        // collect
        const account = this.connectInfo.account;
        calldatas.push(this.contract.interface.encodeFunctionData('collect', [{
                tokenId,
                recipient: involvesETH ? ZERO_ADDRESS : account,
                amount0Max: MaxUint128.toString(),
                amount1Max: MaxUint128.toString(),
            }]));
        if (involvesETH) {
            const ethAmount = token0.address === ETH_ADDRESS
                ? fee0
                : fee1;
            const token = token0.address === ETH_ADDRESS
                ? token1
                : token0;
            const tokenAmount = token0.address === ETH_ADDRESS
                ? fee1
                : fee0;
            calldatas.push(this.contract.interface.encodeFunctionData('unwrapWMNT', [ethAmount, account]));
            calldatas.push(this.contract.interface.encodeFunctionData('sweepToken', [token.erc20Address(), tokenAmount, account]));
        }
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'multicall', [calldatas]);
    }
    async addLiquidity(position, tokenId, createPool, slippageTolerance, deadline) {
        invariant(position.liquidity > ZERO, 'ZERO_LIQUIDITY');
        const recipient = this.connectInfo.account;
        const calldatas = [];
        // get amounts
        const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts;
        // adjust for slippage
        const minimumAmounts = position.mintAmountsWithSlippage(slippageTolerance);
        const amount0Min = minimumAmounts.amount0;
        const amount1Min = minimumAmounts.amount1;
        // create pool if needed
        if (createPool) {
            calldatas.push(this.contract.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [
                position.pool.token0.erc20Address(),
                position.pool.token1.erc20Address(),
                position.pool.fee,
                position.pool.sqrtRatioX96,
            ]));
        }
        if (!isNullOrUndefined(tokenId)) {
            calldatas.push(this.contract.interface.encodeFunctionData('increaseLiquidity', [
                {
                    tokenId: BigInt(tokenId),
                    amount0Desired,
                    amount1Desired,
                    amount0Min,
                    amount1Min,
                    deadline,
                },
            ]));
        }
        else {
            calldatas.push(this.contract.interface.encodeFunctionData('mint', [{
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
                }]));
        }
        let value = '0';
        if (position.pool.token0.isNative || position.pool.token1.isNative) {
            const wrapped = position.pool.token0.isNative ? position.pool.token0 : position.pool.token1.isNative ? position.pool.token1 : undefined;
            const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired;
            // we only need to refund if we're actually sending ETH
            if (wrappedValue > ZERO)
                calldatas.push(this.contract.interface.encodeFunctionData('refundMNT', []));
            value = wrappedValue.toString();
        }
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'multicall', [calldatas], {
            value,
        });
    }
    async removeLiquidity(rate, token0, token1, partialPosition, tokenId, fee0, fee1, involvesMNT, slippageTolerance, deadline) {
        const calldatas = [];
        invariant(partialPosition.liquidity > ZERO, 'ZERO_LIQUIDITY');
        // slippage-adjusted underlying amounts
        const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(slippageTolerance);
        // remove liquidity
        calldatas.push(this.contract.interface.encodeFunctionData('decreaseLiquidity', [
            {
                tokenId,
                liquidity: partialPosition.liquidity,
                amount0Min,
                amount1Min,
                deadline,
            },
        ]));
        const involvesETH = involvesMNT && (token0.address === ETH_ADDRESS || token1.address === ETH_ADDRESS);
        // collect
        const account = this.connectInfo.account;
        calldatas.push(this.contract.interface.encodeFunctionData('collect', [{
                tokenId,
                recipient: involvesETH ? ZERO_ADDRESS : account,
                amount0Max: MaxUint128.toString(),
                amount1Max: MaxUint128.toString(),
            }]));
        if (involvesETH) {
            const ethAmount = token0.address === ETH_ADDRESS
                ? new BigNumber(fee0).multipliedBy(amount0Min.toString()).toFixed(0, BigNumber.ROUND_DOWN)
                : new BigNumber(fee1).multipliedBy(amount1Min.toString()).toFixed(0, BigNumber.ROUND_DOWN);
            const token = token0.address === ETH_ADDRESS
                ? token1
                : token0;
            const tokenAmount = token0.address === ETH_ADDRESS
                ? new BigNumber(fee1).multipliedBy(amount1Min.toString()).toFixed(0, BigNumber.ROUND_DOWN)
                : new BigNumber(fee0).multipliedBy(amount0Min.toString()).toFixed(0, BigNumber.ROUND_DOWN);
            calldatas.push(this.contract.interface.encodeFunctionData('unwrapWMNT', [ethAmount, account]));
            calldatas.push(this.contract.interface.encodeFunctionData('sweepToken', [token.erc20Address(), tokenAmount, account]));
        }
        if (new BigNumber(rate).comparedTo('100') >= 0) {
            calldatas.push(this.contract.interface.encodeFunctionData('burn', [tokenId]));
        }
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'multicall', [calldatas]);
    }
};
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Boolean, Function, Number]),
    __metadata("design:returntype", Promise)
], NonfungiblePositionManager.prototype, "addLiquidity", null);
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, Function, Function, String, String, String, Boolean, Function, Number]),
    __metadata("design:returntype", Promise)
], NonfungiblePositionManager.prototype, "removeLiquidity", null);
NonfungiblePositionManager = __decorate([
    CacheKey('NonfungiblePositionManager'),
    __metadata("design:paramtypes", [Function])
], NonfungiblePositionManager);
export { NonfungiblePositionManager };
