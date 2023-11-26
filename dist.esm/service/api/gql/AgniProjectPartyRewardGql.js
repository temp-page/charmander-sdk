import { gql } from "graphql-request";
export const AgniProjectPartyQueryPairGQL = gql `
  query b($ids:[String]) {
    result: pools(where:{id_in: $ids}){
      id
      token0{
        symbol
      }
      token1{
        symbol
      }
      feeTier

    }
  }`;
export const AgniProjectPartyClaimLogsGQL = gql `query b($user: String) {
          claimLogs(where: {user: $user}) {
            id
            timestamp
            hash
            epoch
            amount
            user
          }
        }`;
