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
var PoolV3Api_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolV3Api = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const vo_1 = require("../vo");
const ethers_1 = require("ethers");
const abi_1 = require("../abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const Constant_1 = require("../../Constant");
const utils_1 = require("../tool/sdk/v3/utils");
const v3_1 = require("../tool/sdk/v3");
const Common_1 = require("../tool/math/Common");
const gql_1 = require("./gql");
const BasicException_1 = require("../../BasicException");
let PoolV3Api = PoolV3Api_1 = class PoolV3Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    async myLiquidityList(connectInfo) {
        let nonfungiblePositionManager = connectInfo.create(abi_1.NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
        let account = connectInfo.account;
        let [{ balanceOf }] = await connectInfo.multiCall().call({
            balanceOf: nonfungiblePositionManager.mulContract.balanceOf(account),
        });
        if (balanceOf === '0') {
            return {
                hideClosePosition: [],
                allPosition: []
            };
        }
        let tokenIds = await connectInfo.multiCall().call(...Array.from(new Array(parseInt(balanceOf, 10)).keys())
            .map(it => {
            return {
                index: Number(it).toString(),
                tokenId: nonfungiblePositionManager.mulContract.tokenOfOwnerByIndex(account, it)
            };
        }));
        let positions = await connectInfo.multiCall().call(...tokenIds.map(it => {
            return {
                tokenId: it.tokenId,
                position: nonfungiblePositionManager.mulContract.positions(it.tokenId)
            };
        }));
        let batchGetTokens = await this.baseApi.address().getApi().tokenMangerApi().batchGetTokens(Array.from(new Set(positions.map(it => [it.position.token0, it.position.token1, vo_1.ETH_ADDRESS]).flatMap(it => it))));
        const allPosition = positions.map(it => {
            let token0 = batchGetTokens[it.position.token0.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? vo_1.ETH_ADDRESS : it.position.token0];
            let token1 = batchGetTokens[it.position.token1.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? vo_1.ETH_ADDRESS : it.position.token1];
            let liquidityDetails = new vo_1.LiquidityListData();
            liquidityDetails.tokenId = it.tokenId;
            liquidityDetails.token0 = token0;
            liquidityDetails.token1 = token1;
            liquidityDetails.feeAmount = parseInt(it.position.fee);
            liquidityDetails.minPrice = (0, Common_1.tickToPriceString)(token0, token1, liquidityDetails.feeAmount, parseInt(it.position.tickLower));
            liquidityDetails.maxPrice = (0, Common_1.tickToPriceString)(token0, token1, liquidityDetails.feeAmount, parseInt(it.position.tickUpper));
            liquidityDetails.reverseMinPrice = (0, Common_1.tickToPriceString)(token1, token0, liquidityDetails.feeAmount, parseInt(it.position.tickUpper));
            liquidityDetails.reverseMaxPrice = (0, Common_1.tickToPriceString)(token1, token0, liquidityDetails.feeAmount, parseInt(it.position.tickLower));
            liquidityDetails.state = new bignumber_js_1.default(it.position.liquidity).comparedTo("0") > 0 ? 'active' : 'close';
            return liquidityDetails;
        }).sort((a, b) => {
            if (a.state === 'active' && b.state === 'close') {
                return -1;
            }
            if (a.state === 'close' && b.state === 'active') {
                return 1;
            }
            return parseInt(b.tokenId) - parseInt(a.tokenId);
        });
        return {
            allPosition,
            hideClosePosition: allPosition.filter(it => it.state === 'close')
        };
    }
    async positionHistoryByTokenId(tokenId) {
        let { positionSnapshots } = (await this.baseApi.exchangeGraph(gql_1.PositionHistoryGQL, { tokenId }));
        return positionSnapshots
            .flatMap(it => it.transaction)
            .flatMap(it => {
            let mapToLiquidityHistory = (it, type) => {
                return {
                    time: parseInt(it.timestamp) * 1000,
                    action: 'add',
                    token0Amount: it.amount0,
                    token1Amount: it.amount1,
                };
            };
            return [
                ...it.mints.map(it => mapToLiquidityHistory(it, 'add')),
                ...it.burns.map(it => mapToLiquidityHistory(it, 'remove')),
                ...it.collects.map(it => mapToLiquidityHistory(it, 'collect_fee'))
            ];
        })
            .sort((a, b) => {
            return new bignumber_js_1.default(b.time).comparedTo(a.time);
        });
    }
    async myLiquidityByTokenId(connectInfo, tokenId) {
        let nonfungiblePositionManager = connectInfo.create(abi_1.NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
        let account = connectInfo.account;
        let [{ position, }] = await this.baseApi.connectInfo().multiCall().call({
            position: nonfungiblePositionManager.mulContract.positions(tokenId)
        });
        if (position.fee === '0') {
            throw new Error("token id not found");
        }
        let batchGetTokens = await this.baseApi.address().getApi().tokenMangerApi().batchGetTokens(Array.from(new Set([position.token0, position.token1, vo_1.ETH_ADDRESS])));
        let token0 = batchGetTokens[position.token0.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? vo_1.ETH_ADDRESS : position.token0];
        let token1 = batchGetTokens[position.token1.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? vo_1.ETH_ADDRESS : position.token1];
        let feeAmount = parseInt(position.fee);
        let [[token0Price, token1Price], [pool], collect, liquidityHistory, balanceAndAllowances] = await Promise.all([
            this.baseApi.address().getApi().tokenMangerApi().tokenPrice(token0, token1),
            this.getPool([{ token0, token1, feeAmount }]),
            this.collectFeeData(tokenId, account),
            this.positionHistoryByTokenId(tokenId),
            this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(account, this.baseApi.address().nonfungiblePositionManager, [token0, token1])
        ]);
        let positionDetail = new v3_1.Position({
            pool,
            liquidity: position.liquidity,
            tickLower: parseInt(position.tickLower),
            tickUpper: parseInt(position.tickUpper)
        });
        let liquidityInfo = new vo_1.LiquidityInfo();
        liquidityInfo.token0Balance = balanceAndAllowances[token0.address];
        liquidityInfo.token1Balance = balanceAndAllowances[token1.address];
        liquidityInfo.tokenId = tokenId;
        liquidityInfo.token0 = token0;
        liquidityInfo.token1 = token1;
        liquidityInfo.token0Price = token0Price;
        liquidityInfo.token1Price = token1Price;
        liquidityInfo.feeAmount = feeAmount;
        liquidityInfo.collectToken0 = new bignumber_js_1.default(collect.amount0).div(10 ** token0.decimals).toFixed(token0.decimals, bignumber_js_1.default.ROUND_DOWN);
        liquidityInfo.collectToken1 = new bignumber_js_1.default(collect.amount1).div(10 ** token1.decimals).toFixed(token1.decimals, bignumber_js_1.default.ROUND_DOWN);
        liquidityInfo.token0Amount = positionDetail.amount0.toFixed();
        liquidityInfo.token1Amount = positionDetail.amount1.toFixed();
        liquidityInfo.liquidity = positionDetail.liquidity.toString();
        liquidityInfo.currentPrice = pool.priceOf(token0).toFixed();
        liquidityInfo.reverseCurrentPrice = pool.priceOf(token1).toFixed();
        liquidityInfo.minPrice = (0, Common_1.tickToPriceString)(token0, token1, liquidityInfo.feeAmount, parseInt(position.tickLower));
        liquidityInfo.maxPrice = (0, Common_1.tickToPriceString)(token0, token1, liquidityInfo.feeAmount, parseInt(position.tickUpper));
        liquidityInfo.reverseMinPrice = (0, Common_1.tickToPriceString)(token1, token0, liquidityInfo.feeAmount, parseInt(position.tickUpper));
        liquidityInfo.reverseMaxPrice = (0, Common_1.tickToPriceString)(token1, token0, liquidityInfo.feeAmount, parseInt(position.tickLower));
        liquidityInfo.state = new bignumber_js_1.default(position.liquidity).comparedTo("0") > 0 ? 'active' : 'close';
        liquidityInfo.histories = liquidityHistory;
        liquidityInfo.collectFee = async (connect, involvesMNT) => {
            return await connect.create(abi_1.NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager)
                .collect(tokenId, token0, token1, collect.amount0, collect.amount1, involvesMNT);
        };
        liquidityInfo.preRemoveLiquidity = (rate) => {
            if (new bignumber_js_1.default(rate).comparedTo("0") <= 0 || new bignumber_js_1.default(rate).comparedTo("1") > 0) {
                throw new BasicException_1.BasicException("rate is zero");
            }
            let positionDetail = new v3_1.Position({
                pool,
                liquidity: new bignumber_js_1.default(position.liquidity).multipliedBy(rate).toFixed(0, bignumber_js_1.default.ROUND_DOWN),
                tickLower: parseInt(position.tickLower),
                tickUpper: parseInt(position.tickUpper)
            });
            let amount0 = positionDetail.amount0.toFixed();
            let amount1 = positionDetail.amount1.toFixed();
            return {
                amount0, amount1
            };
        };
        liquidityInfo.removeLiquidity = async (connect, rate, involvesMNT, allowedSlippage, deadline) => {
            if (new bignumber_js_1.default(rate).comparedTo("0") <= 0 || new bignumber_js_1.default(rate).comparedTo("1") > 0) {
                throw new BasicException_1.BasicException("rate is zero");
            }
            let positionDetail = new v3_1.Position({
                pool,
                liquidity: new bignumber_js_1.default(position.liquidity).multipliedBy(rate).toFixed(0, bignumber_js_1.default.ROUND_DOWN),
                tickLower: parseInt(position.tickLower),
                tickUpper: parseInt(position.tickUpper)
            });
            return await connect.create(abi_1.NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager)
                .removeLiquidity(rate, token0, token1, positionDetail, tokenId, collect.amount0, collect.amount1, involvesMNT, new tool_1.Percent(BigInt(new bignumber_js_1.default(allowedSlippage).multipliedBy(10000).toFixed(0, bignumber_js_1.default.ROUND_DOWN)), 10000n), parseInt(String(new Date().getTime() / 1000)) + parseInt(deadline.toString()));
        };
        liquidityInfo.preAddLiquidity = (inputToken, inputAmount) => {
            if (!(0, tool_1.isNumber)(inputAmount)) {
                throw new BasicException_1.BasicException("Amount Incorrect");
            }
            let outAmount = this.outputTokenAmount(pool, inputToken, inputAmount, position.tickLower, position.tickUpper);
            if (token0.equals(inputToken)) {
                return {
                    amount0: inputAmount,
                    amount1: outAmount
                };
            }
            else {
                return {
                    amount0: outAmount,
                    amount1: inputAmount
                };
            }
        };
        liquidityInfo.addLiquidity = async (connect, amount0, amount1, allowedSlippage, deadline) => {
            if (!(0, tool_1.isNumber)(amount0) || !(0, tool_1.isNumber)(amount1)) {
                throw new BasicException_1.BasicException("Amount Incorrect");
            }
            let nextPosition = v3_1.Position.fromAmounts({
                pool: pool,
                tickLower: position.tickLower,
                tickUpper: position.tickUpper,
                amount0,
                amount1,
                useFullPrecision: true, // we want full precision for the theoretical position
            });
            let slippageTolerance = new tool_1.Percent(BigInt(new bignumber_js_1.default(allowedSlippage).multipliedBy(10000).toFixed(0, bignumber_js_1.default.ROUND_DOWN)), 10000n);
            let deadlineReal = parseInt(String(new Date().getTime() / 1000)) + parseInt(deadline.toString());
            return await connect.create(abi_1.NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager)
                .addLiquidity(nextPosition, tokenId, false, slippageTolerance, deadlineReal);
        };
        return liquidityInfo;
    }
    async collectFeeData(tokenId, account) {
        let nonfungiblePositionManager = this.baseApi.connectInfo().create(abi_1.NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
        const MAX_UINT128 = 2n ** 128n - 1n;
        let collect = { amount0: "0", amount1: "0" };
        try {
            let collectResult = await nonfungiblePositionManager.contract.collect.staticCall({
                tokenId,
                recipient: account,
                amount0Max: MAX_UINT128,
                amount1Max: MAX_UINT128,
            }, { from: account });
            collect.amount0 = collectResult.amount0;
            collect.amount1 = collectResult.amount1;
        }
        catch (e) {
            tool_1.Trace.error("ignore collect error", e);
        }
        return collect;
    }
    async feeTierDistribution(token0, token1) {
        let result = await this.baseApi.exchangeGraph(gql_1.FeeTierDistributionGQL, {
            token0: token0.erc20Address().toLowerCase(),
            token1: token1.erc20Address().toLowerCase(),
        });
        const { asToken0, asToken1, _meta } = result;
        const all = asToken0.concat(asToken1);
        // sum tvl for token0 and token1 by fee tier
        const tvlByFeeTier = all.reduce((acc, value) => {
            // We can safely remove the `[value.feeTier]?.` after we update ethereum fee tier
            // eslint-disable-next-line no-param-reassign
            acc[value.feeTier][0] = (acc[value.feeTier]?.[0] ?? 0) + Number(value.totalValueLockedToken0);
            // eslint-disable-next-line no-param-reassign
            acc[value.feeTier][1] = (acc[value.feeTier]?.[1] ?? 0) + Number(value.totalValueLockedToken1);
            return acc;
        }, {
            [vo_1.FeeAmount.LOWEST]: [undefined, undefined],
            [vo_1.FeeAmount.LOW]: [undefined, undefined],
            [vo_1.FeeAmount.MEDIUM]: [undefined, undefined],
            [vo_1.FeeAmount.HIGH]: [undefined, undefined],
        });
        // sum total tvl for token0 and token1
        let reduce = Object.values(tvlByFeeTier).reduce((acc, value) => {
            const result = acc;
            result[0] += (value[0] || 0);
            result[1] += (value[1] || 0);
            return result;
        }, [0, 0]);
        const [sumToken0Tvl, sumToken1Tvl] = reduce;
        // returns undefined if both tvl0 and tvl1 are undefined (pool not created)
        const mean = (tvl0, sumTvl0, tvl1, sumTvl1) => tvl0 === undefined && tvl1 === undefined ? undefined : ((tvl0 ?? 0) + (tvl1 ?? 0)) / (sumTvl0 + sumTvl1) || 0;
        const distributions = {
            [vo_1.FeeAmount.LOWEST]: mean(tvlByFeeTier[vo_1.FeeAmount.LOWEST][0], sumToken0Tvl, tvlByFeeTier[vo_1.FeeAmount.LOWEST][1], sumToken1Tvl),
            [vo_1.FeeAmount.LOW]: mean(tvlByFeeTier[vo_1.FeeAmount.LOW][0], sumToken0Tvl, tvlByFeeTier[vo_1.FeeAmount.LOW][1], sumToken1Tvl),
            [vo_1.FeeAmount.MEDIUM]: mean(tvlByFeeTier[vo_1.FeeAmount.MEDIUM][0], sumToken0Tvl, tvlByFeeTier[vo_1.FeeAmount.MEDIUM][1], sumToken1Tvl),
            [vo_1.FeeAmount.HIGH]: mean(tvlByFeeTier[vo_1.FeeAmount.HIGH][0], sumToken0Tvl, tvlByFeeTier[vo_1.FeeAmount.HIGH][1], sumToken1Tvl),
        };
        return distributions;
    }
    async allTickInfo(token0, token1, feeAmount) {
        let pools = await this.getPool([{ token0, token1, feeAmount }]);
        let poolAddress = PoolV3Api_1.computePoolAddress(token0, token1, feeAmount);
        let pool = pools[0];
        let tickDatas = [];
        let lastTick = utils_1.TickMath.MIN_TICK - 1;
        while (true) {
            let { ticks } = await this.baseApi.exchangeGraph(gql_1.AllV3TicksGQL, {
                poolAddress: poolAddress.toLowerCase(),
                lastTick: Number(lastTick),
                pageSize: 1000,
            });
            if (ticks.length === 0) {
                break;
            }
            lastTick = ticks[ticks.length - 1].tick;
            tickDatas.push(...ticks);
        }
        const activeTick = Math.floor(pool.tickCurrent / vo_1.TICK_SPACINGS[feeAmount]) * vo_1.TICK_SPACINGS[feeAmount];
        const pivot = tickDatas.findIndex(({ tick }) => Number(tick) > activeTick) - 1;
        if (pivot < 0) {
            // consider setting a local error
            tool_1.Trace.error('TickData pivot not found');
            return {
                tickDatas,
                ticksProcessed: []
            };
        }
        const activeTickProcessed = {
            liquidityActive: pool.liquidity,
            tick: activeTick,
            liquidityNet: Number(tickDatas[pivot].tick) === activeTick ? BigInt(tickDatas[pivot].liquidityNet) : 0n,
            price0: (0, utils_1.tickToPrice)(token0, token1, activeTick).toFixed(),
        };
        const subsequentTicks = (0, Common_1.computeSurroundingTicks)(token0, token1, activeTickProcessed, tickDatas, pivot, true);
        const previousTicks = (0, Common_1.computeSurroundingTicks)(token0, token1, activeTickProcessed, tickDatas, pivot, false);
        const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks);
        return {
            tickDatas,
            ticksProcessed
        };
    }
    static computePoolAddress(tokenA, tokenB, fee) {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
        const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
        const poolInitCodeHash = currentAddressInfo.initCodeHash;
        const agniPoolDeployer = currentAddressInfo.agniPoolDeployer;
        const encodedParams = ethers_1.AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint24'], [token0.erc20Address(), token1.erc20Address(), fee]);
        const salt = (0, ethers_1.solidityPackedKeccak256)(['bytes'], [encodedParams]);
        return (0, ethers_1.getCreate2Address)(agniPoolDeployer, salt, poolInitCodeHash);
    }
    async getPool(datas) {
        let connectInfo = this.baseApi.connectInfo();
        let poolDatas = await connectInfo.multiCall().call(...datas.map(data => {
            let address = PoolV3Api_1.computePoolAddress(data.token0, data.token1, data.feeAmount);
            let poolV3 = connectInfo.create(abi_1.PoolV3, address);
            return {
                address: address,
                slot0: poolV3.mulContract.slot0(),
                liquidity: poolV3.mulContract.liquidity(),
            };
        }));
        return poolDatas.map((poolData, index) => {
            let { slot0, liquidity, address } = poolData;
            if (!slot0 || !liquidity) {
                return null;
            }
            const { sqrtPriceX96, tick, feeProtocol } = slot0;
            if (!sqrtPriceX96 || sqrtPriceX96 === '0')
                return null;
            return new v3_1.Pool(datas[index].token0, datas[index].token1, datas[index].feeAmount, sqrtPriceX96, liquidity, tick);
        });
    }
    parsePrice(token0, token1, inputFirstPrice) {
        let baseAmount = tool_1.CurrencyAmount.fromRawAmount(token0, BigInt(new bignumber_js_1.default("1").multipliedBy(10 ** token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
        let parsedQuoteAmount = tool_1.CurrencyAmount.fromRawAmount(token1, BigInt(new bignumber_js_1.default(inputFirstPrice).multipliedBy(10 ** token1.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
        return new tool_1.Price(baseAmount.currency, parsedQuoteAmount.currency, baseAmount.quotient, parsedQuoteAmount.quotient);
    }
    // 获取输出币种金额
    outputTokenAmount(pool, inputToken, inputAmount, tickLower, tickUpper) {
        let independentAmount = tool_1.CurrencyAmount.fromRawAmount(inputToken, BigInt(new bignumber_js_1.default(inputAmount).multipliedBy(10 ** inputToken.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
        const wrappedIndependentAmount = independentAmount?.wrapped;
        const dependentCurrency = inputToken.equals(pool.token0) ? pool.token1 : pool.token0;
        if (independentAmount &&
            wrappedIndependentAmount &&
            typeof tickLower === 'number' &&
            typeof tickUpper === 'number' &&
            pool) {
            const position = wrappedIndependentAmount.currency.equals(pool.token0)
                ? v3_1.Position.fromAmount0({
                    pool,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    amount0: independentAmount.quotient,
                    useFullPrecision: true, // we want full precision for the theoretical position
                })
                : v3_1.Position.fromAmount1({
                    pool,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    amount1: independentAmount.quotient,
                });
            const dependentTokenAmount = wrappedIndependentAmount.currency.equals(pool.token0)
                ? position.amount1
                : position.amount0;
            return dependentCurrency && tool_1.CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient).toFixed();
        }
        return '';
    }
    // useV3DerivedInfo
    async addLiquidity(token0, token1, account) {
        let addLiquidityV3Info = new vo_1.AddLiquidityV3Info();
        addLiquidityV3Info.token0 = token0;
        addLiquidityV3Info.token1 = token1;
        addLiquidityV3Info.feeAmount = vo_1.FeeAmount.MEDIUM;
        addLiquidityV3Info.token0Amount = "";
        addLiquidityV3Info.token1Amount = "";
        addLiquidityV3Info.firstPrice = "";
        addLiquidityV3Info.first = false;
        addLiquidityV3Info.token0Balance = vo_1.BalanceAndAllowance.unavailable(token0);
        addLiquidityV3Info.token1Balance = vo_1.BalanceAndAllowance.unavailable(token1);
        let feeAmounts = [
            vo_1.FeeAmount.LOWEST,
            vo_1.FeeAmount.LOW,
            vo_1.FeeAmount.MEDIUM,
            vo_1.FeeAmount.HIGH,
        ];
        if (account) {
            let balanceAndAllowances = await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(account, this.baseApi.address().nonfungiblePositionManager, [token0, token1]);
            addLiquidityV3Info.token0Balance = balanceAndAllowances[token0.address];
            addLiquidityV3Info.token1Balance = balanceAndAllowances[token1.address];
        }
        let [poolDatas, [token0Price, token1Price], feeTierDistribution] = await Promise.all([
            this.getPool(feeAmounts.map((feeAmount) => {
                return {
                    token0, token1, feeAmount
                };
            })),
            this.baseApi.address().getApi().tokenMangerApi().tokenPrice(token0, token1),
            this.feeTierDistribution(token0, token1),
        ]);
        addLiquidityV3Info.token0Price = token0Price;
        addLiquidityV3Info.token1Price = token1Price;
        addLiquidityV3Info.poolState = feeAmounts.map((feeAmount, index) => {
            return {
                feeAmount,
                pick: feeTierDistribution[feeAmount] || 0,
                state: poolDatas[index] ? 'create' : 'no create'
            };
        });
        addLiquidityV3Info.checkFirstPrice = (inputFirstPrice) => {
            if (!addLiquidityV3Info.first || !(0, tool_1.isNumber)(inputFirstPrice)) {
                return false;
            }
            let price = this.parsePrice(token0, token1, inputFirstPrice);
            tool_1.Trace.print("price", price.toFixed(), price.invert().toFixed());
            let sqrtRatioX96 = (0, utils_1.encodeSqrtRatioX96)(price.numerator, price.denominator);
            return price && sqrtRatioX96 && (BigInt(sqrtRatioX96) >= utils_1.TickMath.MIN_SQRT_RATIO && BigInt(sqrtRatioX96) < utils_1.TickMath.MAX_SQRT_RATIO);
        };
        addLiquidityV3Info.updateFirstPrice = async (inputFirstPrice) => {
            if (addLiquidityV3Info.first) {
                if (addLiquidityV3Info.checkFirstPrice(inputFirstPrice)) {
                    addLiquidityV3Info.firstPrice = new bignumber_js_1.default(inputFirstPrice).toFixed(token0.decimals, bignumber_js_1.default.ROUND_DOWN);
                    const currentTick = (0, utils_1.priceToClosestTick)(this.parsePrice(token0, token1, inputFirstPrice));
                    const currentSqrt = utils_1.TickMath.getSqrtRatioAtTick(currentTick);
                    addLiquidityV3Info.pool = new v3_1.Pool(addLiquidityV3Info.token0, addLiquidityV3Info.token1, addLiquidityV3Info.feeAmount, currentSqrt, 0n, currentTick, []);
                }
            }
        };
        addLiquidityV3Info.updateToken0 = (amount) => {
            let tokenAmount = this.outputTokenAmount(addLiquidityV3Info.pool, token0, amount, addLiquidityV3Info.tickLower, addLiquidityV3Info.tickUpper);
            addLiquidityV3Info.token0Amount = amount;
            addLiquidityV3Info.token1Amount = tokenAmount;
            return tokenAmount;
        };
        addLiquidityV3Info.updateToken1 = (amount) => {
            let tokenAmount = this.outputTokenAmount(addLiquidityV3Info.pool, token1, amount, addLiquidityV3Info.tickLower, addLiquidityV3Info.tickUpper);
            addLiquidityV3Info.token1Amount = amount;
            addLiquidityV3Info.token0Amount = tokenAmount;
            return tokenAmount;
        };
        addLiquidityV3Info.updateFeeAmount = (feeAmount) => {
            reset();
            addLiquidityV3Info.feeAmount = feeAmount;
            let pool = poolDatas[feeAmounts.indexOf(feeAmount)];
            if (!pool) {
                addLiquidityV3Info.first = true;
            }
            else {
                addLiquidityV3Info.first = false;
                addLiquidityV3Info.firstPrice = pool.priceOf(addLiquidityV3Info.token0).toFixed();
                addLiquidityV3Info.pool = pool;
            }
        };
        let reset = () => {
            addLiquidityV3Info.token0Amount = '';
            addLiquidityV3Info.token1Amount = '';
            addLiquidityV3Info.tickLower = null;
            addLiquidityV3Info.tickUpper = null;
            addLiquidityV3Info.firstPrice = null;
            addLiquidityV3Info.minPrice = null;
            addLiquidityV3Info.maxPrice = null;
            addLiquidityV3Info.rate = null;
            addLiquidityV3Info.tickData = null;
        };
        let updateToken = () => {
            if ((0, tool_1.isNumber)(addLiquidityV3Info.token0Amount) && new bignumber_js_1.default(addLiquidityV3Info.token0Amount).comparedTo("0") > 0) {
                addLiquidityV3Info.updateToken0(addLiquidityV3Info.token0Amount);
                return;
            }
            if ((0, tool_1.isNumber)(addLiquidityV3Info.token1Amount) && new bignumber_js_1.default(addLiquidityV3Info.token1Amount).comparedTo("0") > 0) {
                addLiquidityV3Info.updateToken1(addLiquidityV3Info.token1Amount);
                return;
            }
        };
        addLiquidityV3Info.setPriceRange = (leftRangeTypedValue, rightRangeTypedValue) => {
            let [tokenA, tokenB] = token0.sortsBefore(token1)
                ? [token0, token1]
                : [token1, token0];
            const invertPrice = Boolean(!tokenA.equals(token0));
            let lower = (invertPrice && typeof rightRangeTypedValue === 'boolean') ||
                (!invertPrice && typeof leftRangeTypedValue === 'boolean')
                ? (0, utils_1.nearestUsableTick)(utils_1.TickMath.MIN_TICK, vo_1.TICK_SPACINGS[addLiquidityV3Info.feeAmount])
                : invertPrice
                    ? (0, Common_1.tryParseTick)(tokenB, tokenA, addLiquidityV3Info.feeAmount, rightRangeTypedValue.toString())
                    : (0, Common_1.tryParseTick)(tokenA, tokenB, addLiquidityV3Info.feeAmount, leftRangeTypedValue.toString());
            let upper = (!invertPrice && typeof rightRangeTypedValue === 'boolean') ||
                (invertPrice && typeof leftRangeTypedValue === 'boolean')
                ? (0, utils_1.nearestUsableTick)(utils_1.TickMath.MAX_TICK, vo_1.TICK_SPACINGS[addLiquidityV3Info.feeAmount])
                : invertPrice
                    ? (0, Common_1.tryParseTick)(tokenB, tokenA, addLiquidityV3Info.feeAmount, leftRangeTypedValue.toString())
                    : (0, Common_1.tryParseTick)(tokenA, tokenB, addLiquidityV3Info.feeAmount, rightRangeTypedValue.toString());
            addLiquidityV3Info.tickLower = lower;
            addLiquidityV3Info.tickUpper = upper;
            addLiquidityV3Info.minPrice = (0, Common_1.tickToPriceString)(token0, token1, addLiquidityV3Info.feeAmount, invertPrice ? upper : lower);
            addLiquidityV3Info.maxPrice = (0, Common_1.tickToPriceString)(token0, token1, addLiquidityV3Info.feeAmount, invertPrice ? lower : upper);
            if (new bignumber_js_1.default(addLiquidityV3Info.minPrice).comparedTo(addLiquidityV3Info.firstPrice) > 0) {
                addLiquidityV3Info.token1Amount = "0";
            }
            if (addLiquidityV3Info.maxPrice !== '∞' && new bignumber_js_1.default(addLiquidityV3Info.maxPrice).comparedTo(addLiquidityV3Info.firstPrice) < 0) {
                addLiquidityV3Info.token0Amount = "0";
            }
            updateToken();
            return {
                minPrice: addLiquidityV3Info.minPrice,
                maxPrice: addLiquidityV3Info.maxPrice,
            };
        };
        addLiquidityV3Info.setRate = (rate) => {
            if (addLiquidityV3Info.firstPrice) {
                let minPrice = true;
                let maxPrice = true;
                if (rate !== "full") {
                    minPrice = new bignumber_js_1.default(addLiquidityV3Info.firstPrice).multipliedBy((1 - Number(rate) / 100)).toFixed();
                    maxPrice = new bignumber_js_1.default(addLiquidityV3Info.firstPrice).multipliedBy((1 + Number(rate) / 100)).toFixed();
                }
                let priceRange = addLiquidityV3Info.setPriceRange(minPrice, maxPrice);
                addLiquidityV3Info.rate = rate;
                return priceRange;
            }
            else {
                return {
                    minPrice: addLiquidityV3Info.minPrice,
                    maxPrice: addLiquidityV3Info.maxPrice,
                };
            }
        };
        addLiquidityV3Info.addLiquidity = async (connect, allowedSlippage, deadline) => {
            let nonfungiblePositionManager = connect.create(abi_1.NonfungiblePositionManager);
            if (!addLiquidityV3Info.pool ||
                !addLiquidityV3Info.token0Amount ||
                !addLiquidityV3Info.token1Amount ||
                typeof addLiquidityV3Info.tickLower !== 'number' ||
                typeof addLiquidityV3Info.tickUpper !== 'number' ||
                addLiquidityV3Info.tickLower >= addLiquidityV3Info.tickUpper) {
                throw new Error('invalid input');
            }
            // mark as 0 if disabled because out of range
            let realToken0Amount = new bignumber_js_1.default(addLiquidityV3Info.token0Amount).multipliedBy(10 ** addLiquidityV3Info.token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            let realToken1Amount = new bignumber_js_1.default(addLiquidityV3Info.token1Amount).multipliedBy(10 ** addLiquidityV3Info.token1.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const amount0 = addLiquidityV3Info.pool.tickCurrent <= addLiquidityV3Info.tickUpper
                ? addLiquidityV3Info.pool.token0.equals(addLiquidityV3Info.token0) ? realToken0Amount : realToken1Amount
                : 0n;
            const amount1 = addLiquidityV3Info.pool.tickCurrent >= addLiquidityV3Info.tickLower
                ? addLiquidityV3Info.pool.token0.equals(addLiquidityV3Info.token0) ? realToken1Amount : realToken0Amount
                : 0n;
            let position = v3_1.Position.fromAmounts({
                pool: addLiquidityV3Info.pool,
                tickLower: addLiquidityV3Info.tickLower,
                tickUpper: addLiquidityV3Info.tickUpper,
                amount0,
                amount1,
                useFullPrecision: true,
            });
            let slippageTolerance = new tool_1.Percent(BigInt(new bignumber_js_1.default(allowedSlippage).multipliedBy(10000).toFixed(0, bignumber_js_1.default.ROUND_DOWN)), 10000n);
            let deadlineReal = parseInt(String(new Date().getTime() / 1000)) + parseInt(deadline.toString());
            return nonfungiblePositionManager.addLiquidity(position, null, addLiquidityV3Info.first, slippageTolerance, deadlineReal);
        };
        addLiquidityV3Info.updateAllTickInfo = async () => {
            if (addLiquidityV3Info.tickData) {
                return addLiquidityV3Info.tickData;
            }
            // 防止异步更新的问题
            while (true) {
                let feeAmount = addLiquidityV3Info.feeAmount;
                let result = await this.allTickInfo(token0, token1, feeAmount);
                if (feeAmount === addLiquidityV3Info.feeAmount) {
                    addLiquidityV3Info.tickData = result;
                    return result;
                }
            }
        };
        // 初始化
        addLiquidityV3Info.updateFeeAmount(addLiquidityV3Info.feeAmount);
        if (!addLiquidityV3Info.first) {
            addLiquidityV3Info.setRate('50');
        }
        await addLiquidityV3Info.updateAllTickInfo();
        return addLiquidityV3Info;
    }
};
exports.PoolV3Api = PoolV3Api;
exports.PoolV3Api = PoolV3Api = PoolV3Api_1 = __decorate([
    (0, tool_1.CacheKey)("PoolV3Api"),
    __metadata("design:paramtypes", [])
], PoolV3Api);
