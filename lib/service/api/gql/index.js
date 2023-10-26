"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalTransactionsGQL = exports.globalChartGQL = exports.globalDataGQL = exports.ethPricesGQL = exports.tokensBulkGQL = exports.topTokensGQL = exports.poolsBulkGQL = exports.topPoolsGQL = exports.QueryBlockTimeGQL = exports.QueryIDOPoolInfo = exports.QueryIDOUserDepositedLogsByPool = exports.QueryTokenATHPriceHistory = exports.QueryIdoPoolInfosGQL = exports.UserStakeInfosGQL = exports.PositionHistoryGQL = exports.FeeTierDistributionGQL = exports.AllV3TicksGQL = exports.TokenPriceGQL = void 0;
const graphql_request_1 = require("graphql-request");
exports.TokenPriceGQL = (0, graphql_request_1.gql) `
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
exports.AllV3TicksGQL = (0, graphql_request_1.gql) `
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
exports.FeeTierDistributionGQL = (0, graphql_request_1.gql) `
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
exports.PositionHistoryGQL = (0, graphql_request_1.gql) `
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
exports.UserStakeInfosGQL = (0, graphql_request_1.gql) `
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
exports.QueryIdoPoolInfosGQL = (0, graphql_request_1.gql) `
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
exports.QueryTokenATHPriceHistory = (0, graphql_request_1.gql) `
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
exports.QueryIDOUserDepositedLogsByPool = (0, graphql_request_1.gql) `
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
exports.QueryIDOPoolInfo = (0, graphql_request_1.gql) `query poolInfo($id:String!) {
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
const QueryBlockTimeGQL = (timestamps) => {
    return (0, graphql_request_1.gql) `query blocks {
        ${timestamps.map((timestamp) => {
        return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
              number
            }`;
    })}
    }`;
};
exports.QueryBlockTimeGQL = QueryBlockTimeGQL;
exports.topPoolsGQL = (0, graphql_request_1.gql) `
    query topPools {
        pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
        }
    }
`;
const poolsBulkGQL = (block, pools) => {
    let poolString = `[`;
    pools.forEach((address) => {
        poolString = `${poolString}"${address}",`;
    });
    poolString += ']';
    const queryString = `
    query pools {
      pools(where: {id_in: ${poolString}},
     ${block ? `block: {number: ${(block)}} ,` : ``}
     orderBy: totalValueLockedUSD, orderDirection: desc) {
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
    return (0, graphql_request_1.gql) `
        ${queryString}
    `;
};
exports.poolsBulkGQL = poolsBulkGQL;
exports.topTokensGQL = (0, graphql_request_1.gql) `
    query topPools {
        tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
        }
    }
`;
const tokensBulkGQL = (block, tokens) => {
    let tokenString = `[`;
    tokens.forEach((address) => {
        tokenString = `${tokenString}"${address}",`;
    });
    tokenString += ']';
    const queryString = `
    query tokens {
      tokens(where: {id_in: ${tokenString}},
    ${block
        ? `block: {number: ${(block)}} ,`
        : ''}
     orderBy: totalValueLockedUSD, orderDirection: desc) {
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
    return (0, graphql_request_1.gql) `
        ${queryString}
    `;
};
exports.tokensBulkGQL = tokensBulkGQL;
const ethPricesGQL = (block24, block48, blockWeek) => {
    const dayQueryString = block24
        ? `oneDay: bundles(first: 1, block: { number: ${(block24)} }) {
      ethPriceUSD
    }`
        : '';
    const twoDayQueryString = block48
        ? `twoDay: bundles(first: 1, block: { number: ${(block48)} }) {
      ethPriceUSD
    }`
        : '';
    const weekQueryString = blockWeek
        ? `oneWeek: bundles(first: 1, block: { number: ${(blockWeek)} }) {
      ethPriceUSD
    }`
        : '';
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
    return (0, graphql_request_1.gql) `
        ${queryString}
    `;
};
exports.ethPricesGQL = ethPricesGQL;
const globalDataGQL = (block) => {
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
    return (0, graphql_request_1.gql) `
        ${queryString}
    `;
};
exports.globalDataGQL = globalDataGQL;
exports.globalChartGQL = (0, graphql_request_1.gql) `
    query pancakeDayDatas($startTime: Int!, $skip: Int!) {
        pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
            id
            date
            volumeUSD
            tvlUSD
        }
    }
`;
exports.globalTransactionsGQL = (0, graphql_request_1.gql) `
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
