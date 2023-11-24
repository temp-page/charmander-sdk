import { CacheKey, createProxy } from "../tool/index.mjs";
import { PoolV3Api } from "./PoolV3Api.mjs";
import { SwapV3Api } from "./SwapV3Api.mjs";
import { TokenMangerApi } from "./TokenMangerApi.mjs";
import { BASE_API } from "./BaseApi.mjs";
import { transactionHistory } from "./TransactionHistory.mjs";
import { LaunchpadApi } from "./LaunchpadApi.mjs";
import { DashboardApi } from "./DashboardApi.mjs";
import { AgniProjectPartyRewardApi } from "./AgniProjectPartyRewardApi.mjs";
@CacheKey("ApiProvider")
class ApiProvider {
  baseApi;
  constructor() {
    this.baseApi = BASE_API;
  }
  poolV3Api() {
    return createProxy(new PoolV3Api());
  }
  swapV3Api() {
    return createProxy(new SwapV3Api());
  }
  projectPartyRewardApi() {
    return createProxy(new AgniProjectPartyRewardApi());
  }
  tokenMangerApi() {
    return createProxy(new TokenMangerApi());
  }
  dashboard() {
    return createProxy(new DashboardApi());
  }
  transactionHistory() {
    return transactionHistory;
  }
  launchpad() {
    return createProxy(new LaunchpadApi());
  }
}
export { ApiProvider };
