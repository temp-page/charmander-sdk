import { gql } from 'graphql-request';
export const SwapQueryV3Pools = gql `
    query getPools($pageSize: Int!, $poolAddrs: [String]) {
        pools(first: $pageSize, where: { id_in: $poolAddrs }) {
            id
            tick
            sqrtPrice
            feeTier
            liquidity
            feeProtocol
            totalValueLockedUSD
        }
    }
`;
export function GetDerivedPricesGQL(tokenAddress, blocks) {
    const subqueries = blocks.filter(it => it.number).map(block => `
    t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number}}) {
        derivedUSD
      }
    `);
    return gql `
      query getToken {
          ${subqueries}
      }
  `;
}
