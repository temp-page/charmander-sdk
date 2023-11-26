var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CacheKey, createProxy } from '../tool';
import { PoolV3Api } from './PoolV3Api';
import { SwapV3Api } from './SwapV3Api';
import { TokenMangerApi } from './TokenMangerApi';
import { BASE_API } from './BaseApi';
import { transactionHistory } from './TransactionHistory';
import { LaunchpadApi } from './LaunchpadApi';
import { DashboardApi } from './DashboardApi';
import { AgniProjectPartyRewardApi } from './AgniProjectPartyRewardApi';
/**
 * 请求基类 详细信息查看
 */
let ApiProvider = class ApiProvider {
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
};
ApiProvider = __decorate([
    CacheKey('ApiProvider'),
    __metadata("design:paramtypes", [])
], ApiProvider);
export { ApiProvider };
