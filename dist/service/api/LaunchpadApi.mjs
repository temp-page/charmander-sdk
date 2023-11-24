import BigNumber from "bignumber.js";
import get from "lodash/get";
import {
  IDODepositInfo,
  IDOPool,
  IDOPoolDetail,
  IDOUserDepositInfo,
  IdoPoolStatistic,
  LaunchpadStakeDetail
} from "../vo/index.mjs";
import { ERC20, IdoPoolAbi, InsurancePoolAbi, StakingPoolAbi } from "../abi/index.mjs";
import { BasicException } from "../../BasicException.mjs";
import { CacheKey, INVALID_ADDRESS, Trace, isNumber } from "../tool/index.mjs";
import {
  QueryIDOPoolInfo,
  QueryIDOUserDepositedLogsByPool,
  QueryIdoPoolInfosGQL,
  QueryTokenATHPriceHistory,
  UserStakeInfosGQL
} from "./gql/index.mjs";
import { BASE_API } from "./BaseApi.mjs";
const PriceCache = /* @__PURE__ */ new Map();
const TokenLogoCache = /* @__PURE__ */ new Map();
@CacheKey("LaunchpadApi")
export class LaunchpadApi {
  baseApi;
  constructor() {
    this.baseApi = BASE_API;
  }
  async getUserStakeInfoByGql(user, token) {
    const res = await this.baseApi.launchpadGraph(
      UserStakeInfosGQL,
      {
        user: user.toLowerCase(),
        token: token.toLowerCase()
      }
    );
    return res.stakeInfos;
  }
  async staking(account = "") {
    const userAddress = account || INVALID_ADDRESS;
    const tokenAddress = this.baseApi.address().launchpadStakeToken;
    const launchpadStakePoolAddress = this.baseApi.address().launchpadStakePool;
    const stakingPoolAbi = this.baseApi.connectInfo().create(StakingPoolAbi);
    const [
      stakeInfos,
      batchGetTokens,
      [
        {
          getScoreByTier,
          getUserScore
        }
      ]
    ] = await Promise.all([
      this.getUserStakeInfoByGql(userAddress, tokenAddress),
      this.baseApi.address().getApi().tokenMangerApi().batchGetTokens([tokenAddress]),
      this.baseApi.connectInfo().multiCall().call(
        {
          getScoreByTier: stakingPoolAbi.mulContract.getScoreByTier("1"),
          getUserScore: stakingPoolAbi.mulContract.getUserScore(userAddress)
        }
      )
    ]);
    const stakeTokenInfo = batchGetTokens[tokenAddress];
    const { [stakeTokenInfo.address]: balanceAndAllowances } = await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
      userAddress,
      launchpadStakePoolAddress,
      [stakeTokenInfo]
    );
    const unixDate = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    const stakeDetail = new LaunchpadStakeDetail();
    stakeDetail.token = stakeTokenInfo;
    stakeDetail.balance = balanceAndAllowances;
    stakeDetail.minInputAmount = BigNumber.max(new BigNumber(getScoreByTier).minus(getUserScore).dividedBy(1e8), new BigNumber(1).div(1e8)).toFixed();
    const unStakeInfo = stakeInfos.filter((it) => new BigNumber(it.unlockTime).comparedTo(unixDate) <= 0);
    const lockStakeInfo = stakeInfos.filter((it) => new BigNumber(it.unlockTime).comparedTo(unixDate) > 0);
    stakeDetail.unStakeAmount = unStakeInfo.map((it) => new BigNumber(it.tokenIdOrAmount).div(10 ** stakeTokenInfo.decimals).toFixed()).reduce((pre, cur) => new BigNumber(pre).plus(cur).toFixed(), "0");
    stakeDetail.lockAmount = lockStakeInfo.map((it) => new BigNumber(it.tokenIdOrAmount).div(10 ** stakeTokenInfo.decimals).toFixed()).reduce((pre, cur) => new BigNumber(pre).plus(cur).toFixed(), "0");
    stakeDetail.stake = async (connect, amount) => {
      const realAmount = new BigNumber(amount).multipliedBy(10 ** stakeDetail.token.decimals).toFixed(0, BigNumber.ROUND_DOWN);
      return connect.create(StakingPoolAbi).stake(stakeDetail.token.address, realAmount);
    };
    stakeDetail.unStake = async (connect) => {
      const ids = unStakeInfo.map((it) => it.id).slice(0, 10);
      if (ids.length === 0)
        throw new BasicException("No unstake tokenAddress");
      return connect.create(StakingPoolAbi).unstake(ids);
    };
    return stakeDetail;
  }
  async getTokenPriceHistory(token) {
    const priceCache = PriceCache.get(token.toLowerCase());
    if (priceCache && Date.now() - priceCache.time < 1e3 * 60 * 5)
      return priceCache.price;
    const { tokenDayDatas } = await this.baseApi.exchangeGraph(
      QueryTokenATHPriceHistory,
      {
        token: token.toLowerCase()
      }
    );
    const tokenPrice = {
      ath: "0",
      last: "0"
    };
    tokenPrice.ath = tokenDayDatas.map((it) => it.high).reduce((a, b) => new BigNumber(a).gt(b) ? a : b, "0");
    tokenPrice.last = get(tokenDayDatas, "[0].priceUSD", "0");
    PriceCache.set(token.toLowerCase(), {
      time: Date.now(),
      price: tokenPrice
    });
    return tokenPrice;
  }
  async fetchPools() {
    const { lauchpad_infos: lauchpadInfos } = await this.baseApi.request(
      `${this.baseApi.address().baseApiUrl}/lauchpad/api/listalllauchpad?page=0&size=1000`,
      "get",
      {}
    );
    lauchpadInfos.forEach((it) => {
      if (it.raising_token && it.raising_token_icon)
        TokenLogoCache.set(it.raising_token.toLowerCase(), it.raising_token_icon);
      if (it.selling_token && it.selling_token_icon)
        TokenLogoCache.set(it.selling_token.toLowerCase(), it.selling_token_icon);
    });
    return lauchpadInfos;
  }
  async getTokenPrice(address) {
    return (await this.getTokenPriceHistory(address)).last;
  }
  async getAllTimeHighPrice(address) {
    return (await this.getTokenPriceHistory(address)).ath;
  }
  async getPools() {
    const [res, launchpadInfos] = await Promise.all([
      this.baseApi.launchpadGraph(QueryIdoPoolInfosGQL, {}),
      this.fetchPools()
    ]);
    const allProject = res.idoPools.map((item) => {
      const idoPool = new IDOPool();
      idoPool.id = item.id;
      idoPool.raisingTokenPrice = "0";
      idoPool.sellingTokenATHPrice = "0";
      idoPool.raisingTokenATHPrice = "0";
      idoPool.raisingAmount = new BigNumber(item.totalRaised).plus(item.totalExtraDeposit).toFixed();
      idoPool.expectedRaisingAmount = "0";
      idoPool.publicSalePrice = item.publicSalePrice;
      idoPool.presalePrice = item.presalePrice;
      idoPool.raisingTokenInfo = item.raisingTokenInfo;
      idoPool.sellingTokenInfo = item.sellingTokenInfo;
      idoPool.raisingTokenLogo = TokenLogoCache.get(idoPool.raisingTokenInfo.id.toLowerCase());
      idoPool.sellingTokenLogo = TokenLogoCache.get(idoPool.sellingTokenInfo.id.toLowerCase());
      idoPool.roi = "0";
      idoPool.presaleAndEnrollStartTime = Number.parseInt(item.presaleAndEnrollStartTime, 10);
      idoPool.soldOut = Number.parseInt(item.claimStartTime, 10) * 1e3 < Date.now();
      return idoPool;
    });
    const idoPoolStatistics = new IdoPoolStatistic();
    idoPoolStatistics.fundedProjects = new BigNumber(allProject.length).toFixed();
    idoPoolStatistics.totalParticipants = get(res, "idoPoolStatistics.totalParticipants", "0");
    idoPoolStatistics.raisedCapital = "0";
    await Promise.all(
      Array.from(/* @__PURE__ */ new Set([...allProject.map((p) => p.raisingTokenInfo.id), ...allProject.map((p) => p.raisingTokenInfo.id)])).map((it) => this.getTokenPrice(it))
    );
    const tokenPrices = await Promise.all(allProject.map((it) => this.getTokenPrice(it.raisingTokenInfo.id)));
    const athTokenPrices = await Promise.all(allProject.map((it) => this.getAllTimeHighPrice(it.sellingTokenInfo.id)));
    const athRaisingTokenPrices = await Promise.all(allProject.map((it) => this.getAllTimeHighPrice(it.raisingTokenInfo.id)));
    for (let i = 0; i < allProject.length; i++) {
      const it = allProject[i];
      const price = tokenPrices[i];
      const athPrice = athTokenPrices[i];
      const athRaisingTokenPrice = athRaisingTokenPrices[i];
      it.raisingTokenPrice = price;
      it.sellingTokenATHPrice = athPrice;
      it.raisingTokenATHPrice = athRaisingTokenPrice;
      const idoPrice = BigNumber.min(it.publicSalePrice, it.presalePrice).multipliedBy(it.raisingTokenPrice);
      if (idoPrice.comparedTo(0) === 0)
        it.roi = "0";
      else
        it.roi = new BigNumber(athPrice).div(idoPrice).toFixed(2, BigNumber.ROUND_DOWN);
      if (it.presaleAndEnrollStartTime < Date.now() / 1e3) {
        idoPoolStatistics.raisedCapital = new BigNumber(idoPoolStatistics.raisedCapital).plus(new BigNumber(it.raisingAmount).multipliedBy(new BigNumber(it.raisingTokenATHPrice))).toFixed();
      } else {
        const launchpadInfo = launchpadInfos.find((info) => info.selling_token.toLowerCase() === it.sellingTokenInfo.id.toLowerCase());
        if (launchpadInfo)
          it.expectedRaisingAmount = launchpadInfo.total_raise;
      }
    }
    const poolInfo = {
      idoPoolStatistics,
      allProject,
      upcomingProjects: Array.from(allProject).filter((it) => it.presaleAndEnrollStartTime > Date.now() / 1e3),
      comingProjects: Array.from(allProject).filter((it) => it.presaleAndEnrollStartTime < Date.now() / 1e3).sort((a, b) => {
        const comparedTo = new BigNumber(a.soldOut ? 1 : 0).comparedTo(new BigNumber(b.soldOut ? 1 : 0));
        if (comparedTo !== 0)
          return comparedTo;
        return b.presaleAndEnrollStartTime - a.presaleAndEnrollStartTime;
      })
    };
    Trace.debug("poolInfo", poolInfo);
    return poolInfo;
  }
  async getUserDepositedLogsByPool(user, pool) {
    const res = await this.baseApi.launchpadGraph(
      QueryIDOUserDepositedLogsByPool,
      {
        user: user.toLowerCase(),
        pool: pool.toLowerCase()
      }
    );
    const userDepositInfo = new IDOUserDepositInfo();
    userDepositInfo.refund = res.idoPoolClaimedLogs.map((it) => it.refund).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.extraDeposit = res.idoPoolPublicSaleDepositedLogs.map((it) => it.extraDeposit).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.presaleQuote = res.idoPoolPresaleDepositedLogs.map((it) => it.buyQuota).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.presaleBuyInsurance = res.idoPoolPresaleDepositedLogs.map((it) => it.buyInsurance)[0] || false;
    userDepositInfo.publicSaleQuota = res.idoPoolPublicSaleDepositedLogs.map((it) => it.buyQuota).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.publicSaleBuyInsurance = res.idoPoolPublicSaleDepositedLogs.map((it) => it.buyInsurance)[0] || false;
    return userDepositInfo;
  }
  async getPoolInfoByGql(id) {
    const [res, launchpadInfos] = await Promise.all([
      this.baseApi.launchpadGraph(QueryIDOPoolInfo, {
        id
      }),
      this.fetchPools()
    ]);
    const poolInfo = res.idoPool;
    poolInfo.raisingTokenLogo = TokenLogoCache.get(poolInfo.raisingTokenInfo.id.toLowerCase());
    poolInfo.sellingTokenLogo = TokenLogoCache.get(poolInfo.sellingTokenInfo.id.toLowerCase());
    const launchpadInfo = launchpadInfos.find((info) => info.selling_token.toLowerCase() === poolInfo.sellingTokenInfo.id.toLowerCase());
    return {
      poolInfo,
      launchpadInfo
    };
  }
  async poolDetail(pool, account = "") {
    const userAddress = account || INVALID_ADDRESS;
    const [{
      poolInfo,
      launchpadInfo
    }, userDepositInfo] = await Promise.all([
      this.getPoolInfoByGql(pool.toLowerCase()),
      this.getUserDepositedLogsByPool(userAddress.toLowerCase(), pool.toLowerCase())
    ]);
    const insurancePool = this.baseApi.connectInfo().create(InsurancePoolAbi);
    const idoPool = this.baseApi.connectInfo().create(IdoPoolAbi, pool);
    const stakingPool = this.baseApi.connectInfo().create(StakingPoolAbi);
    const multiCall = this.baseApi.connectInfo().multiCall();
    const tokenIns = this.baseApi.connectInfo().create(ERC20, poolInfo.sellingTokenInfo.id);
    const [
      insurancePoolData,
      idoPoolData,
      { getCurrentBlockTimestamp },
      { getUserTier },
      { totalSupply }
    ] = await multiCall.call({
      isRegisteredPool: insurancePool.mulContract.isRegisteredPool(pool),
      getIdoPoolInfo: insurancePool.mulContract.getIdoPoolInfo(pool)
    }, {
      getUserIDO: idoPool.mulContract.getUserIDO(pool),
      totalRaised: idoPool.mulContract.totalRaised(),
      getPresaleQuota: idoPool.mulContract.getPresaleQuota(userAddress),
      totalBuyedByUsers: idoPool.mulContract.totalBuyedByUsers(),
      totalSupply: idoPool.mulContract.totalSupply(),
      insuranceFeeRate: idoPool.mulContract.insuranceFeeRate(),
      getPublicSaleQuota: idoPool.mulContract.getPublicSaleQuota(userAddress),
      isEnrolled: idoPool.mulContract.isEnrolled(userAddress),
      presaleDeposited: idoPool.mulContract.presaleDeposited(userAddress),
      publicSaleDeposited: idoPool.mulContract.publicSaleDeposited(userAddress),
      totalExtraDeposit: idoPool.mulContract.totalExtraDeposit(),
      claimable: idoPool.mulContract.claimable(userAddress),
      refundable: idoPool.mulContract.refundable(userAddress)
    }, {
      getCurrentBlockTimestamp: multiCall.mulContract.getCurrentBlockTimestamp()
    }, {
      getUserTier: stakingPool.mulContract.getUserTier(userAddress)
    }, {
      totalSupply: tokenIns.mulContract.totalSupply()
    });
    const unixTime = Number.parseInt(getCurrentBlockTimestamp);
    const depositInfo = new IDODepositInfo();
    const raisingTokenDiv = 10 ** Number.parseInt(poolInfo.raisingTokenInfo.decimals, 10);
    const sellingTokenDiv = 10 ** Number.parseInt(poolInfo.sellingTokenInfo.decimals, 10);
    const { [poolInfo.raisingTokenInfo.id]: token } = await this.baseApi.address().getApi().tokenMangerApi().batchGetTokens([poolInfo.raisingTokenInfo.id]);
    depositInfo.raisingBalance = (await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
      userAddress,
      pool,
      [token]
    ))[token.address];
    depositInfo.whiteList = {
      type: "whiteList",
      canDeposit: Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) <= unixTime && Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) >= unixTime && !idoPoolData.presaleDeposited,
      // 是否质押
      deposited: idoPoolData.presaleDeposited,
      // 白名单可用额度
      quota: new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).toFixed(),
      raising: new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed(),
      price: poolInfo.presalePrice,
      depositAmount: new BigNumber(userDepositInfo.presaleQuote).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed(),
      maxDepositAmount: new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed(),
      insurance: userDepositInfo.presaleBuyInsurance,
      countdownEndTime: 0,
      depositStatus: "disabled",
      payCompensation: "0",
      payCompensationState: "hidden",
      payCompensationDate: 0,
      insuranceId: ""
    };
    depositInfo.publicSale = {
      type: "publicSale",
      canDeposit: Number.parseInt(poolInfo.publicSaleDepositStartTime, 10) <= unixTime && Number.parseInt(poolInfo.publicSaleDepositEndTime, 10) >= unixTime && !idoPoolData.publicSaleDeposited,
      deposited: idoPoolData.publicSaleDeposited,
      quota: new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).toFixed(),
      raising: new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(),
      price: poolInfo.publicSalePrice,
      depositAmount: new BigNumber(userDepositInfo.publicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(),
      maxDepositAmount: new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(),
      extraDepositAmount: new BigNumber(userDepositInfo.extraDeposit).dividedBy(raisingTokenDiv).toFixed(),
      insurance: userDepositInfo.publicSaleBuyInsurance,
      countdownEndTime: 0,
      depositStatus: "disabled",
      payCompensation: "0",
      payCompensationState: "hidden",
      payCompensationDate: 0,
      insuranceId: ""
    };
    depositInfo.totalRaised = new BigNumber(poolInfo.totalRaised).toFixed();
    depositInfo.maxRaisingAmount = new BigNumber(poolInfo.publicQuota).multipliedBy(poolInfo.publicSalePrice).plus(
      new BigNumber(poolInfo.whiteListQuota).multipliedBy(poolInfo.presalePrice)
    ).toFixed();
    depositInfo.totalBuyByUsers = new BigNumber(idoPoolData.totalBuyedByUsers).dividedBy(sellingTokenDiv).toFixed();
    depositInfo.totalExtraDeposit = new BigNumber(idoPoolData.totalExtraDeposit).dividedBy(raisingTokenDiv).toFixed();
    depositInfo.totalSupply = new BigNumber(totalSupply).dividedBy(sellingTokenDiv).toFixed();
    depositInfo.avgPrice = new BigNumber(insurancePoolData.getIdoPoolInfo.avgPrice).dividedBy(raisingTokenDiv).toFixed();
    depositInfo.needToPay = new BigNumber(insurancePoolData.getIdoPoolInfo.needToPay).toFixed();
    depositInfo.insuranceFeeRate = new BigNumber(idoPoolData.insuranceFeeRate).dividedBy(100).toFixed();
    depositInfo.userTier = new BigNumber(getUserTier).toNumber();
    depositInfo.needUserTier = 1;
    depositInfo.checkUserTier = depositInfo.userTier >= depositInfo.needUserTier;
    depositInfo.canEnroll = !idoPoolData.isEnrolled && depositInfo.checkUserTier && Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) <= unixTime && Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) >= unixTime;
    depositInfo.isEnroll = idoPoolData.isEnrolled;
    depositInfo.claimableAmount = new BigNumber(idoPoolData.claimable).dividedBy(sellingTokenDiv).toFixed();
    depositInfo.extraDepositRefund = new BigNumber(idoPoolData.refundable[0]).dividedBy(raisingTokenDiv).toFixed();
    if (new BigNumber(idoPoolData.refundable[1]).comparedTo("0") > 0) {
      depositInfo.publicSale.extraDepositAmount = new BigNumber(idoPoolData.refundable[1]).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed();
    } else if (new BigNumber(userDepositInfo.refund).comparedTo("0") > 0) {
      const extraDepositAmount = new BigNumber(userDepositInfo.extraDeposit).minus(userDepositInfo.refund).div(raisingTokenDiv).toFixed();
      depositInfo.publicSale.extraDepositAmount = extraDepositAmount;
    }
    if (depositInfo.whiteList.canDeposit) {
      depositInfo.currentDeposit = depositInfo.whiteList;
      depositInfo.depositMaxInput = new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed();
      depositInfo.maxExtraDeposit = "0";
      depositInfo.triggerExtraDeposit = "0";
    }
    if (depositInfo.publicSale.canDeposit) {
      depositInfo.currentDeposit = depositInfo.publicSale;
      depositInfo.depositMaxInput = new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(Number.parseInt(poolInfo.raisingTokenInfo.decimals, 10), BigNumber.ROUND_DOWN);
      depositInfo.maxExtraDeposit = new BigNumber(depositInfo.depositMaxInput).multipliedBy(3).toFixed(Number.parseInt(poolInfo.raisingTokenInfo.decimals, 10), BigNumber.ROUND_DOWN);
      depositInfo.triggerExtraDeposit = depositInfo.depositMaxInput;
    }
    depositInfo.claimLoss = (connect, insuranceId) => {
      return connect.create(InsurancePoolAbi).claimLoss(insuranceId);
    };
    depositInfo.enroll = async (connect) => {
      return connect.create(IdoPoolAbi, pool).enroll();
    };
    depositInfo.claim = async (connect) => {
      return connect.create(IdoPoolAbi, pool).claim();
    };
    depositInfo.calculateInsuranceFee = (depositAmount) => {
      return new BigNumber(depositAmount).multipliedBy(depositInfo.insuranceFeeRate).toFixed(0, BigNumber.ROUND_DOWN);
    };
    depositInfo.calculateQuote = (depositAmount) => {
      let depositAmountBN = new BigNumber(depositAmount);
      if (!isNumber(depositAmount))
        depositAmountBN = new BigNumber("0");
      if (!depositInfo.currentDeposit || !depositInfo.currentDeposit.canDeposit)
        return "0";
      if (depositInfo.currentDeposit.type === "whiteList")
        return depositAmountBN.dividedBy(poolInfo.presalePrice).toFixed(Number.parseInt(poolInfo.sellingTokenInfo.decimals), BigNumber.ROUND_DOWN);
      return depositAmountBN.dividedBy(poolInfo.publicSalePrice).toFixed(Number.parseInt(poolInfo.sellingTokenInfo.decimals), BigNumber.ROUND_DOWN);
    };
    depositInfo.deposit = async (connect, buyInsurance, depositAmount, extraDeposit) => {
      if (!depositInfo.currentDeposit.canDeposit)
        throw new Error("not in deposit time");
      const eqMax = new BigNumber(depositAmount).comparedTo(depositInfo.depositMaxInput) === 0;
      if (depositInfo.currentDeposit.type === "whiteList") {
        let buyQuota2 = new BigNumber(depositAmount).dividedBy(poolInfo.presalePrice).multipliedBy(sellingTokenDiv).toFixed(0, BigNumber.ROUND_DOWN);
        if (eqMax)
          buyQuota2 = new BigNumber(idoPoolData.getPresaleQuota.toString()).toFixed(0, BigNumber.ROUND_DOWN);
        return connect.create(IdoPoolAbi, pool).presaleDeposit(buyQuota2, buyInsurance);
      }
      let buyQuota = new BigNumber(depositAmount).dividedBy(poolInfo.publicSalePrice).multipliedBy(sellingTokenDiv).toFixed(0, BigNumber.ROUND_DOWN);
      if (eqMax)
        buyQuota = new BigNumber(idoPoolData.getPublicSaleQuota.toString()).toFixed(0, BigNumber.ROUND_DOWN);
      const extraDepositReal = new BigNumber(extraDeposit || "0").multipliedBy(raisingTokenDiv).toFixed(0, BigNumber.ROUND_DOWN);
      return connect.create(IdoPoolAbi, pool).publicSaleDeposit(buyInsurance, buyQuota, extraDepositReal);
    };
    if (new BigNumber(poolInfo.claimStartTime).comparedTo(unixTime) < 0) {
      if (depositInfo.whiteList.depositAmount === "0" && depositInfo.publicSale.depositAmount === "0")
        depositInfo.timeState = "Finished";
      else
        depositInfo.timeState = "Claiming";
      depositInfo.claimStatus = "enable";
      depositInfo.whiteList.countdownEndTime = 0;
      depositInfo.publicSale.countdownEndTime = 0;
    } else {
      depositInfo.timeState = "Deposit";
      depositInfo.whiteList.depositStatus = "disabled";
      depositInfo.publicSale.depositStatus = "disabled";
      depositInfo.whiteList.countdownEndTime = 0;
      depositInfo.publicSale.countdownEndTime = 0;
      if (Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) <= unixTime && Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) >= unixTime) {
        if (!idoPoolData.presaleDeposited && Number.parseFloat(depositInfo.whiteList.maxDepositAmount) > 0)
          depositInfo.whiteList.depositStatus = "enable";
      } else if (Number.parseInt(poolInfo.publicSaleDepositStartTime, 10) <= unixTime && Number.parseInt(poolInfo.publicSaleDepositEndTime, 10) >= unixTime) {
        if (Number.parseFloat(depositInfo.publicSale.depositAmount) > 0 || Number.parseFloat(depositInfo.whiteList.depositAmount) > 0 || Number.parseFloat(depositInfo.publicSale.maxDepositAmount) > Number.parseFloat(depositInfo.publicSale.depositAmount)) {
          if (!idoPoolData.publicSaleDeposited && idoPoolData.isEnrolled && Number.parseFloat(depositInfo.publicSale.maxDepositAmount) > Number.parseFloat(depositInfo.publicSale.depositAmount))
            depositInfo.publicSale.depositStatus = "enable";
        } else {
          depositInfo.timeState = "Finished";
        }
      }
      if (Number.parseInt(poolInfo.claimStartTime, 10) > unixTime) {
        depositInfo.whiteList.countdownEndTime = Number.parseInt(poolInfo.claimStartTime, 10);
        depositInfo.publicSale.countdownEndTime = Number.parseInt(poolInfo.claimStartTime, 10);
      }
      if (Number.parseInt(poolInfo.publicSaleDepositEndTime, 10) > unixTime)
        depositInfo.publicSale.countdownEndTime = Number.parseInt(poolInfo.publicSaleDepositEndTime, 10);
      if (Number.parseInt(poolInfo.publicSaleDepositStartTime, 10) > unixTime)
        depositInfo.publicSale.countdownEndTime = Number.parseInt(poolInfo.publicSaleDepositStartTime, 10);
      if (Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) > unixTime)
        depositInfo.whiteList.countdownEndTime = Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10);
      if (Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) > unixTime)
        depositInfo.whiteList.countdownEndTime = Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10);
    }
    const idoByUser = idoPoolData.getUserIDO;
    if (depositInfo.claimStatus === "enable") {
      if (new BigNumber(depositInfo.avgPrice).comparedTo("0") > 0 && new BigNumber(depositInfo.needToPay).comparedTo("0") > 0) {
        const insuranceDetails = await multiCall.call(
          idoByUser.insuranceIds.map((it) => {
            return {
              getInsuranceDetail: insurancePool.mulContract.getInsuranceDetail(it)
            };
          })
        );
        const handleInsuranceDetails = (depositData, insuranceDetail, insuranceId) => {
          const result = insuranceDetail.getInsuranceDetail;
          const payAmount = new BigNumber(result.buyQuota.toString()).div(sellingTokenDiv).multipliedBy(
            new BigNumber(result.price.toString()).div(raisingTokenDiv).minus(depositInfo.avgPrice)
          ).toFixed();
          depositData.insuranceId = new BigNumber(insuranceId).toFixed();
          if (new BigNumber(payAmount).comparedTo("0") <= 0) {
            depositData.payCompensationState = "noClaim";
          } else {
            depositData.payCompensation = payAmount;
            depositData.payCompensationState = result.lossClaimed ? "received" : "claim";
          }
        };
        if (depositInfo.whiteList.insurance && depositInfo.publicSale.insurance) {
          handleInsuranceDetails(depositInfo.whiteList, insuranceDetails[0], idoByUser.insuranceIds[0]);
          handleInsuranceDetails(depositInfo.publicSale, insuranceDetails[1], idoByUser.insuranceIds[1]);
        } else if (depositInfo.whiteList.insurance) {
          handleInsuranceDetails(depositInfo.whiteList, insuranceDetails[0], idoByUser.insuranceIds[0]);
        } else if (depositInfo.publicSale.insurance) {
          handleInsuranceDetails(depositInfo.publicSale, insuranceDetails[0], idoByUser.insuranceIds[0]);
        }
      } else {
        const time = get(launchpadInfo, "redemption_time", "0");
        let state = "disabled";
        const payCompensationDate = +time + 60 * 60 * 24 * 7;
        if (new BigNumber(time).comparedTo("0") > 0)
          state = "wait";
        if (depositInfo.whiteList.insurance) {
          depositInfo.whiteList.payCompensationState = state;
          depositInfo.whiteList.payCompensationDate = payCompensationDate;
        }
        if (depositInfo.publicSale.insurance) {
          depositInfo.publicSale.payCompensationState = state;
          depositInfo.publicSale.payCompensationDate = payCompensationDate;
        }
      }
    }
    const raisingTokenPrice = await this.getTokenPrice(poolInfo.raisingTokenInfo.id);
    const poolDetail = new IDOPoolDetail();
    poolDetail.tier = depositInfo.userTier;
    poolDetail.depositInfo = depositInfo;
    poolDetail.pool = poolInfo;
    poolDetail.insurance = insurancePoolData.isRegisteredPool;
    poolDetail.whitelistSaleQuota = new BigNumber(idoPoolData.getPresaleQuota.toString()).dividedBy(sellingTokenDiv).toFixed();
    poolDetail.whitelistAllocationTokenAmount = poolInfo.whiteListQuota;
    poolDetail.publicAllocation = BigNumber.max(new BigNumber(get(launchpadInfo, "pool_size", "0")).minus(poolInfo.whiteListQuota), "0").toFixed();
    poolDetail.launchpadTotalRaise = new BigNumber(idoPoolData.totalRaised.toString()).dividedBy(raisingTokenDiv).multipliedBy(raisingTokenPrice).toFixed();
    poolDetail.tokenTotalSupply = new BigNumber(idoPoolData.totalSupply.toString()).dividedBy(sellingTokenDiv).toFixed();
    if (launchpadInfo) {
      poolDetail.poolSize = get(launchpadInfo, "pool_size", "");
      poolDetail.initialMarketCap = get(launchpadInfo, "initial_market_cap", "");
      poolDetail.FDV = get(launchpadInfo, "fdv", "");
      poolDetail.tags = get(launchpadInfo, "selling_token_tag", "");
      poolDetail.whitelistStakingTierRequired = get(launchpadInfo, "whitelist_staking_tier_required", "");
      poolDetail.whitelistRegistrationRequired = get(launchpadInfo, "whitelist_registration_required", "");
      poolDetail.whitelistDistribution = get(launchpadInfo, "whitelist_distribution", "");
      poolDetail.publicStakingTierRequired = get(launchpadInfo, "public_registration_required", "");
      poolDetail.publicRegistrationRequired = get(launchpadInfo, "public_registration_required", "");
      poolDetail.publicDistribution = get(launchpadInfo, "public_distribution", "");
      poolDetail.introduction = get(launchpadInfo, "introduction", "");
      poolDetail.shares = get(launchpadInfo, "shares", []).filter((it) => it.icon);
    } else {
      poolDetail.poolSize = "";
      poolDetail.initialMarketCap = "";
      poolDetail.FDV = "";
      poolDetail.whitelistStakingTierRequired = "No";
      poolDetail.whitelistRegistrationRequired = "No";
      poolDetail.whitelistDistribution = "";
      poolDetail.publicStakingTierRequired = "Yes";
      poolDetail.publicRegistrationRequired = "Yes";
      poolDetail.publicDistribution = "";
      poolDetail.introduction = "";
      poolDetail.shares = [];
    }
    return poolDetail;
  }
}
