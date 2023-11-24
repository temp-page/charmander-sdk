var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { gql } from 'graphql-request';
import get from 'lodash/get';
import { AgniProjectPartyReward } from '../abi';
import { CacheKey } from '../tool';
import { ProjectPartyRewardMyListResult, ProjectPartyRewardResult } from '../vo';
import { BASE_API } from './BaseApi';
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
        const projectPartyRewardResult = new ProjectPartyRewardResult();
        projectPartyRewardResult.currentEpoch = partyReward.currentEpoch;
        projectPartyRewardResult.list = partyReward.pools;
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
            await this.userLPTokenIds(account);
            const agniProjectPartyReward = this.baseApi.connectInfo().create(AgniProjectPartyReward);
            const [{ getReward }] = await this.baseApi.connectInfo().multiCall()
                .call({
                getReward: agniProjectPartyReward.mulContract.getReward(account),
            });
            const { claimLogs } = await this.baseApi.projectPartyRewardGraph(gql `query b($user: String) {
              claimLogs(where: {user: $user}) {
                  id
                  timestamp
                  hash
                  epoch
                  amount
                  user
              }
          }`, { user: account.toLowerCase() });
            projectPartyRewardMyListResult.totalReward = getReward.rewardTotal;
            projectPartyRewardMyListResult.unClaim = getReward.availableReward;
            projectPartyRewardMyListResult.histories = getReward.infos.map((it) => {
                const hash = get(claimLogs.find(claim => claim.epoch === it.epoch), 'hash', '');
                return {
                    claim: it.claim,
                    epoch: it.epoch,
                    amount: it.amount,
                    timestamp: getEpochTime(Number(it.epoch)) / 1000,
                    hash,
                };
            });
            projectPartyRewardMyListResult.claim = async (connect) => {
                return connect.create(AgniProjectPartyReward).claim();
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
