"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectPartyRewardResult = exports.ProjectPartyRewardMyListResult = void 0;
class ProjectPartyRewardResult {
  currentEpoch;
  startTime;
  epochTime;
  epochCount;
  list;
  my;
}
exports.ProjectPartyRewardResult = ProjectPartyRewardResult;
class ProjectPartyRewardMyListResult {
  totalReward;
  unClaim;
  pools;
  histories;
  claim;
}
exports.ProjectPartyRewardMyListResult = ProjectPartyRewardMyListResult;