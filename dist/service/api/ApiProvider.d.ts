import { PoolV3Api } from './PoolV3Api';
import { SwapV3Api } from './SwapV3Api';
import { TokenMangerApi } from './TokenMangerApi';
import type { BaseApi } from './BaseApi';
import type { TransactionHistory } from './TransactionHistory';
import { LaunchpadApi } from './LaunchpadApi';
import { DashboardApi } from './DashboardApi';
import { AgniProjectPartyRewardApi } from './AgniProjectPartyRewardApi';
/**
 * 请求基类 详细信息查看
 */
declare class ApiProvider {
    baseApi: BaseApi;
    constructor();
    poolV3Api(): PoolV3Api;
    swapV3Api(): SwapV3Api;
    projectPartyRewardApi(): AgniProjectPartyRewardApi;
    tokenMangerApi(): TokenMangerApi;
    dashboard(): DashboardApi;
    transactionHistory(): TransactionHistory;
    launchpad(): LaunchpadApi;
}
export { ApiProvider };
