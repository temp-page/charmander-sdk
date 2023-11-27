var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import get from 'lodash/get';
import { AgniProjectPartyReward, NonfungiblePositionManager } from '../abi';
import { CacheKey } from '../tool';
import { ProjectPartyRewardMyListResult, ProjectPartyRewardResult } from '../vo';
import { BASE_API } from './BaseApi';
import { AgniProjectPartyClaimLogsGQL, AgniProjectPartyQueryPairGQL } from "./gql/AgniProjectPartyRewardGql";
import groupBy from "lodash/groupBy";
import { Position } from "../tool/sdk/v3";
import BigNumber from "bignumber.js";
let AgniProjectPartyRewardApi = class AgniProjectPartyRewardApi {
    constructor() {
        this.baseApi = BASE_API;
    }
    projectPartyReward() {
        return this.baseApi.request(`${this.baseApi.address().baseApiUrl}/server_api/project-party-reward`, 'get', {});
    }
    userLPTokenIds(address) {
        return this.baseApi.request(`${this.baseApi.address().baseApiUrl}/server_api/project-party-reward/lp`, 'get', { address });
    }
    async result(account) {
        const partyReward = await this.projectPartyReward();
        let pools = await this.baseApi.exchangeGraph(AgniProjectPartyQueryPairGQL, { ids: partyReward.pools.map(it => it.poolAddress.toLowerCase()) });
        let poolMap = groupBy(pools.result, it => it.id);
        const projectPartyRewardResult = new ProjectPartyRewardResult();
        projectPartyRewardResult.currentEpoch = partyReward.currentEpoch;
        projectPartyRewardResult.list = partyReward.pools.map((it) => {
            let poolMapElement = poolMap[it.poolAddress.toLowerCase()];
            if (poolMapElement && poolMapElement.length > 0) {
                return {
                    ...it,
                    feeTier: poolMapElement[0].feeTier,
                    token0Symbol: poolMapElement[0].token0.symbol,
                    token1Symbol: poolMapElement[0].token1.symbol,
                };
            }
            return null;
        }).filter(it => it !== null);
        projectPartyRewardResult.epochTime = partyReward.epochTime;
        projectPartyRewardResult.startTime = partyReward.startTime;
        projectPartyRewardResult.epochCount = partyReward.epochCount;
        const projectPartyRewardMyListResult = new ProjectPartyRewardMyListResult();
        projectPartyRewardMyListResult.histories = [];
        projectPartyRewardMyListResult.totalReward = '0';
        projectPartyRewardMyListResult.unClaim = '0';
        projectPartyRewardMyListResult.pools = [];
        projectPartyRewardMyListResult.claim = (connect) => {
            throw new Error('not implement');
        };
        projectPartyRewardResult.my = projectPartyRewardMyListResult;
        function getEpochTime(epoch) {
            return partyReward.startTime + epoch * partyReward.epochTime;
        }
        if (account) {
            const userLps = await this.userLPTokenIds(account);
            const agniProjectPartyReward = this.baseApi.connectInfo().create(AgniProjectPartyReward, partyReward.contractAddress);
            const nonfungiblePositionManager = this.baseApi.connectInfo().create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
            let tokenIds = userLps.flatMap(it => it.tokenIds);
            let scorePool = groupBy(projectPartyRewardResult.list, it => it.poolAddress.toLowerCase());
            let [[{ getReward }], { claimLogs }, tokens, positions] = await Promise.all([
                this.baseApi.connectInfo().multiCall()
                    .call({
                    getReward: agniProjectPartyReward.mulContract.getReward(account),
                }),
                this.baseApi.projectPartyRewardGraph(AgniProjectPartyClaimLogsGQL, { user: account.toLowerCase() }),
                this.baseApi.address().getApi().tokenMangerApi().getTokenByContract(Array.from(new Set(userLps.flatMap(it => [it.token0, it.token1])))),
                this.baseApi.connectInfo().multiCall().call(...tokenIds.map(it => {
                    return {
                        position: nonfungiblePositionManager.mulContract.positions(it)
                    };
                }))
            ]);
            let tokenMaps = groupBy(tokens, it => it.address.toLowerCase());
            let poolV3s = await this.baseApi.address().getApi().poolV3Api().getPool(userLps.map(it => {
                let token0 = tokenMaps[it.token0.toLowerCase()][0];
                let token1 = tokenMaps[it.token1.toLowerCase()][0];
                let poolMapElement = poolMap[it.poolAddress.toLowerCase()][0];
                let feeAmount = parseInt(poolMapElement.feeTier);
                return {
                    token0,
                    token1,
                    feeAmount,
                };
            }));
            projectPartyRewardMyListResult.pools = userLps.map((it, index) => {
                let poolV3 = poolV3s[index];
                if (!poolV3) {
                    return null;
                }
                let positionDetails = it.tokenIds.map(id => {
                    const position = positions[tokenIds.findIndex(r => r === id)].position;
                    const positionDetail = new Position({
                        pool: poolV3,
                        liquidity: position.liquidity,
                        tickLower: Number.parseInt(position.tickLower),
                        tickUpper: Number.parseInt(position.tickUpper),
                    });
                    return positionDetail;
                });
                const pool = scorePool[it.poolAddress.toLowerCase()];
                if (pool && pool.length > 0) {
                    return {
                        ...pool[0],
                        token0Stake: positionDetails.map(it => it.amount0.toFixed()).reduce((a, b) => new BigNumber(a).plus(b).toString()),
                        token1Stake: positionDetails.map(it => it.amount1.toFixed()).reduce((a, b) => new BigNumber(a).plus(b).toString()),
                    };
                }
                return null;
            }).filter(it => it !== null);
            projectPartyRewardMyListResult.totalReward = new BigNumber(getReward.rewardTotal).div(1e18).toFixed();
            projectPartyRewardMyListResult.unClaim = new BigNumber(getReward.availableReward).div(1e18).toFixed();
            projectPartyRewardMyListResult.histories = getReward.infos.map((it) => {
                const hash = get(claimLogs.find(claim => claim.epoch === it.epoch), 'hash', '');
                return {
                    claim: it.claim,
                    epoch: it.epoch,
                    amount: new BigNumber(it.amount).div(1e18).toFixed(),
                    timestamp: getEpochTime(Number(it.epoch)) / 1000,
                    hash,
                };
            }).filter(it => it.amount !== '0')
                .sort((a, b) => b.timestamp - a.timestamp);
            projectPartyRewardMyListResult.claim = async (connect) => {
                return connect.create(AgniProjectPartyReward, partyReward.contractAddress).claim();
            };
        }
        return projectPartyRewardResult;
    }
};
AgniProjectPartyRewardApi = __decorate([
    CacheKey('AgniProjectPartyRewardApi'),
    __metadata("design:paramtypes", [])
], AgniProjectPartyRewardApi);
export { AgniProjectPartyRewardApi };
