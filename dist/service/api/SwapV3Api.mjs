import groupBy from "lodash/groupBy";
import BigNumber from "bignumber.js";
import { BalanceAndAllowance, ETH_ADDRESS, FeeAmount, SwapInfo } from "../vo/index.mjs";
import { CacheKey, CurrencyAmount, Percent, Trace, TradeType, isNullOrUndefined } from "../tool/index.mjs";
import { parseProtocolFees } from "../tool/sdk/v3/utils/index.mjs";
import { computeTradePriceBreakdown, encodeMixedRouteToPath, getPairCombinations } from "../tool/math/SwapV3Math.mjs";
import { v3PoolTvlSelector } from "../tool/v3route/constants/index.mjs";
import { GasMultiCallContract, IQuoterV2Abi } from "../abi/index.mjs";
import { Abi, QUOTER_TRADE_GAS } from "../../mulcall/index.mjs";
import { getQuoteCurrency } from "../tool/v3route/functions/route.mjs";
import { getBestTrade } from "../tool/v3route/getBestTrade.mjs";
import { SwapRouter } from "../abi/SwapRouter.mjs";
import { getCurrentAddressInfo } from "../../Constant.mjs";
import { RUSDY } from "../abi/RUSDY.mjs";
import { WETH } from "../abi/WETH.mjs";
import { PoolV3Api } from "./PoolV3Api.mjs";
import { GetDerivedPricesGQL, SwapQueryV3Pools } from "./gql/SwapV3Gql.mjs";
import { BASE_API } from "./BaseApi.mjs";
import { transactionHistory } from "./TransactionHistory.mjs";
@CacheKey("SwapV3Api")
export class SwapV3Api {
  baseApi;
  constructor() {
    this.baseApi = BASE_API;
  }
  getPoolMetaData(tokenA, tokenB) {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((it) => {
      const address = PoolV3Api.computePoolAddress(token0, token1, it);
      return {
        address,
        token0: token0.wrapped,
        token1: token1.wrapped,
        fee: it
      };
    });
  }
  async getCandidatePoolsOnGraphNode(tokenA, tokenB, mataData) {
    const metaDataGroup = groupBy(mataData, (it) => it.address.toLowerCase());
    const swapQueryV3PoolsResult = await this.baseApi.exchangeGraph(SwapQueryV3Pools, {
      pageSize: 1e3,
      poolAddrs: mataData.map((it) => it.address.toLowerCase())
    });
    const pools = swapQueryV3PoolsResult.pools.map((it) => {
      const metaDataGroupElement = metaDataGroup[it.id];
      if (!metaDataGroupElement && metaDataGroupElement.length === 0)
        return void 0;
      const metaData = metaDataGroupElement[0];
      const { fee, token0, token1, address } = metaData;
      const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(it.feeProtocol);
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
        ticks: void 0
      };
    }).filter((it) => !isNullOrUndefined(it));
    return v3PoolTvlSelector(tokenA, tokenB, pools);
  }
  async getCandidatePoolsByToken(tokenA, tokenB) {
    const poolMetaData = getPairCombinations(tokenA, tokenB).flatMap((it) => this.getPoolMetaData(it[0], it[1]));
    return this.getCandidatePoolsOnGraphNode(tokenA, tokenB, poolMetaData);
  }
  async getCandidatePoolsByPair(tokenA, tokenB) {
    const poolMetaData = this.getPoolMetaData(tokenA, tokenB);
    return this.getCandidatePoolsOnGraphNode(tokenA, tokenB, poolMetaData);
  }
  async swapInfo(token0, token1, account) {
    const swapInfo = new SwapInfo();
    swapInfo.token0 = token0;
    swapInfo.token1 = token1;
    swapInfo.isWrapped = false;
    if (token0.address === ETH_ADDRESS && token1.address === getCurrentAddressInfo().WMNT) {
      swapInfo.isWrapped = true;
      swapInfo.wrapType = "wrap";
    }
    if (token1.address === ETH_ADDRESS && token0.address === getCurrentAddressInfo().WMNT) {
      swapInfo.isWrapped = true;
      swapInfo.wrapType = "unwrap";
    }
    if (token1.address === getCurrentAddressInfo().RUSDY && token0.address === getCurrentAddressInfo().USDY) {
      swapInfo.isWrapped = true;
      swapInfo.wrapType = "wrap";
    }
    if (token0.address === getCurrentAddressInfo().RUSDY && token1.address === getCurrentAddressInfo().USDY) {
      swapInfo.isWrapped = true;
      swapInfo.wrapType = "unwrap";
    }
    swapInfo.token0Balance = BalanceAndAllowance.unavailable(token0);
    swapInfo.token1Balance = BalanceAndAllowance.unavailable(token1);
    const initBalance = async () => {
      if (account) {
        const balanceAndAllowances = await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
          account,
          this.baseApi.address().nonfungiblePositionManager,
          [token0, token1]
        );
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
        swapInfo.trade = void 0;
        swapInfo.canSwap = false;
        swapInfo.swapConfig = swapConfig;
        const routerTrade = await this.getBestTrade(
          swapInfo.token0,
          swapInfo.token1,
          inputAmount,
          inputToken,
          swapConfig
        );
        swapInfo.canSwap = true;
        swapInfo.trade = routerTrade;
        swapInfo.intputToken = inputToken;
        swapInfo.inputAmount = inputAmount;
        if (swapInfo.token1.equals(inputToken)) {
          swapInfo.token0Amount = routerTrade.outputAmount.toFixed();
          swapInfo.token1Amount = inputAmount;
          swapInfo.maximumSold = new BigNumber(swapInfo.token0Amount).multipliedBy(1 + Number.parseFloat(swapConfig.allowedSlippage)).toFixed();
          swapInfo.minimumReceived = void 0;
        } else {
          swapInfo.token0Amount = inputAmount;
          swapInfo.token1Amount = routerTrade.outputAmount.toFixed();
          swapInfo.minimumReceived = new BigNumber(swapInfo.token1Amount).multipliedBy(1 - Number.parseFloat(swapConfig.allowedSlippage)).toFixed();
          swapInfo.maximumSold = void 0;
        }
        swapInfo.token0SwapPrice = new BigNumber(swapInfo.token1Amount).div(swapInfo.token0Amount).toFixed();
        swapInfo.token1SwapPrice = new BigNumber(swapInfo.token0Amount).div(swapInfo.token1Amount).toFixed();
        const computeTradePrice = computeTradePriceBreakdown(routerTrade);
        swapInfo.tradingFee = computeTradePrice.lpFeeAmount?.toFixed();
        swapInfo.priceImpact = computeTradePrice.priceImpactWithoutFee?.toFixed();
      } catch (e) {
        Trace.error(e);
        swapInfo.canSwap = false;
        swapInfo.intputToken = void 0;
        swapInfo.inputAmount = void 0;
        swapInfo.token0Price = void 0;
        swapInfo.token1Price = void 0;
        swapInfo.tradingFee = void 0;
        swapInfo.minimumReceived = void 0;
        swapInfo.maximumSold = void 0;
      }
    };
    const swapByWrap = async (inputToken, inputAmount) => {
      try {
        swapInfo.canSwap = false;
        swapInfo.intputToken = inputToken;
        swapInfo.inputAmount = inputAmount;
        swapInfo.token0Amount = inputAmount;
        if (swapInfo.wrapType === "wrap") {
          if (token0.address === ETH_ADDRESS)
            swapInfo.token1Amount = inputAmount;
          if (token0.address === getCurrentAddressInfo().USDY)
            swapInfo.token1Amount = await this.baseApi.connectInfo().create(RUSDY).getRUSDYByShares(inputAmount);
        }
        if (swapInfo.wrapType === "unwrap") {
          if (token1.address === ETH_ADDRESS)
            swapInfo.token1Amount = inputAmount;
          if (token1.address === getCurrentAddressInfo().USDY)
            swapInfo.token1Amount = await this.baseApi.connectInfo().create(RUSDY).getRUSDYByShares(inputAmount);
        }
        swapInfo.canSwap = true;
      } catch (e) {
        Trace.error(e);
        swapInfo.canSwap = false;
        swapInfo.intputToken = void 0;
        swapInfo.inputAmount = void 0;
      }
    };
    swapInfo.updateInput = async (inputToken, inputAmount, swapConfig) => {
      if (swapInfo.isWrapped) {
        if (inputToken.address === token0.address)
          await swapByWrap(inputToken, inputAmount);
      } else {
        await swapByRoute(inputToken, inputAmount, swapConfig);
      }
    };
    swapInfo.swap = async (connectInfo, recipientAddr, deadline) => {
      if (!swapInfo.canSwap)
        return;
      if (isNullOrUndefined(recipientAddr))
        recipientAddr = connectInfo.account;
      const slippageTolerance = new Percent(BigInt(new BigNumber(swapInfo.swapConfig.allowedSlippage).multipliedBy(1e4).toFixed(0, BigNumber.ROUND_DOWN)), 10000n);
      const transactionEvent = await connectInfo.create(SwapRouter).swap([swapInfo.trade], slippageTolerance, recipientAddr, deadline, swapInfo.swapConfig.gasPriceWei);
      transactionHistory.saveHistory(
        connectInfo,
        transactionEvent,
        {
          token0,
          token1,
          token0Amount: swapInfo.token0Amount,
          token1Amount: swapInfo.token1Amount,
          type: "swap",
          to: recipientAddr
        }
      );
      return transactionEvent;
    };
    swapInfo.wrap = async (connectInfo) => {
      let transactionEvent;
      if (swapInfo.wrapType === "wrap") {
        if (token0.address === ETH_ADDRESS)
          transactionEvent = await connectInfo.create(WETH).deposit(new BigNumber(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, BigNumber.ROUND_DOWN));
        if (token0.address === getCurrentAddressInfo().USDY)
          transactionEvent = await connectInfo.create(RUSDY).wrap(new BigNumber(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, BigNumber.ROUND_DOWN));
      }
      if (swapInfo.wrapType === "unwrap") {
        if (token1.address === ETH_ADDRESS)
          transactionEvent = await connectInfo.create(WETH).withdraw(new BigNumber(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, BigNumber.ROUND_DOWN));
        if (token1.address === getCurrentAddressInfo().USDY)
          transactionEvent = await connectInfo.create(RUSDY).unwrap(new BigNumber(swapInfo.inputAmount).multipliedBy(10 ** token0.decimals).toFixed(0, BigNumber.ROUND_DOWN));
      }
      if (transactionEvent === void 0)
        throw new Error("wrap type error");
      transactionHistory.saveHistory(
        connectInfo,
        transactionEvent,
        {
          token0,
          token1,
          token0Amount: swapInfo.token0Amount,
          token1Amount: swapInfo.token1Amount,
          type: "swap",
          to: void 0
        }
      );
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
      swapInfo.tokenPrice = void 0;
      if (swapInfo.isWrap)
        return;
      const getTimeConfig = (type2) => {
        const endTime = Number.parseInt(String((/* @__PURE__ */ new Date()).getTime() / 1e3));
        switch (type2) {
          case "day":
            return {
              endTime,
              interval: 60 * 60,
              startTime: endTime - 24 * 60 * 60
            };
          case "week":
            return {
              endTime,
              interval: 60 * 60 * 4,
              startTime: endTime - 7 * 24 * 60 * 60
            };
          case "month":
            return {
              endTime,
              interval: 60 * 60 * 24,
              startTime: endTime - 30 * 24 * 60 * 60
            };
          case "year":
            return {
              endTime,
              interval: 60 * 60 * 24,
              startTime: endTime - 365 * 24 * 60 * 60
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
      const blocks = await this.baseApi.address().getApi().dashboard().getBlocksFromTimestamps(timestamps, "exchange-v3");
      const [
        token0Prices,
        token1Prices
      ] = await Promise.all(
        [
          this.baseApi.exchangeGraph(GetDerivedPricesGQL(token0.erc20Address().toLowerCase(), blocks), {}),
          this.baseApi.exchangeGraph(GetDerivedPricesGQL(token1.erc20Address().toLowerCase(), blocks), {})
        ]
      );
      const token0PriceData = [];
      const token1PriceData = [];
      timestamps.forEach((it) => {
        const price0 = token0Prices[`t${it}`]?.derivedUSD;
        const price1 = token1Prices[`t${it}`]?.derivedUSD;
        if (price0 && price1) {
          token0PriceData.push({
            price: price0 === "0" ? "0" : new BigNumber(price1).div(price0).toFixed(),
            time: it
          });
          token1PriceData.push({
            price: price1 === "0" ? "0" : new BigNumber(price0).div(price1).toFixed(),
            time: it
          });
        }
      });
      swapInfo.tokenPrice = {
        token0: {
          datas: token0PriceData,
          lastPrice: token0PriceData[token0PriceData.length - 1]?.price || "0"
        },
        token1: {
          datas: token1PriceData,
          lastPrice: token1PriceData[token1PriceData.length - 1]?.price || "0"
        }
      };
    };
    return swapInfo;
  }
  async getBestTrade(token0, token1, amount, inputToken, swapConfig) {
    const getPoolProvider = () => {
      return {
        getCandidatePools: async (tokenA, tokenB) => this.getCandidatePoolsByToken(tokenA, tokenB)
      };
    };
    const quoteProvider = () => {
      const gasMultiCallContract = this.baseApi.connectInfo().create(GasMultiCallContract);
      const quoterV2 = this.baseApi.connectInfo().create(IQuoterV2Abi);
      const getRouteWithQuotes = async (routes, gasModel, isExactIn) => {
        const funcName = isExactIn ? "quoteExactInput" : "quoteExactOutput";
        const callInputs = routes.map((route) => {
          const path = encodeMixedRouteToPath(route, !isExactIn);
          return {
            target: this.baseApi.address().quoterV2,
            callData: quoterV2.contract.interface.encodeFunctionData(funcName, [path, route.amount.quotient.toString()]),
            gasLimit: QUOTER_TRADE_GAS
          };
        });
        const gasCallResponses = await gasMultiCallContract.multicall(callInputs);
        const routesWithQuote = [];
        for (let i = 0; i < gasCallResponses.length; i++) {
          const gasCallResponse = gasCallResponses[i];
          const route = routes[i];
          if (!gasCallResponse.success) {
            continue;
          }
          const quoteResult = Abi.decode(["uint256", "uint160[]", "uint32[]", "uint256"], gasCallResponse.returnData);
          const quoteCurrency = getQuoteCurrency(route, route.amount.currency);
          const quote = CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, quoteResult[0].toString());
          const { gasEstimate, gasCostInToken, gasCostInUSD } = gasModel.estimateGasCost(
            route.pools,
            quoteResult[2]
          );
          const adjustQuoteForGas = (quote2, gasCostInToken2) => isExactIn ? quote2.subtract(gasCostInToken2) : quote2.add(gasCostInToken2);
          routesWithQuote.push({
            ...route,
            quote,
            quoteAdjustedForGas: adjustQuoteForGas(quote, gasCostInToken),
            // sqrtPriceX96AfterList: quoteResult.result[1],
            gasEstimate,
            gasCostInToken,
            gasCostInUSD
          });
        }
        return routesWithQuote;
      };
      return {
        getRouteWithQuotesExactIn: async (routes, options) => getRouteWithQuotes(routes, options.gasModel, true),
        getRouteWithQuotesExactOut: async (routes, options) => getRouteWithQuotes(routes, options.gasModel, false)
      };
    };
    const baseAmount = CurrencyAmount.fromRawAmount(inputToken, BigInt(new BigNumber(amount).multipliedBy(10 ** inputToken.decimals).toFixed(0, BigNumber.ROUND_DOWN)));
    let tradeType = TradeType.EXACT_INPUT;
    let token = token1;
    if (token1.equals(inputToken)) {
      tradeType = TradeType.EXACT_OUTPUT;
      token = token0;
    }
    const routerTrade = await getBestTrade(
      baseAmount,
      token,
      tradeType,
      {
        gasPriceWei: swapConfig.gasPriceWei,
        maxSplits: swapConfig.allowSplitRouting ? void 0 : 0,
        maxHops: swapConfig.allowMultiHops ? void 0 : 1,
        poolProvider: getPoolProvider(),
        quoteProvider: quoteProvider()
      }
    );
    if (routerTrade === null)
      throw new Error("Cannot find a valid swap route");
    return routerTrade;
  }
}
