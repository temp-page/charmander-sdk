import { Block, DashboardChartDayData, DashboardPoolData, DashboardTokenData, DashboardProtocolData, DashboardTransaction } from "../vo";
export declare class DashboardApi {
    private baseApi;
    constructor();
    getBlocksFromTimestamps(timestamps: number[]): Promise<Block[]>;
    protocolData(): Promise<DashboardProtocolData>;
    chartData(): Promise<DashboardChartDayData[]>;
    topPool(): Promise<Record<string, DashboardPoolData>>;
    ethPriceDatas(): Promise<{
        current: number;
        oneDay: number;
        twoDay: number;
        week: number;
    }>;
    topToken(): Promise<Record<string, DashboardTokenData>>;
    private poolDatas;
    topTransactions(): Promise<DashboardTransaction[]>;
}
