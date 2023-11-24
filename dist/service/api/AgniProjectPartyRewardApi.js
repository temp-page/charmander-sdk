"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgniProjectPartyRewardApi = void 0;
const graphql_request_1 = require("graphql-request");
const get_1 = __importDefault(require("lodash/get"));
const abi_1 = require("../abi");
const tool_1 = require("../tool");
const vo_1 = require("../vo");
const BaseApi_1 = require("./BaseApi");
let AgniProjectPartyRewardApi = class AgniProjectPartyRewardApi {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    projectPartyReward() {
        return this.baseApi.request(`${this.baseApi.address().baseApiUrl}/server_api/project-party-reward`, 'get', {});
    }
    userLPTokenIds(address) {
        return this.baseApi.request(`${this.baseApi.address().baseApiUrl}/server_api/project-party-reward/lp`, 'get', { address });
    }
    async result(account) {
        const partyReward = await this.projectPartyReward();
        const projectPartyRewardResult = new vo_1.ProjectPartyRewardResult();
        projectPartyRewardResult.currentEpoch = partyReward.currentEpoch;
        projectPartyRewardResult.list = partyReward.pools;
        projectPartyRewardResult.epochTime = partyReward.epochTime;
        projectPartyRewardResult.startTime = partyReward.startTime;
        projectPartyRewardResult.epochCount = partyReward.epochCount;
        const projectPartyRewardMyListResult = new vo_1.ProjectPartyRewardMyListResult();
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
            const agniProjectPartyReward = this.baseApi.connectInfo().create(abi_1.AgniProjectPartyReward);
            const [{ getReward }] = await this.baseApi.connectInfo().multiCall()
                .call({
                getReward: agniProjectPartyReward.mulContract.getReward(account),
            });
            const { claimLogs } = await this.baseApi.projectPartyRewardGraph((0, graphql_request_1.gql) `query b($user: String) {
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
                const hash = (0, get_1.default)(claimLogs.find(claim => claim.epoch === it.epoch), 'hash', '');
                return {
                    claim: it.claim,
                    epoch: it.epoch,
                    amount: it.amount,
                    timestamp: getEpochTime(Number(it.epoch)) / 1000,
                    hash,
                };
            });
            projectPartyRewardMyListResult.claim = async (connect) => {
                return connect.create(abi_1.AgniProjectPartyReward).claim();
            };
        }
        return projectPartyRewardResult;
    }
};
exports.AgniProjectPartyRewardApi = AgniProjectPartyRewardApi;
exports.AgniProjectPartyRewardApi = AgniProjectPartyRewardApi = __decorate([
    (0, tool_1.CacheKey)('AgniProjectPartyRewardApi'),
    __metadata("design:paramtypes", [])
], AgniProjectPartyRewardApi);
