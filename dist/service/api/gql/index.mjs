import { gql } from "graphql-request";
export const TokenPriceGQL = gql`
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
export const AllV3TicksGQL = gql`
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
export const FeeTierDistributionGQL = gql`
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
export const PositionHistoryGQL = gql`
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
export const UserStakeInfosGQL = gql`
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
export const QueryIdoPoolInfosGQL = gql`
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
export const QueryTokenATHPriceHistory = gql`
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
export const QueryIDOUserDepositedLogsByPool = gql`
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
export const QueryIDOPoolInfo = gql`query poolInfo($id:String!) {
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
export function QueryBlockTimeGQL(timestamps) {
  return gql`query blocks {
        ${timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
              number
            }`;
  })}
    }`;
}
export function QueryBlockMeta() {
  return gql`query blocks {
      _meta {
          block {
              number
              hash
              timestamp
          }

      }
    }`;
}
export const topPoolsGQL = gql`
    query topPools {
        pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
        }
    }
`;
export function poolsBulkGQL(block, pools) {
  let poolString = `[`;
  pools.forEach((address) => {
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
  return gql`
        ${queryString}
    `;
}
export const topTokensGQL = gql`
    query topPools {
      tokens(first: 1000,where:{totalValueLockedUSD_gt:0 } ) {
        id
        totalValueLockedUSD
      }
    }
`;
export function tokensBulkGQL(block, tokens) {
  let tokenString = `[`;
  tokens.forEach((address) => {
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
  return gql`
        ${queryString}
    `;
}
export function ethPricesGQL(block24, block48, blockWeek) {
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
  return gql`
        ${queryString}
    `;
}
export function globalDataGQL(block) {
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
  return gql`
        ${queryString}
    `;
}
export const globalChartGQL = gql`
    query pancakeDayDatas($startTime: Int!, $skip: Int!) {
        pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
            id
            date
            volumeUSD
            tvlUSD
        }
    }
`;
export const globalTransactionsGQL = gql`
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
