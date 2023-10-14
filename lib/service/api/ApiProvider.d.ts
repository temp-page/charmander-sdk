import { LiquidityV3Api } from "./LiquidityV3Api";
import { SwapV3Api } from "./SwapV3Api";
import { TokenMangerApi } from "./TokenMangerApi";
import { BaseApi } from "./BaseApi";
/**
 * 请求基类 详细信息查看
 */
declare class ApiProvider {
    baseApi: BaseApi;
    constructor();
    liquidityV3Api(): LiquidityV3Api;
    swapV3Api(): SwapV3Api;
    tokenMangerApi(): TokenMangerApi;
}
export { ApiProvider };
