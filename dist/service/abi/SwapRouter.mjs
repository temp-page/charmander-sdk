import { ISwapRouter } from "../../abi/index.mjs";
import { CacheKey, CurrencyAmount, EnableLogs, TradeType } from "../tool/index.mjs";
import { invariant } from "../tool/math/Common.mjs";
import { RouteType } from "../tool/v3route/types/index.mjs";
import { maximumAmountIn, minimumAmountOut } from "../tool/v3route/utils/maximumAmount.mjs";
import { getCurrentAddressInfo } from "../../Constant.mjs";
import { encodeMixedRouteToPath } from "../tool/math/SwapV3Math.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
@CacheKey("SwapRouter")
export class SwapRouter extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.swapRouter, ISwapRouter);
  }
  @EnableLogs()
  async swap(trades, slippageTolerance, recipientAddr, deadline, gasPriceGWei) {
    const numberOfTrades = trades.reduce((numOfTrades, trade) => numOfTrades + trade.routes.length, 0);
    const sampleTrade = trades[0];
    invariant(
      trades.every((trade) => trade.inputAmount.currency.equals(sampleTrade.inputAmount.currency)),
      "TOKEN_IN_DIFF"
    );
    invariant(
      trades.every((trade) => trade.outputAmount.currency.equals(sampleTrade.outputAmount.currency)),
      "TOKEN_OUT_DIFF"
    );
    invariant(
      trades.every((trade) => trade.tradeType === sampleTrade.tradeType),
      "TRADE_TYPE_DIFF"
    );
    const calldatas = [];
    const inputIsNative = sampleTrade.inputAmount.currency.isNative;
    const outputIsNative = sampleTrade.outputAmount.currency.isNative;
    const performAggregatedSlippageCheck = sampleTrade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2;
    const routerMustCustody = outputIsNative || performAggregatedSlippageCheck;
    for (const trade of trades) {
      if (trade.routes.every((r) => r.type === RouteType.V3)) {
        for (const route of trade.routes) {
          const { inputAmount, outputAmount, pools, path } = route;
          const amountIn = maximumAmountIn(trade, slippageTolerance, inputAmount).quotient;
          const amountOut = minimumAmountOut(trade, slippageTolerance, outputAmount).quotient;
          const singleHop = pools.length === 1;
          const recipient = routerMustCustody ? getCurrentAddressInfo().swapRouter : recipientAddr;
          if (singleHop) {
            if (trade.tradeType === TradeType.EXACT_INPUT) {
              const exactInputSingleParams = {
                tokenIn: path[0].wrapped.address,
                tokenOut: path[1].wrapped.address,
                fee: pools[0].fee,
                recipient,
                deadline: (Math.floor(+/* @__PURE__ */ new Date() / 1e3) + +deadline).toString(),
                amountIn,
                amountOutMinimum: performAggregatedSlippageCheck ? 0n : amountOut,
                sqrtPriceLimitX96: 0n
              };
              calldatas.push(
                this.contract.interface.encodeFunctionData("exactInputSingle", [exactInputSingleParams])
              );
            } else {
              const exactOutputSingleParams = {
                tokenIn: path[0].wrapped.address,
                tokenOut: path[1].wrapped.address,
                fee: pools[0].fee,
                recipient,
                deadline: (Math.floor(+/* @__PURE__ */ new Date() / 1e3) + +deadline).toString(),
                amountOut,
                amountInMaximum: amountIn,
                sqrtPriceLimitX96: 0n
              };
              calldatas.push(
                this.contract.interface.encodeFunctionData("exactOutputSingle", [exactOutputSingleParams])
              );
            }
          } else {
            const pathStr = encodeMixedRouteToPath(
              { ...route, input: inputAmount.currency, output: outputAmount.currency },
              trade.tradeType === TradeType.EXACT_OUTPUT
            );
            if (trade.tradeType === TradeType.EXACT_INPUT) {
              const exactInputParams = {
                path: pathStr,
                recipient,
                deadline: (Math.floor(+/* @__PURE__ */ new Date() / 1e3) + +deadline).toString(),
                amountIn,
                amountOutMinimum: performAggregatedSlippageCheck ? 0n : amountOut
              };
              calldatas.push(
                this.contract.interface.encodeFunctionData("exactInput", [exactInputParams])
              );
            } else {
              const exactOutputParams = {
                path: pathStr,
                recipient,
                deadline: (Math.floor(+/* @__PURE__ */ new Date() / 1e3) + +deadline).toString(),
                amountOut,
                amountInMaximum: amountIn
              };
              calldatas.push(
                this.contract.interface.encodeFunctionData("exactOutput", [exactOutputParams])
              );
            }
          }
        }
      }
    }
    const ZERO_IN = CurrencyAmount.fromRawAmount(sampleTrade.inputAmount.currency, 0);
    const ZERO_OUT = CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0);
    const minAmountOut = trades.reduce(
      (sum, trade) => sum.add(minimumAmountOut(trade, slippageTolerance)),
      ZERO_OUT
    );
    const totalAmountIn = trades.reduce(
      (sum, trade) => sum.add(maximumAmountIn(trade, slippageTolerance)),
      ZERO_IN
    );
    if (routerMustCustody) {
      if (outputIsNative) {
        calldatas.push(
          this.contract.interface.encodeFunctionData("unwrapWMNT", [minAmountOut.quotient, recipientAddr])
        );
      } else {
        calldatas.push(
          this.contract.interface.encodeFunctionData("sweepToken", [sampleTrade.outputAmount.currency.wrapped.erc20Address(), minAmountOut.quotient, recipientAddr])
        );
      }
    }
    if (inputIsNative) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("refundMNT", [])
      );
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas], {
      gasPrice: gasPriceGWei,
      value: inputIsNative ? totalAmountIn.quotient.toString() : "0"
    });
  }
}
