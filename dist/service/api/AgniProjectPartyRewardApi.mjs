import { gql } from "graphql-request";
import get from "lodash/get";
import { AgniProjectPartyReward } from "../abi/index.mjs";
import { CacheKey } from "../tool/index.mjs";
import { ProjectPartyRewardMyListResult, ProjectPartyRewardResult } from "../vo/index.mjs";
import { BASE_API } from "./BaseApi.mjs";
@CacheKey("AgniProjectPartyRewardApi")
export class AgniProjectPartyRewardApi {
  baseApi;
  constructor() {
    this.baseApi = BASE_API;
  }
  projectPartyReward() {
    return this.baseApi.request(`${this.baseApi.address().baseApiUrl}/server_api/project-party-reward`, "get", {});
  }
  userLPTokenIds(address) {
    return this.baseApi.request(`${this.baseApi.address().baseApiUrl}/server_api/project-party-reward/lp`, "get", { address });
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
    projectPartyRewardMyListResult.totalReward = "0";
    projectPartyRewardMyListResult.unClaim = "0";
    projectPartyRewardMyListResult.pools = [];
    projectPartyRewardMyListResult.claim = (connect) => {
      throw new Error("not implement");
    };
    projectPartyRewardResult.my = projectPartyRewardMyListResult;
    function getEpochTime(epoch) {
      return partyReward.startTime + epoch * partyReward.epochTime;
    }
    if (account) {
      await this.userLPTokenIds(account);
      const agniProjectPartyReward = this.baseApi.connectInfo().create(AgniProjectPartyReward);
      const [{ getReward }] = await this.baseApi.connectInfo().multiCall().call({
        getReward: agniProjectPartyReward.mulContract.getReward(account)
      });
      const { claimLogs } = await this.baseApi.projectPartyRewardGraph(gql`query b($user: String) {
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
        const hash = get(claimLogs.find((claim) => claim.epoch === it.epoch), "hash", "");
        return {
          claim: it.claim,
          epoch: it.epoch,
          amount: it.amount,
          timestamp: getEpochTime(Number(it.epoch)) / 1e3,
          hash
        };
      });
      projectPartyRewardMyListResult.claim = async (connect) => {
        return connect.create(AgniProjectPartyReward).claim();
      };
    }
    return projectPartyRewardResult;
  }
}
