import { TradeType } from '../sdk';
import { getAmountDistribution } from './functions';
export async function getRoutesWithValidQuote({ amount, baseRoutes, distributionPercent, quoteProvider, tradeType, gasModel, }) {
    const [percents, amounts] = getAmountDistribution(amount, distributionPercent);
    // 拼route
    const routesWithoutQuote = amounts.reduce((acc, curAmount, i) => [
        ...acc,
        ...baseRoutes.map(r => ({
            ...r,
            amount: curAmount,
            percent: percents[i],
        })),
    ], []);
    const getRoutesWithQuote = tradeType === TradeType.EXACT_INPUT
        ? quoteProvider.getRouteWithQuotesExactIn
        : quoteProvider.getRouteWithQuotesExactOut;
    return getRoutesWithQuote(routesWithoutQuote, { gasModel });
}
