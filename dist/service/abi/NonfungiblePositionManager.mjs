import BigNumber from "bignumber.js";
import { INonfungiblePositionManager } from "../../abi/index.mjs";
import { CacheKey, EnableLogs, ZERO, ZERO_ADDRESS, isNullOrUndefined } from "../tool/index.mjs";
import { invariant } from "../tool/math/Common.mjs";
import { ETH_ADDRESS } from "../vo/index.mjs";
import { BaseAbi } from "./BaseAbi.mjs";
const MaxUint128 = 2n ** 128n - 1n;
@CacheKey("NonfungiblePositionManager")
export class NonfungiblePositionManager extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.nonfungiblePositionManager, INonfungiblePositionManager);
  }
  async collect(tokenId, token0, token1, fee0, fee1, involvesMNT) {
    const calldatas = [];
    const involvesETH = involvesMNT && (token0.address === ETH_ADDRESS || token1.address === ETH_ADDRESS);
    const account = this.connectInfo.account;
    calldatas.push(
      this.contract.interface.encodeFunctionData("collect", [{
        tokenId,
        recipient: involvesETH ? ZERO_ADDRESS : account,
        amount0Max: MaxUint128.toString(),
        amount1Max: MaxUint128.toString()
      }])
    );
    if (involvesETH) {
      const ethAmount = token0.address === ETH_ADDRESS ? fee0 : fee1;
      const token = token0.address === ETH_ADDRESS ? token1 : token0;
      const tokenAmount = token0.address === ETH_ADDRESS ? fee1 : fee0;
      calldatas.push(
        this.contract.interface.encodeFunctionData("unwrapWMNT", [ethAmount, account])
      );
      calldatas.push(
        this.contract.interface.encodeFunctionData("sweepToken", [token.erc20Address(), tokenAmount, account])
      );
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas]);
  }
  @EnableLogs()
  async addLiquidity(position, tokenId, createPool, slippageTolerance, deadline) {
    invariant(position.liquidity > ZERO, "ZERO_LIQUIDITY");
    const recipient = this.connectInfo.account;
    const calldatas = [];
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts;
    const minimumAmounts = position.mintAmountsWithSlippage(slippageTolerance);
    const amount0Min = minimumAmounts.amount0;
    const amount1Min = minimumAmounts.amount1;
    if (createPool) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("createAndInitializePoolIfNecessary", [
          position.pool.token0.erc20Address(),
          position.pool.token1.erc20Address(),
          position.pool.fee,
          position.pool.sqrtRatioX96
        ])
      );
    }
    if (!isNullOrUndefined(tokenId)) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("increaseLiquidity", [
          {
            tokenId: BigInt(tokenId),
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            deadline
          }
        ])
      );
    } else {
      calldatas.push(
        this.contract.interface.encodeFunctionData("mint", [{
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
          deadline
        }])
      );
    }
    let value = "0";
    if (position.pool.token0.isNative || position.pool.token1.isNative) {
      const wrapped = position.pool.token0.isNative ? position.pool.token0 : position.pool.token1.isNative ? position.pool.token1 : void 0;
      const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired;
      if (wrappedValue > ZERO)
        calldatas.push(this.contract.interface.encodeFunctionData("refundMNT", []));
      value = wrappedValue.toString();
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas], {
      value
    });
  }
  @EnableLogs()
  async removeLiquidity(rate, token0, token1, partialPosition, tokenId, fee0, fee1, involvesMNT, slippageTolerance, deadline) {
    const calldatas = [];
    invariant(partialPosition.liquidity > ZERO, "ZERO_LIQUIDITY");
    const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
      slippageTolerance
    );
    calldatas.push(
      this.contract.interface.encodeFunctionData("decreaseLiquidity", [
        {
          tokenId,
          liquidity: partialPosition.liquidity,
          amount0Min,
          amount1Min,
          deadline
        }
      ])
    );
    const involvesETH = involvesMNT && (token0.address === ETH_ADDRESS || token1.address === ETH_ADDRESS);
    const account = this.connectInfo.account;
    calldatas.push(
      this.contract.interface.encodeFunctionData("collect", [{
        tokenId,
        recipient: involvesETH ? ZERO_ADDRESS : account,
        amount0Max: MaxUint128.toString(),
        amount1Max: MaxUint128.toString()
      }])
    );
    if (involvesETH) {
      const ethAmount = token0.address === ETH_ADDRESS ? new BigNumber(fee0).multipliedBy(amount0Min.toString()).toFixed(0, BigNumber.ROUND_DOWN) : new BigNumber(fee1).multipliedBy(amount1Min.toString()).toFixed(0, BigNumber.ROUND_DOWN);
      const token = token0.address === ETH_ADDRESS ? token1 : token0;
      const tokenAmount = token0.address === ETH_ADDRESS ? new BigNumber(fee1).multipliedBy(amount1Min.toString()).toFixed(0, BigNumber.ROUND_DOWN) : new BigNumber(fee0).multipliedBy(amount0Min.toString()).toFixed(0, BigNumber.ROUND_DOWN);
      calldatas.push(
        this.contract.interface.encodeFunctionData("unwrapWMNT", [ethAmount, account])
      );
      calldatas.push(
        this.contract.interface.encodeFunctionData("sweepToken", [token.erc20Address(), tokenAmount, account])
      );
    }
    if (new BigNumber(rate).comparedTo("100") >= 0) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("burn", [tokenId])
      );
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas]);
  }
}
