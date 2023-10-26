import { Block, ChartDayData, DashboardPoolData, DashboardTokenData, ProtocolData, Transaction } from "../vo";
export declare class DashboardApi {
    private baseApi;
    constructor();
    getBlocksFromTimestamps(timestamps: number[]): Promise<Block[]>;
    protocolData(): Promise<ProtocolData>;
    chartData(): Promise<ChartDayData[]>;
    topPool(): Promise<Record<string, DashboardPoolData>>;
    ethPriceDatas(): Promise<{
        current: number;
        oneDay: number;
        twoDay: number;
        week: number;
    }>;
    topToken(): Promise<Record<string, DashboardTokenData>>;
    private poolDatas;
    topTransactions(): Promise<Transaction[]>;
}
