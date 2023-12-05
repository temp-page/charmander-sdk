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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapV3Api = void 0;
const groupBy_1 = __importDefault(require("lodash/groupBy"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const vo_1 = require("../vo");
const tool_1 = require("../tool");
const utils_1 = require("../tool/sdk/v3/utils");
const SwapV3Math_1 = require("../tool/math/SwapV3Math");
const constants_1 = require("../tool/v3route/constants");
const abi_1 = require("../abi");
const mulcall_1 = require("../../mulcall");
const route_1 = require("../tool/v3route/functions/route");
const getBestTrade_1 = require("../tool/v3route/getBestTrade");
const SwapRouter_1 = require("../abi/SwapRouter");
const Constant_1 = require("../../Constant");
const RUSDY_1 = require("../abi/RUSDY");
const WETH_1 = require("../abi/WETH");
const PoolV3Api_1 = require("./PoolV3Api");
const SwapV3Gql_1 = require("./gql/SwapV3Gql");
const BaseApi_1 = require("./BaseApi");
const TransactionHistory_1 = require("./TransactionHistory");
let SwapV3Api = class SwapV3Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    getPoolMetaData(tokenA, tokenB) {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
        return [vo_1.FeeAmount.LOWEST, vo_1.FeeAmount.LOW, vo_1.FeeAmount.MEDIUM, vo_1.FeeAmount.HIGH]
            .map((it) => {
            const address = PoolV3Api_1.PoolV3Api.computePoolAddress(token0, token1, it);
            return {
                address,
                token0: token0.wrapped,
                token1: token1.wrapped,
                fee: it,
            };
        });
    }
    async getCandidatePoolsOnGraphNode(tokenA, tokenB, mataData) {
        const metaDataGroup = (0, groupBy_1.default)(mataData, it => it.address.toLowerCase());
        const swapQueryV3PoolsResult = await this.baseApi.exchangeGraph(SwapV3Gql_1.SwapQueryV3Pools, {
            pageSize: 1000,
            poolAddrs: mataData.map(it => it.address.toLowerCase()),
        });
        const pools = swapQueryV3PoolsResult.pools.map((it) => {
            const metaDataGroupElement = metaDataGroup[it.id];
            if (!metaDataGroupElement && metaDataGroupElement.length === 0)
                return undefined;
            const metaData = metaDataGroupElement[0];
            const { fee, token0, token1, address } = metaData;
            const [token0ProtocolFee, token1ProtocolFee] = (0, utils_1.parseProtocolFees)(it.feeProtocol);
            return {
                fee,
                token0,
                token1,
                liquidity: BigInt(it.liquidity),
                sqrtRatioX96: BigInt(it.sqrtPrice),
                tick: Number(it.tick),
                address,
                tvlUSD: BigInt(Number.parseInt(it.totalValueLockedUSD)),
                token0ProtocolFee,
                token1ProtocolFee,
                ticks: undefined,
            };
        }).filter(it => !(0, tool_1.isNullOrUndefined)(it));
        return (0, constants_1.v3PoolTvlSelector)(tokenA, tokenB, pools);
    }
    async getCandidatePoolsByToken(tokenA, tokenB) {
        const poolMetaData = (0, SwapV3Math_1.getPairCombinations)(tokenA, tokenB).flatMap(it => this.getPoolMetaData(it[0], it[1]));
        return this.getCandidatePoolsOnGraphNode(tokenA, tokenB, poolMetaData);
    }
    async getCandidatePoolsByPair(tokenA, tokenB) {
        const poolMetaData = this.getPoolMetaData(tokenA, tokenB);
        return this.getCandidatePoolsOnGraphNode(tokenA, tokenB, poolMetaData);
    }
    async swapInfo(token0, token1, account) {
        const swapInfo = new vo_1.SwapInfo();
        swapInfo.token0 = token0;
        swapInfo.token1 = token1;
        swapInfo.isWrapped = false;
        if (token0.address === vo_1.ETH_ADDRESS && token1.address === (0, Constant_1.getCurrentAddressInfo)().WMNT) {
            swapInfo.isWrapped = true;
            swapInfo.wrapType = 'wrap';
        }
        if (token1.address === vo_1.ETH_ADDRESS && token0.address === (0, Constant_1.getCurrentAddressInfo)().WMNT) {
            swapInfo.isWrapped = true;
            swapInfo.wrapType = 'unwrap';
        }
        if (token1.address === (0, Constant_1.getCurrentAddressInfo)().RUSDY && token0.address === (0, Constant_1.getCurrentAddressInfo)().USDY) {
            swapInfo.isWrapped = true;
            swapInfo.wrapType = 'wrap';
        }
        if (token0.address === (0, Constant_1.getCurrentAddressInfo)().RUSDY && token1.address === (0, Constant_1.getCurrentAddressInfo)().USDY) {
            swapInfo.isWrapped = true;
            swapInfo.wrapType = 'unwrap';
        }
        swapInfo.token0Balance = vo_1.BalanceAndAllowance.unavailable(token0);
        swapInfo.token1Balance = vo_1.BalanceAndAllowance.unavailable(token1);
        const initBalance = async () => {
            if (account) {
                const balanceAndAllowances = await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(account, this.baseApi.address().nonfungiblePositionManager, [token0, token1]);
                swapInfo.token0Balance = balanceAndAllowances[token0.address];
                swapInfo.token1Balance = balanceAndAllowances[token1.address];
            }
        };
        const initTokenUsdPrice = async () => {
            const tokenPrices = await this.baseApi.address().getApi().tokenMangerApi().tokenPrice(token0, token1);
            swapInfo.token0Price = tokenPrices[0];
            swapInfo.token1Price = tokenPrices[1];
        };
        await Promise.all([initBalance(), initTokenUsdPrice()]);
        const swapByRoute = async (inputToken, inputAmount, swapConfig) => {
            try {
                swapInfo.trade = undefined;
                swapInfo.canSwap = false;
                swapInfo.swapConfig = swapConfig;
                const routerTrade = await this.getBestTrade(swapInfo.token0, swapInfo.token1, inputAmount, inputToken, swapConfig);
                swapInfo.canSwap = true;
                swapInfo.trade = routerTrade;
                swapInfo.intputToken = inputToken;
                swapInfo.inputAmount = inputAmount;
                if (swapInfo.token1.equals(inputToken)) {
                    swapInfo.token0Amount = routerTrade.outputAmount.toFixed();
                    swapInfo.token1Amount = inputAmount;
                    swapInfo.maximumSold = new bignumber_js_1.default(swapInfo.token0Amount).multipliedBy(1 + Number.parseFloat(swapConfig.allowedSlippage)).toFixed();
                    swapInfo.minimumReceived = undefined;
                }
                else {
                    swapInfo.token0Amount = inputAmount;
                    swapInfo.token1Amount = routerTrade.outputAmount.toFixed();
                    swapInfo.minimumReceived = new bignumber_js_1.default(swapInfo.token1Amount).multipliedBy(1 - Number.parseFloat(swapConfig.allowedSlippage)).toFixed();
                    swapInfo.maximumSold = undefined;
                }
                swapInfo.token0SwapPrice = new bignumber_js_1.default(swapInfo.token1Amount).div(swapInfo.token0Amount).toFixed();
                swapInfo.token1SwapPrice = new bignumber_js_1.default(swapInfo.token0Amount).div(swapInfo.token1Amount).toFixed();
                const computeTradePrice = (0, SwapV3Math_1.computeTradePriceBreakdown)(routerTrade);
                swapInfo.tradingFee = computeTradePrice.lpFeeAmount?.toFixed();
                swapInfo.priceImpact = computeTradePrice.priceImpactWithoutFee?.toFixed();
            }
            catch (e) {
                tool_1.Trace.error(e);
                swapInfo.canSwap = false;
                swapInfo.intputToken = undefined;
                swapInfo.inputAmount = undefined;
                swapInfo.token0Price = undefined;
                swapInfo.token1Price = undefined;
                swapInfo.tradingFee = undefined;
                swapInfo.minimumReceived = undefined;
                swapInfo.maximumSold = undefined;
            }
        };
        const swapByWrap = async (inputToken, inputAmount) => {
            try {
                swapInfo.canSwap = false;
                swapInfo.intputToken = inputToken;
                swapInfo.inputAmount = inputAmount;
                swapInfo.token0Amount = inputAmount;
                if (swapInfo.wrapType === 'wrap') {
                    if (token0.address === vo_1.ETH_ADDRESS)
                        swapInfo.token1Amount = inputAmount;
                    if (token0.address === (0, Constant_1.getCurrentAddressInfo)().USDY)
                        swapInfo.token1Amount = await this.baseApi.connectInfo().create(RUSDY_1.RUSDY).getRUSDYByShares(inputAmount);
                }
                if (swapInfo.wrapType === 'unwrap') {
                    if (token1.address === vo_1.ETH_ADDRESS)
                        swapInfo.token1Amount = inputAmount;
                    if (token1.address === (0, Constant_1.getCurrentAddressInfo)().USDY)
                        swapInfo.token1Amount = await this.baseApi.connectInfo().create(RUSDY_1.RUSDY).getRUSDYByShares(inputAmount);
                }
                swapInfo.canSwap = true;
            }
            catch (e) {
                tool_1.Trace.error(e);
                swapInfo.canSwap = false;
                swapInfo.intputToken = undefined;
                swapInfo.inputAmount = undefined;
            }
        };
        swapInfo.updateInput = async (inputToken, inputAmount, swapConfig) => {
            if (swapInfo.isWrapped) {
                if (inputToken.address === token0.address)
                    await swapByWrap(inputToken, inputAmount);
            }
            else {
                await swapByRoute(inputToken, inputAmount, swapConfig);
            }
        };
        swapInfo.swap = async (connectInfo, recipientAddr, deadline) => {
            if (!swapInfo.canSwap)
                return;
            if ((0, tool_1.isNullOrUndefined)(recipientAddr))
                recipientAddr = connectInfo.account;
            const slippageTolerance = new tool_1.Percent(BigInt(new bignumber_js_1.default(swapInfo.swapConfig.allowedSlippage).multipliedBy(10000).toFixed(0, bignumber_js_1.default.ROUND_DOWN)), 10000n);
            const transactionEvent = await connectInfo.create(SwapRouter_1.SwapRouter).swap([swapInfo.trade], slippageTolerance, recipientAddr, deadline, swapInfo.swapConfig.gasPriceWei);
            TransactionHistory_1.transactionHistory.saveHistory(connectInfo, transactionEvent, {
                token0,
                token1,
                token0Amount: swapInfo.token0Amount,
                token1Amount: swapInfo.token1Amount,
                type: 'swap',
                to: recipientAddr,
            });
            return transactionEvent;
        };
        swapInfo.wrap = async (connectInfo) => {
            let transactionEvent;
            if (swapInfo.wrapType === 'wrap') {
                if (token0.address === vo_1.ETH_ADDRESS)
                    transactionEvent = await connectInfo.create(WETH_1.WETH).deposit(new bignumber_js_1.default(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
                if (token0.address === (0, Constant_1.getCurrentAddressInfo)().USDY)
                    transactionEvent = await connectInfo.create(RUSDY_1.RUSDY).wrap(new bignumber_js_1.default(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
            }
            if (swapInfo.wrapType === 'unwrap') {
                if (token1.address === vo_1.ETH_ADDRESS)
                    transactionEvent = await connectInfo.create(WETH_1.WETH).withdraw(new bignumber_js_1.default(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
                if (token1.address === (0, Constant_1.getCurrentAddressInfo)().USDY)
                    transactionEvent = await connectInfo.create(RUSDY_1.RUSDY).unwrap(new bignumber_js_1.default(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
            }
            if (transactionEvent === undefined)
                throw new Error('wrap type error');
            TransactionHistory_1.transactionHistory.saveHistory(connectInfo, transactionEvent, {
                token0,
                token1,
                token0Amount: swapInfo.token0Amount,
                token1Amount: swapInfo.token1Amount,
                type: 'swap',
                to: undefined,
            });
            return transactionEvent;
        };
        swapInfo.update = async () => {
            await initBalance();
            await initTokenUsdPrice();
            if (swapInfo.canSwap)
                await swapInfo.updateInput(swapInfo.intputToken, swapInfo.inputAmount, swapInfo.swapConfig);
        };
        swapInfo.getTokenPrice = async (type) => {
            swapInfo.tokenPriceType = type;
            swapInfo.tokenPrice = undefined;
            if (swapInfo.isWrap)
                return;
            const getTimeConfig = (type) => {
                const endTime = Number.parseInt(String(new Date().getTime() / 1000));
                switch (type) {
                    case 'day':
                        return {
                            endTime,
                            interval: 60 * 60,
                            startTime: endTime - 24 * 60 * 60,
                        };
                    case 'week':
                        return {
                            endTime,
                            interval: 60 * 60 * 4,
                            startTime: endTime - 7 * 24 * 60 * 60,
                        };
                    case 'month':
                        return {
                            endTime,
                            interval: 60 * 60 * 24,
                            startTime: endTime - 30 * 24 * 60 * 60,
                        };
                    case 'year':
                        return {
                            endTime,
                            interval: 60 * 60 * 24,
                            startTime: endTime - 365 * 24 * 60 * 60,
                        };
                }
            };
            const timeConfig = getTimeConfig(type);
            const timestamps = [];
            let time = timeConfig.startTime;
            while (time <= timeConfig.endTime) {
                timestamps.push(time);
                time += timeConfig.interval;
            }
            const blocks = await this.baseApi.address().getApi().dashboard().getBlocksFromTimestamps(timestamps, 'exchange-v3');
            const [token0Prices, token1Prices,] = await Promise.all([
                this.baseApi.exchangeGraph((0, SwapV3Gql_1.GetDerivedPricesGQL)(token0.erc20Address().toLowerCase(), blocks), {}),
                this.baseApi.exchangeGraph((0, SwapV3Gql_1.GetDerivedPricesGQL)(token1.erc20Address().toLowerCase(), blocks), {}),
            ]);
            const token0PriceData = [];
            const token1PriceData = [];
            timestamps.forEach((it) => {
                const price0 = token0Prices[`t${it}`]?.derivedUSD;
                const price1 = token1Prices[`t${it}`]?.derivedUSD;
                if (price0 && price1) {
                    token0PriceData.push({
                        price: price0 === '0' ? '0' : new bignumber_js_1.default(price1).div(price0).toFixed(),
                        time: it,
                    });
                    token1PriceData.push({
                        price: price1 === '0' ? '0' : new bignumber_js_1.default(price0).div(price1).toFixed(),
                        time: it,
                    });
                }
            });
            swapInfo.tokenPrice = {
                token0: {
                    datas: token0PriceData,
                    lastPrice: token0PriceData[token0PriceData.length - 1]?.price || '0',
                },
                token1: {
                    datas: token1PriceData,
                    lastPrice: token1PriceData[token1PriceData.length - 1]?.price || '0',
                },
            };
        };
        return swapInfo;
    }
    async getBestTrade(token0, token1, amount, inputToken, swapConfig) {
        const getPoolProvider = () => {
            return {
                getCandidatePools: async (tokenA, tokenB) => this.getCandidatePoolsByToken(tokenA, tokenB),
            };
        };
        const quoteProvider = () => {
            const gasMultiCallContract = this.baseApi.connectInfo().create(abi_1.GasMultiCallContract);
            const quoterV2 = this.baseApi.connectInfo().create(abi_1.IQuoterV2Abi);
            const getRouteWithQuotes = async (routes, gasModel, isExactIn) => {
                const funcName = isExactIn ? 'quoteExactInput' : 'quoteExactOutput';
                const callInputs = routes.map((route) => {
                    const path = (0, SwapV3Math_1.encodeMixedRouteToPath)(route, !isExactIn);
                    return {
                        target: this.baseApi.address().quoterV2,
                        callData: quoterV2.contract.interface.encodeFunctionData(funcName, [path, route.amount.quotient.toString()]),
                        gasLimit: mulcall_1.QUOTER_TRADE_GAS,
                    };
                });
                const gasCallResponses = await gasMultiCallContract.multicall(callInputs);
                const routesWithQuote = [];
                for (let i = 0; i < gasCallResponses.length; i++) {
                    const gasCallResponse = gasCallResponses[i];
                    const route = routes[i];
                    if (!gasCallResponse.success) {
                        // const amountStr = amount.toFixed(Math.min(amount.currency.decimals, 2))
                        // const routeStr = routeToString(route)
                        // debugFailedQuotes.push({
                        //   route: routeStr,
                        //   percent,
                        //   amount: amountStr,
                        // })
                        continue;
                    }
                    const quoteResult = mulcall_1.Abi.decode(['uint256', 'uint160[]', 'uint32[]', 'uint256'], gasCallResponse.returnData);
                    const quoteCurrency = (0, route_1.getQuoteCurrency)(route, route.amount.currency);
                    const quote = tool_1.CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, quoteResult[0].toString());
                    const { gasEstimate, gasCostInToken, gasCostInUSD } = gasModel.estimateGasCost(route.pools, quoteResult[2]);
                    const adjustQuoteForGas = (quote, gasCostInToken) => isExactIn ? quote.subtract(gasCostInToken) : quote.add(gasCostInToken);
                    routesWithQuote.push({
                        ...route,
                        quote,
                        quoteAdjustedForGas: adjustQuoteForGas(quote, gasCostInToken),
                        // sqrtPriceX96AfterList: quoteResult.result[1],
                        gasEstimate,
                        gasCostInToken,
                        gasCostInUSD,
                    });
                }
                // gasCallResponses.forEach((it) => {
                //   if (it.success) {
                //     // (
                //     //             uint256 amountOut,
                //     //             uint160[] memory sqrtPriceX96AfterList,
                //     //             uint32[] memory initializedTicksCrossedList,
                //     //             uint256 gasEstimate
                //     //         )
                //
                //     // console.log(result)
                //   }
                // })
                return routesWithQuote;
            };
            return {
                getRouteWithQuotesExactIn: async (routes, options) => getRouteWithQuotes(routes, options.gasModel, true),
                getRouteWithQuotesExactOut: async (routes, options) => getRouteWithQuotes(routes, options.gasModel, false),
            };
        };
        const baseAmount = tool_1.CurrencyAmount.fromRawAmount(inputToken, BigInt(new bignumber_js_1.default(amount).multipliedBy(10 ** inputToken.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
        let tradeType = tool_1.TradeType.EXACT_INPUT;
        let token = token1;
        if (token1.equals(inputToken)) {
            tradeType = tool_1.TradeType.EXACT_OUTPUT;
            token = token0;
        }
        const routerTrade = await (0, getBestTrade_1.getBestTrade)(baseAmount, token, tradeType, {
            gasPriceWei: swapConfig.gasPriceWei,
            maxSplits: swapConfig.allowSplitRouting ? undefined : 0,
            maxHops: swapConfig.allowMultiHops ? undefined : 1,
            poolProvider: getPoolProvider(),
            quoteProvider: quoteProvider(),
        });
        if (routerTrade === null)
            throw new Error('Cannot find a valid swap route');
        return routerTrade;
    }
};
exports.SwapV3Api = SwapV3Api;
exports.SwapV3Api = SwapV3Api = __decorate([
    (0, tool_1.CacheKey)('SwapV3Api'),
    __metadata("design:paramtypes", [])
], SwapV3Api);
