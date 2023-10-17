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
let PoolV3Api = PoolV3Api_1 = class PoolV3Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    static computePoolAddress(tokenA, tokenB, fee) {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
        const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
        const poolInitCodeHash = currentAddressInfo.initCodeHash;
        const agniPoolDeployer = currentAddressInfo.agniPoolDeployer;
        const encodedParams = ethers_1.AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint24'], [token0.erc20Address(), token1.erc20Address(), fee]);
        const salt = (0, ethers_1.solidityPackedKeccak256)(['bytes'], [encodedParams]);
        const create2Address = (0, ethers_1.getCreate2Address)(agniPoolDeployer, salt, poolInitCodeHash);
        return create2Address;
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
        let [poolDatas, [token0Price, token1Price]] = await Promise.all([
            this.getPool(feeAmounts.map((feeAmount) => {
                return {
                    token0, token1, feeAmount
                };
            })),
            this.baseApi.address().getApi().tokenMangerApi().tokenPrice(token0, token1)
        ]);
        addLiquidityV3Info.token0Price = token0Price;
        addLiquidityV3Info.token1Price = token1Price;
        addLiquidityV3Info.poolState = feeAmounts.map((feeAmount, index) => {
            return {
                feeAmount,
                pick: 0,
                state: poolDatas[index] ? 'create' : 'no create'
            };
        });
        function parsePrice(inputFirstPrice) {
            let baseAmount = tool_1.CurrencyAmount.fromRawAmount(token0, BigInt(new bignumber_js_1.default("1").multipliedBy(10 ** token0.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
            let parsedQuoteAmount = tool_1.CurrencyAmount.fromRawAmount(token1, BigInt(new bignumber_js_1.default(inputFirstPrice).multipliedBy(10 ** token1.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
            let price = new tool_1.Price(baseAmount.currency, parsedQuoteAmount.currency, baseAmount.quotient, parsedQuoteAmount.quotient);
            return price;
        }
        addLiquidityV3Info.checkFirstPrice = (inputFirstPrice) => {
            if (!addLiquidityV3Info.first || !(0, tool_1.isNumber)(inputFirstPrice)) {
                return false;
            }
            let price = parsePrice(inputFirstPrice);
            tool_1.Trace.print("price", price.toFixed(), price.invert().toFixed());
            let sqrtRatioX96 = (0, utils_1.encodeSqrtRatioX96)(price.numerator, price.denominator);
            return price && sqrtRatioX96 && (BigInt(sqrtRatioX96) >= utils_1.TickMath.MIN_SQRT_RATIO && BigInt(sqrtRatioX96) < utils_1.TickMath.MAX_SQRT_RATIO);
        };
        addLiquidityV3Info.updateFirstPrice = async (inputFirstPrice) => {
            if (addLiquidityV3Info.first) {
                if (addLiquidityV3Info.checkFirstPrice(inputFirstPrice)) {
                    addLiquidityV3Info.firstPrice = new bignumber_js_1.default(inputFirstPrice).toFixed(token0.decimals, bignumber_js_1.default.ROUND_DOWN);
                    const currentTick = (0, utils_1.priceToClosestTick)(parsePrice(inputFirstPrice));
                    const currentSqrt = utils_1.TickMath.getSqrtRatioAtTick(currentTick);
                    addLiquidityV3Info.pool = new v3_1.Pool(addLiquidityV3Info.token0, addLiquidityV3Info.token1, addLiquidityV3Info.feeAmount, currentSqrt, 0n, currentTick, []);
                }
            }
        };
        let getTokenAmount = (amount, token) => {
            let independentAmount = tool_1.CurrencyAmount.fromRawAmount(token, BigInt(new bignumber_js_1.default(amount).multipliedBy(10 ** token.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN)));
            const wrappedIndependentAmount = independentAmount?.wrapped;
            const dependentCurrency = token.equals(token0) ? token1 : token0;
            if (independentAmount &&
                wrappedIndependentAmount &&
                typeof addLiquidityV3Info.tickLower === 'number' &&
                typeof addLiquidityV3Info.tickUpper === 'number' &&
                addLiquidityV3Info.pool) {
                const position = wrappedIndependentAmount.currency.equals(addLiquidityV3Info.pool.token0)
                    ? v3_1.Position.fromAmount0({
                        pool: addLiquidityV3Info.pool,
                        tickLower: addLiquidityV3Info.tickLower,
                        tickUpper: addLiquidityV3Info.tickUpper,
                        amount0: independentAmount.quotient,
                        useFullPrecision: true, // we want full precision for the theoretical position
                    })
                    : v3_1.Position.fromAmount1({
                        pool: addLiquidityV3Info.pool,
                        tickLower: addLiquidityV3Info.tickLower,
                        tickUpper: addLiquidityV3Info.tickUpper,
                        amount1: independentAmount.quotient,
                    });
                const dependentTokenAmount = wrappedIndependentAmount.currency.equals(addLiquidityV3Info.pool.token0)
                    ? position.amount1
                    : position.amount0;
                return dependentCurrency && tool_1.CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient).toFixed();
            }
            return '';
        };
        addLiquidityV3Info.updateToken0 = (amount) => {
            let tokenAmount = getTokenAmount(amount, token0);
            addLiquidityV3Info.token0Amount = amount;
            addLiquidityV3Info.token1Amount = tokenAmount;
            return tokenAmount;
        };
        addLiquidityV3Info.updateToken1 = (amount) => {
            let tokenAmount = getTokenAmount(amount, token1);
            addLiquidityV3Info.token1Amount = amount;
            addLiquidityV3Info.token0Amount = tokenAmount;
            return tokenAmount;
        };
        addLiquidityV3Info.updateFeeAmount = (feeAmount) => {
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
            addLiquidityV3Info.minPrice = leftRangeTypedValue === true ? "0" : (0, Common_1.getTickToPrice)(token0, token1, invertPrice ? upper : lower).toFixed();
            addLiquidityV3Info.maxPrice = rightRangeTypedValue === true ? "∞" : (0, Common_1.getTickToPrice)(token0, token1, invertPrice ? lower : upper).toFixed();
            return {
                minPrice: addLiquidityV3Info.minPrice,
                maxPrice: addLiquidityV3Info.maxPrice,
            };
        };
        addLiquidityV3Info.setRate = (rate) => {
        };
        addLiquidityV3Info.addLiquidity = async (connect, allowedSlippage, deadline) => {
            const invalidRange = Boolean(typeof addLiquidityV3Info.tickLower === 'number' && typeof addLiquidityV3Info.tickUpper === 'number'
                && addLiquidityV3Info.tickLower >= addLiquidityV3Info.tickUpper);
            let nonfungiblePositionManager = connect.create(abi_1.NonfungiblePositionManager);
            if (!addLiquidityV3Info.pool ||
                !addLiquidityV3Info.token0Amount ||
                !addLiquidityV3Info.token1Amount ||
                typeof addLiquidityV3Info.tickLower !== 'number' ||
                typeof addLiquidityV3Info.tickUpper !== 'number' ||
                invalidRange) {
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
                useFullPrecision: true, // we want full precision for the theoretical position
            });
            return nonfungiblePositionManager.add(position, {
                slippageTolerance: new tool_1.Percent(BigInt(new bignumber_js_1.default(allowedSlippage).multipliedBy(10000).toFixed(0, bignumber_js_1.default.ROUND_DOWN)), 10000n),
                recipient: connect.account,
                deadline: parseInt(String(new Date().getTime() / 1000)) + parseInt(deadline.toString()),
                useNative: addLiquidityV3Info.token0.isNative ? addLiquidityV3Info.token0 : addLiquidityV3Info.token1.isNative ? addLiquidityV3Info.token1 : undefined,
                createPool: addLiquidityV3Info.first,
            });
        };
        return addLiquidityV3Info;
    }
};
exports.PoolV3Api = PoolV3Api;
exports.PoolV3Api = PoolV3Api = PoolV3Api_1 = __decorate([
    (0, tool_1.CacheKey)("PoolV3Api"),
    __metadata("design:paramtypes", [])
], PoolV3Api);
