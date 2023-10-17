"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPriceGQL = void 0;
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
