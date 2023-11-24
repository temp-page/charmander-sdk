"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetDerivedPricesGQL = GetDerivedPricesGQL;
exports.SwapQueryV3Pools = void 0;
var _graphqlRequest = require("graphql-request");
const SwapQueryV3Pools = exports.SwapQueryV3Pools = (0, _graphqlRequest.gql)`
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
function GetDerivedPricesGQL(tokenAddress, blocks) {
  const subqueries = blocks.filter(it => it.number).map(block => `
    t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number}}) {
        derivedUSD
      }
    `);
  return (0, _graphqlRequest.gql)`
      query getToken {
          ${subqueries}
      }
  `;
}