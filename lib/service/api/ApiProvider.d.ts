import { PoolV3Api } from "./PoolV3Api";
import { SwapV3Api } from "./SwapV3Api";
import { TokenMangerApi } from "./TokenMangerApi";
import { BaseApi } from "./BaseApi";
import { TransactionHistory } from "./TransactionHistory";
import { LaunchpadApi } from "./LaunchpadApi";
import { DashboardApi } from "./DashboardApi";
/**
 * 请求基类 详细信息查看
 */
declare class ApiProvider {
    baseApi: BaseApi;
    constructor();
    poolV3Api(): PoolV3Api;
    swapV3Api(): SwapV3Api;
    tokenMangerApi(): TokenMangerApi;
    dashboard(): DashboardApi;
    transactionHistory(): TransactionHistory;
    launchpad(): LaunchpadApi;
}
export { ApiProvider };
