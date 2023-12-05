import type { ConnectInfo } from '../../ConnectInfo';
import type { Percent } from '../tool';
import { TradeType } from '../tool';
import type { SmartRouterTrade } from '../tool/v3route/types';
import type { TransactionEvent } from '../vo';
import { BaseAbi } from './BaseAbi';
export declare class SwapRouter extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    swap(trades: SmartRouterTrade<TradeType>[], slippageTolerance: Percent, recipientAddr: string, deadline: string | number, gasPriceGWei: string): Promise<TransactionEvent>;
}
