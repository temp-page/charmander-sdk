var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ISwapRouter } from '../../abi';
import { CacheKey, CurrencyAmount, EnableLogs, TradeType } from '../tool';
import { invariant } from '../tool/math/Common';
import { RouteType } from '../tool/v3route/types';
import { maximumAmountIn, minimumAmountOut } from '../tool/v3route/utils/maximumAmount';
import { getCurrentAddressInfo } from '../../Constant';
import { encodeMixedRouteToPath } from '../tool/math/SwapV3Math';
import { BaseAbi } from './BaseAbi';
let SwapRouter = class SwapRouter extends BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.swapRouter, ISwapRouter);
    }
    async swap(trades, slippageTolerance, recipientAddr, deadline, gasPriceGWei) {
        const numberOfTrades = trades.reduce((numOfTrades, trade) => numOfTrades + trade.routes.length, 0);
        const sampleTrade = trades[0];
        // All trades should have the same starting/ending currency and trade type
        invariant(trades.every(trade => trade.inputAmount.currency.equals(sampleTrade.inputAmount.currency)), 'TOKEN_IN_DIFF');
        invariant(trades.every(trade => trade.outputAmount.currency.equals(sampleTrade.outputAmount.currency)), 'TOKEN_OUT_DIFF');
        invariant(trades.every(trade => trade.tradeType === sampleTrade.tradeType), 'TRADE_TYPE_DIFF');
        const calldatas = [];
        const inputIsNative = sampleTrade.inputAmount.currency.isNative;
        const outputIsNative = sampleTrade.outputAmount.currency.isNative;
        // flag for whether we want to perform an aggregated slippage check
        //   1. when there are >2 exact input trades. this is only a heuristic,
        //      as it's still more gas-expensive even in this case, but has benefits
        //      in that the reversion probability is lower
        const performAggregatedSlippageCheck = sampleTrade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2;
        // flag for whether funds should be send first to the router
        //   1. when receiving ETH (which much be unwrapped from WETH)
        //   2. when a fee on the output is being taken
        //   3. when performing swap and add
        //   4. when performing an aggregated slippage check
        const routerMustCustody = outputIsNative || performAggregatedSlippageCheck;
        for (const trade of trades) {
            if (trade.routes.every(r => r.type === RouteType.V3)) {
                for (const route of trade.routes) {
                    const { inputAmount, outputAmount, pools, path } = route;
                    const amountIn = maximumAmountIn(trade, slippageTolerance, inputAmount).quotient;
                    const amountOut = minimumAmountOut(trade, slippageTolerance, outputAmount).quotient;
                    // flag for whether the trade is single hop or not
                    const singleHop = pools.length === 1;
                    const recipient = routerMustCustody
                        ? getCurrentAddressInfo().swapRouter
                        : recipientAddr;
                    if (singleHop) {
                        if (trade.tradeType === TradeType.EXACT_INPUT) {
                            const exactInputSingleParams = {
                                tokenIn: path[0].wrapped.address,
                                tokenOut: path[1].wrapped.address,
                                fee: pools[0].fee,
                                recipient,
                                deadline: (Math.floor(+new Date() / 1000) + (+deadline)).toString(),
                                amountIn,
                                amountOutMinimum: performAggregatedSlippageCheck ? 0n : amountOut,
                                sqrtPriceLimitX96: 0n,
                            };
                            calldatas.push(this.contract.interface.encodeFunctionData('exactInputSingle', [exactInputSingleParams]));
                        }
                        else {
                            const exactOutputSingleParams = {
                                tokenIn: path[0].wrapped.address,
                                tokenOut: path[1].wrapped.address,
                                fee: pools[0].fee,
                                recipient,
                                deadline: (Math.floor(+new Date() / 1000) + (+deadline)).toString(),
                                amountOut,
                                amountInMaximum: amountIn,
                                sqrtPriceLimitX96: 0n,
                            };
                            calldatas.push(this.contract.interface.encodeFunctionData('exactOutputSingle', [exactOutputSingleParams]));
                        }
                    }
                    else {
                        const pathStr = encodeMixedRouteToPath({ ...route, input: inputAmount.currency, output: outputAmount.currency }, trade.tradeType === TradeType.EXACT_OUTPUT);
                        if (trade.tradeType === TradeType.EXACT_INPUT) {
                            const exactInputParams = {
                                path: pathStr,
                                recipient,
                                deadline: (Math.floor(+new Date() / 1000) + (+deadline)).toString(),
                                amountIn,
                                amountOutMinimum: performAggregatedSlippageCheck ? 0n : amountOut,
                            };
                            calldatas.push(this.contract.interface.encodeFunctionData('exactInput', [exactInputParams]));
                        }
                        else {
                            const exactOutputParams = {
                                path: pathStr,
                                recipient,
                                deadline: (Math.floor(+new Date() / 1000) + (+deadline)).toString(),
                                amountOut,
                                amountInMaximum: amountIn,
                            };
                            calldatas.push(this.contract.interface.encodeFunctionData('exactOutput', [exactOutputParams]));
                        }
                    }
                }
            }
        }
        const ZERO_IN = CurrencyAmount.fromRawAmount(sampleTrade.inputAmount.currency, 0);
        const ZERO_OUT = CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0);
        const minAmountOut = trades.reduce((sum, trade) => sum.add(minimumAmountOut(trade, slippageTolerance)), ZERO_OUT);
        const totalAmountIn = trades.reduce((sum, trade) => sum.add(maximumAmountIn(trade, slippageTolerance)), ZERO_IN);
        // unwrap or sweep
        if (routerMustCustody) {
            if (outputIsNative) {
                calldatas.push(this.contract.interface.encodeFunctionData('unwrapWMNT', [minAmountOut.quotient, recipientAddr]));
            }
            else {
                calldatas.push(this.contract.interface.encodeFunctionData('sweepToken', [sampleTrade.outputAmount.currency.wrapped.erc20Address(), minAmountOut.quotient, recipientAddr]));
            }
        }
        if (inputIsNative) {
            calldatas.push(this.contract.interface.encodeFunctionData('refundMNT', []));
        }
        return await this.connectInfo.tx().sendContractTransaction(this.contract, 'multicall', [calldatas], {
            gasPrice: gasPriceGWei,
            value: inputIsNative ? totalAmountIn.quotient.toString() : '0',
        });
    }
};
__decorate([
    EnableLogs(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Function, String, Object, String]),
    __metadata("design:returntype", Promise)
], SwapRouter.prototype, "swap", null);
SwapRouter = __decorate([
    CacheKey('SwapRouter'),
    __metadata("design:paramtypes", [Function])
], SwapRouter);
export { SwapRouter };
