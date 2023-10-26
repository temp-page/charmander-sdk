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
exports.DashboardApi = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const vo_1 = require("../vo");
const gql_1 = require("./gql");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const DashboardMath_1 = require("../tool/math/DashboardMath");
const lodash_1 = __importDefault(require("lodash"));
let DashboardApi = class DashboardApi {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    async getBlocksFromTimestamps(timestamps) {
        if (timestamps?.length === 0) {
            return [];
        }
        let timestampsResult = await this.baseApi.blockGraph((0, gql_1.QueryBlockTimeGQL)(timestamps), {});
        const blocks = [];
        for (const timestamp of timestamps) {
            if (timestampsResult['t' + timestamp].length > 0) {
                blocks.push({
                    timestamp: timestamp.toString(),
                    number: parseInt(timestampsResult['t' + timestamp][0].number, 10),
                });
            }
            else {
                blocks.push({
                    timestamp: timestamp.toString(),
                    number: null,
                });
            }
        }
        return blocks;
    }
    async protocolData() {
        let deltaTimestamps = tool_1.TimeUtils.getDeltaTimestamps();
        let [block24, block48] = await this.getBlocksFromTimestamps([deltaTimestamps.t24h, deltaTimestamps.t48h]);
        let blockNumbers = Array.from(new Set([null, block24.number, block48.number]));
        let globalResponses = await Promise.all(blockNumbers.map(it => this.baseApi.exchangeGraph((0, gql_1.globalDataGQL)(it), {})));
        let ethPrices = await this.ethPriceDatas();
        let data = globalResponses[blockNumbers.indexOf(null)];
        let data24 = globalResponses[blockNumbers.indexOf(block24.number)];
        let data48 = globalResponses[blockNumbers.indexOf(block48.number)];
        const parsed = data?.factories?.[0];
        const parsed24 = data24?.factories?.[0];
        const parsed48 = data48?.factories?.[0];
        // volume data
        const volumeUSD = parsed && parsed24
            ? parseFloat(parsed.totalVolumeUSD) - parseFloat(parsed24.totalVolumeUSD)
            : parseFloat(parsed.totalVolumeUSD);
        const volumeOneWindowAgo = parseFloat(lodash_1.default.get(parsed24, 'totalVolumeUSD', '0')) - parseFloat(lodash_1.default.get(parsed48, 'totalVolumeUSD', '0'));
        const volumeUSDChange = volumeUSD && volumeOneWindowAgo ? ((volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo) * 100 : 0;
        // total value locked
        const tvlUSDChange = DashboardMath_1.DashboardMath.getPercentChange(parsed?.totalValueLockedUSD, parsed24?.totalValueLockedUSD);
        // 24H transactions
        const txCount = parsed && parsed24 ? parseFloat(parsed.txCount) - parseFloat(parsed24.txCount) : parseFloat(parsed.txCount);
        const txCountOneWindowAgo = parseFloat(lodash_1.default.get(parsed24, 'txCount', '0')) - parseFloat(lodash_1.default.get(parsed48, 'txCount', '0'));
        const txCountChange = txCount && txCountOneWindowAgo ? DashboardMath_1.DashboardMath.getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0;
        const feesOneWindowAgo = new bignumber_js_1.default(lodash_1.default.get(parsed24, 'totalFeesUSD', "0"))
            .minus(lodash_1.default.get(parsed24, 'totalProtocolFeesUSD', "0"))
            .minus(new bignumber_js_1.default(lodash_1.default.get(parsed48, 'totalFeesUSD', "0")).minus(lodash_1.default.get(parsed48, 'totalProtocolFeesUSD', "0")));
        const feesUSD = parsed && parsed24
            ? new bignumber_js_1.default(parsed.totalFeesUSD)
                .minus(parsed.totalProtocolFeesUSD)
                .minus(new bignumber_js_1.default(parsed24.totalFeesUSD).minus(parsed24.totalProtocolFeesUSD))
            : new bignumber_js_1.default(parsed.totalFeesUSD).minus(parsed.totalProtocolFeesUSD);
        const feeChange = feesUSD && feesOneWindowAgo ? DashboardMath_1.DashboardMath.getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString()) : 0;
        const formattedData = {
            volumeUSD,
            volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
            totalVolumeUSD: parseFloat(parsed?.totalVolumeUSD),
            tvlUSD: parseFloat(parsed?.totalValueLockedUSD),
            tvlUSDChange,
            feesUSD: feesUSD.toNumber(),
            feeChange,
            txCount,
            txCountChange,
        };
        return formattedData;
    }
    async chartData() {
        let data = [];
        const ONE_DAY_UNIX = 24 * 60 * 60;
        const startTimestamp = 1619170975;
        const endTimestamp = parseInt(Number(new Date().getTime() / 1000).toString());
        const skip = 0;
        const chartData = await this.baseApi.exchangeGraph(gql_1.globalChartGQL, {
            startTime: startTimestamp,
            skip,
        });
        data = chartData.pancakeDayDatas;
        const formattedExisting = data.reduce((accum, dayData) => {
            const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0));
            // eslint-disable-next-line no-param-reassign
            accum[roundedDate] = {
                date: dayData.date,
                volumeUSD: parseFloat(dayData.volumeUSD),
                tvlUSD: parseFloat(dayData.tvlUSD),
            };
            return accum;
        }, {});
        const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])];
        // fill in empty days ( there will be no day datas if no trades made that day )
        let timestamp = firstEntry?.date ?? startTimestamp;
        let latestTvl = firstEntry?.tvlUSD ?? 0;
        while (timestamp < endTimestamp - ONE_DAY_UNIX) {
            const nextDay = timestamp + ONE_DAY_UNIX;
            const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0));
            if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
                formattedExisting[currentDayIndex] = {
                    date: nextDay,
                    volumeUSD: 0,
                    tvlUSD: latestTvl,
                };
            }
            else {
                latestTvl = formattedExisting[currentDayIndex].tvlUSD;
            }
            timestamp = nextDay;
        }
        return Object.values(formattedExisting);
    }
    async topPool() {
        let deltaTimestamps = tool_1.TimeUtils.getDeltaTimestamps();
        let [block24, block48, block7d] = await this.getBlocksFromTimestamps([deltaTimestamps.t24h, deltaTimestamps.t48h, deltaTimestamps.t7d]);
        let poolAddresses = (await this.baseApi.exchangeGraph(gql_1.topPoolsGQL, {})).pools.map(it => it.id);
        return await this.poolDatas(poolAddresses, block24, block48, block7d);
    }
    async ethPriceDatas() {
        let deltaTimestamps = tool_1.TimeUtils.getDeltaTimestamps();
        let [block24, block48, block7d] = await this.getBlocksFromTimestamps([deltaTimestamps.t24h, deltaTimestamps.t48h, deltaTimestamps.t7d]);
        let pricesResponse = (await this.baseApi.exchangeGraph((0, gql_1.ethPricesGQL)(block24.number, block48.number, block7d.number), {}));
        return {
            current: parseFloat(lodash_1.default.get(pricesResponse, 'current[0].ethPriceUSD', "0")),
            oneDay: parseFloat(lodash_1.default.get(pricesResponse, 'oneDay[0].ethPriceUSD', "0")),
            twoDay: parseFloat(lodash_1.default.get(pricesResponse, 'twoDay[0].ethPriceUSD', "0")),
            week: parseFloat(lodash_1.default.get(pricesResponse, 'oneWeek[0].ethPriceUSD', "0")),
        };
    }
    async topToken() {
        let deltaTimestamps = tool_1.TimeUtils.getDeltaTimestamps();
        let [block24, block48, block7d] = await this.getBlocksFromTimestamps([deltaTimestamps.t24h, deltaTimestamps.t48h, deltaTimestamps.t7d]);
        let tokenAddresses = (await this.baseApi.exchangeGraph(gql_1.topTokensGQL, {})).tokens.map(it => it.id);
        if (tokenAddresses.length == 0) {
            return {};
        }
        let blockNumbers = Array.from(new Set([null, block24.number, block48.number, block7d.number]));
        let tokenDataResponses = await Promise.all(blockNumbers.map(it => this.baseApi.exchangeGraph((0, gql_1.tokensBulkGQL)(it, tokenAddresses), {})));
        let ethPrices = await this.ethPriceDatas();
        let data = tokenDataResponses[blockNumbers.indexOf(null)];
        let data24 = tokenDataResponses[blockNumbers.indexOf(block24.number)];
        let data48 = tokenDataResponses[blockNumbers.indexOf(block48.number)];
        let dataWeek = tokenDataResponses[blockNumbers.indexOf(block7d.number)];
        const parsed = data?.tokens
            ? data.tokens.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        const parsed24 = data24?.tokens
            ? data24.tokens.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        const parsed48 = data48?.tokens
            ? data48.tokens.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        const parsedWeek = dataWeek?.tokens
            ? dataWeek.tokens.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        // format data and calculate daily changes
        const formatted = tokenAddresses.reduce((accum, address) => {
            const current = parsed[address];
            const oneDay = parsed24[address];
            const twoDay = parsed48[address];
            const week = parsedWeek[address];
            const [volumeUSD, volumeUSDChange] = current && oneDay && twoDay
                ? DashboardMath_1.DashboardMath.get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                : current
                    ? [parseFloat(current.volumeUSD), 0]
                    : [0, 0];
            const volumeUSDWeek = current && week
                ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
                : current
                    ? parseFloat(current.volumeUSD)
                    : 0;
            const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0;
            const tvlUSDChange = DashboardMath_1.DashboardMath.getPercentChange(parseFloat(current?.totalValueLockedUSD).toFixed(), parseFloat(oneDay?.totalValueLockedUSD).toFixed());
            const tvlToken = current ? parseFloat(current.totalValueLocked) : 0;
            const priceUSD = current ? parseFloat(current.derivedETH) * ethPrices.current : 0;
            const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedETH) * ethPrices.oneDay : 0;
            const priceUSDWeek = week ? parseFloat(week.derivedETH) * ethPrices.week : 0;
            const priceUSDChange = priceUSD && priceUSDOneDay ? DashboardMath_1.DashboardMath.getPercentChange(priceUSD, priceUSDOneDay) : 0;
            const priceUSDChangeWeek = priceUSD && priceUSDWeek ? DashboardMath_1.DashboardMath.getPercentChange(priceUSD, priceUSDWeek) : 0;
            const txCount = current && oneDay
                ? parseFloat(current.txCount) - parseFloat(oneDay.txCount)
                : current
                    ? parseFloat(current.txCount)
                    : 0;
            const feesUSD = current && oneDay
                ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD)
                : current
                    ? parseFloat(current.feesUSD)
                    : 0;
            // eslint-disable-next-line no-param-reassign
            accum[address] = {
                exists: !!current,
                address,
                name: current?.name ?? '',
                symbol: current?.symbol ?? '',
                volumeUSD,
                volumeUSDChange,
                volumeUSDWeek,
                txCount,
                tvlUSD,
                feesUSD,
                tvlUSDChange,
                tvlToken,
                priceUSD,
                priceUSDChange,
                priceUSDChangeWeek,
            };
            return accum;
        }, {});
        return formatted;
    }
    async poolDatas(poolAddresses, block24, block48, block7d) {
        if (poolAddresses.length == 0) {
            return {};
        }
        let blockNumbers = Array.from(new Set([null, block24.number, block48.number, block7d.number]));
        let poolDataResponses = await Promise.all(blockNumbers.map(it => this.baseApi.exchangeGraph((0, gql_1.poolsBulkGQL)(it, poolAddresses), {})));
        let data = poolDataResponses[blockNumbers.indexOf(null)];
        let data24 = poolDataResponses[blockNumbers.indexOf(block24.number)];
        let data48 = poolDataResponses[blockNumbers.indexOf(block48.number)];
        let dataWeek = poolDataResponses[blockNumbers.indexOf(block7d.number)];
        const ethPriceUSD = data.bundles?.[0]?.ethPriceUSD ? parseFloat(data.bundles[0].ethPriceUSD) : 0;
        const parsed = data.pools
            ? data.pools.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        const parsed24 = data24?.pools
            ? data24.pools.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        const parsed48 = data48?.pools
            ? data48.pools.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        const parsedWeek = dataWeek?.pools
            ? dataWeek.pools.reduce((accum, poolData) => {
                // eslint-disable-next-line no-param-reassign
                accum[poolData.id] = poolData;
                return accum;
            }, {})
            : {};
        // format data and calculate daily changes
        const formatted = poolAddresses.reduce((accum, address) => {
            const current = parsed[address];
            const oneDay = parsed24[address];
            const twoDay = parsed48[address];
            const week = parsedWeek[address];
            const [volumeUSD, volumeUSDChange] = current && oneDay && twoDay
                ? DashboardMath_1.DashboardMath.get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                : current
                    ? [new bignumber_js_1.default(current.volumeUSD).toFixed(), "0"]
                    : ["0", "0"];
            const volumeUSDWeek = current && week
                ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
                : current
                    ? parseFloat(current.volumeUSD)
                    : 0;
            const feeUSD = current && oneDay
                ? new bignumber_js_1.default(current?.feesUSD)
                    .minus(current?.protocolFeesUSD)
                    .minus(new bignumber_js_1.default(oneDay?.feesUSD).minus(oneDay?.protocolFeesUSD))
                : new bignumber_js_1.default(current?.feesUSD).minus(current?.protocolFeesUSD);
            // Hotifx: Subtract fees from TVL to correct data while subgraph is fixed.
            /**
             * Note: see issue desribed here https://github.com/Uniswap/v3-subgraph/issues/74
             * During subgraph deploy switch this month we lost logic to fix this accounting.
             * Grafted sync pending fix now.
             * @chef-jojo: should be fixed on our version, but leaving this in for now
             */
            const feePercent = current ? new bignumber_js_1.default(current.feeTier).div(10000).div(100).toFixed() : 0;
            const tvlAdjust0 = current?.volumeToken0 ? (new bignumber_js_1.default(current.volumeToken0).multipliedBy(feePercent).div(2).toFixed()) : "0";
            const tvlAdjust1 = current?.volumeToken1 ? (new bignumber_js_1.default(current.volumeToken1).multipliedBy(feePercent).div(2).toFixed()) : "0";
            const tvlToken0 = current ? bignumber_js_1.default.max(new bignumber_js_1.default(current.totalValueLockedToken0).minus(tvlAdjust0), "0").toFixed() : "0";
            const tvlToken1 = current ? bignumber_js_1.default.max(new bignumber_js_1.default(current.totalValueLockedToken1).minus(tvlAdjust1), "0").toFixed() : "0";
            let tvlUSD = current ? new bignumber_js_1.default(current.totalValueLockedUSD).toFixed() : "0";
            const tvlUSDChange = current && oneDay
                ? ((parseFloat(current.totalValueLockedUSD) - parseFloat(oneDay.totalValueLockedUSD)) /
                    parseFloat(oneDay.totalValueLockedUSD === '0' ? '1' : oneDay.totalValueLockedUSD)) *
                    100
                : 0;
            // Part of TVL fix
            const tvlUpdated = current
                ?
                    new bignumber_js_1.default(tvlToken0).multipliedBy(current.token0.derivedETH).multipliedBy(ethPriceUSD)
                        .plus(new bignumber_js_1.default(tvlToken1).multipliedBy(current.token1.derivedETH).multipliedBy(ethPriceUSD)).toFixed() : undefined;
            if (tvlUpdated) {
                tvlUSD = tvlUpdated;
            }
            const feeTier = current ? parseInt(current.feeTier) : 0;
            if (current) {
                // eslint-disable-next-line no-param-reassign
                accum[address] = {
                    address,
                    feeTier,
                    liquidity: parseFloat(current.liquidity),
                    sqrtPrice: parseFloat(current.sqrtPrice),
                    tick: parseFloat(current.tick),
                    token0: {
                        address: current.token0.id,
                        name: current.token0.name,
                        symbol: current.token0.symbol,
                        decimals: parseInt(current.token0.decimals),
                        derivedETH: parseFloat(current.token0.derivedETH),
                    },
                    token1: {
                        address: current.token1.id,
                        name: current.token1.name,
                        symbol: current.token1.symbol,
                        decimals: parseInt(current.token1.decimals),
                        derivedETH: parseFloat(current.token1.derivedETH),
                    },
                    token0Price: parseFloat(current.token0Price),
                    token1Price: parseFloat(current.token1Price),
                    volumeUSD: new bignumber_js_1.default(volumeUSD).toNumber(),
                    volumeUSDChange: new bignumber_js_1.default(volumeUSDChange).toNumber(),
                    volumeUSDWeek: new bignumber_js_1.default(volumeUSDWeek).toNumber(),
                    tvlUSD: new bignumber_js_1.default(tvlUSD).toNumber(),
                    tvlUSDChange,
                    tvlToken0: new bignumber_js_1.default(tvlToken0).toNumber(),
                    tvlToken1: new bignumber_js_1.default(tvlToken1).toNumber(),
                    feeUSD: feeUSD.toNumber(),
                };
            }
            return accum;
        }, {});
        return formatted;
    }
    async topTransactions() {
        const data = await this.baseApi.exchangeGraph(gql_1.globalTransactionsGQL, {});
        const transactions = [
            {
                type: vo_1.DashboardTransactionType.MINT,
                txs: data.mints
            },
            {
                type: vo_1.DashboardTransactionType.SWAP,
                txs: data.swaps
            },
            {
                type: vo_1.DashboardTransactionType.BURN,
                txs: data.burns
            }
        ].flatMap(({ type, txs }) => {
            return txs.map((m) => {
                return {
                    type,
                    hash: m.id.split('-')[0].split("#")[0],
                    timestamp: m.timestamp,
                    sender: m.origin,
                    token0Symbol: m.token0.symbol,
                    token1Symbol: m.token1.symbol,
                    token0Address: m.token0.id,
                    token1Address: m.token1.id,
                    amountUSD: parseFloat(m.amountUSD),
                    amountToken0: parseFloat(m.amount0),
                    amountToken1: parseFloat(m.amount1),
                };
            });
        });
        return transactions.sort((a, b) => {
            return parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10);
        });
    }
};
exports.DashboardApi = DashboardApi;
exports.DashboardApi = DashboardApi = __decorate([
    (0, tool_1.CacheKey)("DashboardApi"),
    __metadata("design:paramtypes", [])
], DashboardApi);
