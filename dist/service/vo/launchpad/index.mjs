export class LaunchpadStakeDetail {
  token;
  balance;
  minInputAmount;
  unStakeAmount;
  lockAmount;
  stake;
  unStake;
}
export class IdoPoolStatistic {
  /**
   * 总参与人数
   */
  totalParticipants;
  /**
   * 总募资项目数
   */
  fundedProjects;
  /**
   *  总募资金额 USD
   */
  raisedCapital;
}
export class IDOPool {
  /**
   * 池子ID
   */
  id;
  /**
   * 募资金额
   */
  raisingAmount;
  expectedRaisingAmount;
  /**
   * 募资代币的价格
   */
  raisingTokenPrice;
  /**
   * 募资代币的历史最高价格
   */
  raisingTokenATHPrice;
  /**
   * 出售代币的历史最高价格
   */
  sellingTokenATHPrice;
  /**
   * 预售价格
   */
  publicSalePrice;
  /**
   * 白名单价格
   */
  presalePrice;
  /**
   * 募资代币
   */
  raisingTokenInfo;
  raisingTokenLogo;
  /**
   * 出售代币
   */
  sellingTokenInfo;
  sellingTokenLogo;
  /**
   * ROI
   */
  roi;
  /**
   * 募资开始时间 (秒)
   */
  presaleAndEnrollStartTime;
  soldOut;
}
export class IDOPoolInfo {
  id;
  timestamp;
  fundraiser;
  raisingToken;
  raisingTokenInfo;
  raisingTokenLogo;
  sellingTokenLogo;
  sellingTokenInfo;
  totalSupply;
  presalePrice;
  publicSalePrice;
  presaleAndEnrollStartTime;
  presaleAndEnrollEndTime;
  presaleAndEnrollPeriod;
  publicSaleDepositStartTime;
  publicSaleDepositEndTime;
  publicSaleDepositPeriod;
  claimStartTime;
  unlockTillTime;
  lockPeriod;
  tgeUnlockRatio;
  insuranceFeeRate;
  platformCommissionFeeRate;
  enrollCount;
  whiteListQuota;
  whiteListCount;
  publicQuota;
  publicCount;
  totalRaised;
  totalExtraDeposit;
}
export class ShareInfo {
  id;
  type;
  url;
}
export class IDODepositInfo {
  timeState;
  claimStatus;
  // 是否有保险
  insurance;
  // 待领取数量
  claimableAmount;
  // 额外买入退款
  extraDepositRefund;
  // 总的额外买入
  totalExtraDeposit;
  whiteList;
  publicSale;
  currentDeposit;
  // 最大销售量
  totalSupply;
  avgPrice;
  needToPay;
  // 最多可筹集资金（raising token）
  maxRaisingAmount;
  // 已筹集（raising token）
  totalRaised;
  // 保险费率
  insuranceFeeRate;
  // 余额
  raisingBalance;
  // 是否可以注册 , 等待倒计时，需要升级，可以注册，已注册，已过期
  // enrollState: 'wait' | 'needUpgrade' |  'enrollable' | 'enrolled'| 'Expired'
  canEnroll;
  checkUserTier;
  userTier;
  needUserTier;
  // 是否注册
  isEnroll;
  totalBuyByUsers;
  // 最大额外买入
  maxExtraDeposit;
  // 触发额外买入
  triggerExtraDeposit;
  // 质押最大输入
  depositMaxInput;
  claimLoss;
  enroll;
  claim;
  deposit;
  calculateInsuranceFee;
  calculateQuote;
}
export class IDOUserDepositInfo {
  publicSaleQuota;
  presaleQuote;
  extraDeposit;
  refund;
  publicSaleBuyInsurance;
  presaleBuyInsurance;
}
export class IDOPoolDetail {
  updateId = Date.now();
  pool;
  depositInfo;
  // 项目分享图标
  shares;
  // 池子保险是否显示
  insurance;
  // 等级
  tier;
  // Whitelist
  whitelistSaleQuota;
  whitelistAllocationTokenAmount;
  whitelistDistribution;
  whitelistStakingTierRequired;
  whitelistRegistrationRequired;
  // Project Sale
  publicAllocation;
  publicDistribution;
  publicStakingTierRequired;
  publicRegistrationRequired;
  introduction;
  // BOX
  tokenTotalSupply;
  launchpadTotalRaise;
  poolSize;
  initialMarketCap;
  FDV;
  tags;
}
