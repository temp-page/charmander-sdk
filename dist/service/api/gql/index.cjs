"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionHistoryGQL = exports.FeeTierDistributionGQL = exports.AllV3TicksGQL = void 0;
exports.QueryBlockMeta = QueryBlockMeta;
exports.QueryBlockTimeGQL = QueryBlockTimeGQL;
exports.UserStakeInfosGQL = exports.TokenPriceGQL = exports.QueryTokenATHPriceHistory = exports.QueryIdoPoolInfosGQL = exports.QueryIDOUserDepositedLogsByPool = exports.QueryIDOPoolInfo = void 0;
exports.ethPricesGQL = ethPricesGQL;
exports.globalChartGQL = void 0;
exports.globalDataGQL = globalDataGQL;
exports.globalTransactionsGQL = void 0;
exports.poolsBulkGQL = poolsBulkGQL;
exports.tokensBulkGQL = tokensBulkGQL;
exports.topTokensGQL = exports.topPoolsGQL = void 0;
var _graphqlRequest = require("graphql-request");
const TokenPriceGQL = exports.TokenPriceGQL = (0, _graphqlRequest.gql)`
    query b ($addresses:[String]) {
        bundles {
            ethPriceUSD
        }
        tokens(
            where: {id_in: $addresses}
        ) {
            id
            derivedETH
        }
    }

`;
const AllV3TicksGQL = exports.AllV3TicksGQL = (0, _graphqlRequest.gql)`
    query AllV3Ticks($poolAddress: String!, $lastTick: Int!, $pageSize: Int!) {
        ticks(
            first: $pageSize,
            where: {
                poolAddress: $poolAddress,
                tickIdx_gt: $lastTick,
            },
            orderBy: tickIdx
        ) {
            tick: tickIdx
            liquidityNet
            liquidityGross
        }
    }
`;
const FeeTierDistributionGQL = exports.FeeTierDistributionGQL = (0, _graphqlRequest.gql)`
    query FeeTierDistribution($token0: String!, $token1: String!) {
        _meta {
            block {
                number
            }
        }
        asToken0: pools(
            orderBy: totalValueLockedToken0
            orderDirection: desc
            where: { token0: $token0, token1: $token1 }
        ) {
            feeTier
            totalValueLockedToken0
            totalValueLockedToken1
        }
        asToken1: pools(
            orderBy: totalValueLockedToken0
            orderDirection: desc
            where: { token0: $token1, token1: $token0 }
        ) {
            feeTier
            totalValueLockedToken0
            totalValueLockedToken1
        }
    }
`;
const PositionHistoryGQL = exports.PositionHistoryGQL = (0, _graphqlRequest.gql)`
    query positionHistory($tokenId: String!) {
        positionSnapshots(where: { position: $tokenId }, orderBy: timestamp, orderDirection: desc, first: 30) {
            id
            transaction {
                mints(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                    id
                    timestamp
                    amount1
                    amount0
                    logIndex
                }
                burns(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                    id
                    timestamp
                    amount1
                    amount0
                    logIndex
                }
                collects(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                    id
                    timestamp
                    amount0
                    amount1
                    logIndex
                }
            }
        }
    }
`;
const UserStakeInfosGQL = exports.UserStakeInfosGQL = (0, _graphqlRequest.gql)`
    query stakeInfos($token:String!,$user:String!) {
        stakeInfos(where:{unStaked:false user:$user token:$token}){
            id
            user
            token
            tokenIdOrAmount
            unlockTime
            score
            unStaked

        }
    }
`;
const QueryIdoPoolInfosGQL = exports.QueryIdoPoolInfosGQL = (0, _graphqlRequest.gql)`
    query poolInfos {
        idoPoolStatistics(id: "idoPoolStatistics") {
            totalParticipants
            fundedProjects
        }
        idoPools(orderBy: block, orderDirection: desc) {
            id
            timestamp
            fundraiser
            raisingToken
            raisingTokenInfo {
                id
                name
                symbol
                decimals
            }
            sellingToken
            sellingTokenInfo {
                id
                name
                symbol
                decimals
            }
            totalSupply
            presalePrice
            publicSalePrice
            presaleAndEnrollStartTime
            presaleAndEnrollEndTime
            presaleAndEnrollPeriod
            publicSaleDepositStartTime
            publicSaleDepositEndTime
            publicSaleDepositPeriod
            claimStartTime
            unlockTillTime
            lockPeriod
            tgeUnlockRatio
            insuranceFeeRate
            platformCommissionFeeRate
            enrollCount
            totalBuy
            totalRaised
            totalExtraDeposit
            whiteListQuota
            whiteListCount
            publicQuota
            publicCount
        }
    }
`;
const QueryTokenATHPriceHistory = exports.QueryTokenATHPriceHistory = (0, _graphqlRequest.gql)`
    query tokenDayDatas($token:String!) {
        tokenDayDatas(
            orderBy: date
            orderDirection: desc
            first: 1000
            where: {token: $token}
        ) {
            date
            priceUSD
            high
        }
    }
`;
const QueryIDOUserDepositedLogsByPool = exports.QueryIDOUserDepositedLogsByPool = (0, _graphqlRequest.gql)`
    query userDepositedLogs($user:String!,$pool:String!) {
        idoPoolClaimedLogs(where:{user:$user pool:$pool refund_gt:0}){
            refund
        }
        idoPoolPresaleDepositedLogs(where:{user:$user pool:$pool}){
            buyQuota
            buyInsurance
        }
        idoPoolPublicSaleDepositedLogs(where:{user:$user pool:$pool}){
            buyInsurance
            buyQuota
            extraDeposit
        }
    }
`;
const QueryIDOPoolInfo = exports.QueryIDOPoolInfo = (0, _graphqlRequest.gql)`query poolInfo($id:String!) {
    idoPool(id:$id) {
        id
        timestamp
        fundraiser
        raisingToken
        raisingTokenInfo {
            id
            name
            symbol
            decimals
        }
        sellingToken
        sellingTokenInfo {
            id
            name
            symbol
            decimals
        }
        totalSupply
        presalePrice
        publicSalePrice
        presaleAndEnrollStartTime
        presaleAndEnrollEndTime
        presaleAndEnrollPeriod
        publicSaleDepositStartTime
        publicSaleDepositEndTime
        publicSaleDepositPeriod
        claimStartTime
        unlockTillTime
        lockPeriod
        tgeUnlockRatio
        insuranceFeeRate
        platformCommissionFeeRate
        enrollCount
        whiteListQuota
        whiteListCount
        publicQuota
        publicCount
        totalRaised
    }
}`;
function QueryBlockTimeGQL(timestamps) {
  return (0, _graphqlRequest.gql)`query blocks {
        ${timestamps.map(timestamp => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
              number
            }`;
  })}
    }`;
}
function QueryBlockMeta() {
  return (0, _graphqlRequest.gql)`query blocks {
      _meta {
          block {
              number
              hash
              timestamp
          }

      }
    }`;
}
const topPoolsGQL = exports.topPoolsGQL = (0, _graphqlRequest.gql)`
    query topPools {
        pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
        }
    }
`;
function poolsBulkGQL(block, pools) {
  let poolString = `[`;
  pools.forEach(address => {
    poolString = `${poolString}"${address}",`;
  });
  poolString += "]";
  const queryString = `
    query pools {
      pools(where: {id_in: ${poolString}},
     ${block ? `block: {number: ${block}} ,` : ``}
     ) {
        id
        feeTier
        liquidity
        sqrtPrice
        tick
        token0 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token1 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token0Price
        token1Price
        volumeUSD
        volumeToken0
        volumeToken1
        txCount
        totalValueLockedToken0
        totalValueLockedToken1
        totalValueLockedUSD
        feesUSD
        protocolFeesUSD
      }
      bundles(where: {id: "1"}) {
        ethPriceUSD
      }
    }
    `;
  return (0, _graphqlRequest.gql)`
        ${queryString}
    `;
}
const topTokensGQL = exports.topTokensGQL = (0, _graphqlRequest.gql)`
    query topPools {
      tokens(first: 1000,where:{totalValueLockedUSD_gt:0 } ) {
        id
        totalValueLockedUSD
      }
    }
`;
function tokensBulkGQL(block, tokens) {
  let tokenString = `[`;
  tokens.forEach(address => {
    tokenString = `${tokenString}"${address}",`;
  });
  tokenString += "]";
  const queryString = `
    query tokens {
      tokens(where: {id_in: ${tokenString}},
    ${block ? `block: {number: ${block}} ,` : ""}
     ) {
        id
        symbol
        name
        derivedETH
        volumeUSD
        volume
        txCount
        totalValueLocked
        feesUSD
        totalValueLockedUSD
      }
    }
    `;
  return (0, _graphqlRequest.gql)`
        ${queryString}
    `;
}
function ethPricesGQL(block24, block48, blockWeek) {
  const dayQueryString = block24 ? `oneDay: bundles(first: 1, block: { number: ${block24} }) {
      ethPriceUSD
    }` : "";
  const twoDayQueryString = block48 ? `twoDay: bundles(first: 1, block: { number: ${block48} }) {
      ethPriceUSD
    }` : "";
  const weekQueryString = blockWeek ? `oneWeek: bundles(first: 1, block: { number: ${blockWeek} }) {
      ethPriceUSD
    }` : "";
  const queryString = `
  query prices {
    current: bundles(first: 1) {
      ethPriceUSD
    }
    ${dayQueryString}
    ${twoDayQueryString}
    ${weekQueryString}
  }
`;
  return (0, _graphqlRequest.gql)`
        ${queryString}
    `;
}
function globalDataGQL(block) {
  const queryString = ` query magmaFactories {
      factories(
       ${block ? `block: { number: ${block}}` : ``}
       first: 1) {
        txCount
        totalVolumeUSD
        totalFeesUSD
        totalValueLockedUSD
        totalProtocolFeesUSD
      }
    }`;
  return (0, _graphqlRequest.gql)`
        ${queryString}
    `;
}
const globalChartGQL = exports.globalChartGQL = (0, _graphqlRequest.gql)`
    query pancakeDayDatas($startTime: Int!, $skip: Int!) {
        pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
            id
            date
            volumeUSD
            tvlUSD
        }
    }
`;
const globalTransactionsGQL = exports.globalTransactionsGQL = (0, _graphqlRequest.gql)`
    query transactions {
        mints(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            owner
            sender
            origin
            amount0
            amount1
            amountUSD
        }
        swaps(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            origin
            amount0
            amount1
            amountUSD
        }
        burns(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            owner
            origin
            amount0
            amount1
            amountUSD
        }
    }
`;