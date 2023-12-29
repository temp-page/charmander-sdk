"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("./utils");
const constants_1 = require("../constants");
function toHex(currencyAmount) {
    return `0x${currencyAmount.quotient.toString(16)}`;
}
const ZERO_HEX = '0x0';
/**
 * Represents the Pancake Router, and has static methods for helping execute trades.
 */
class Router {
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    static swapCallParameters(trade, options) {
        const etherIn = trade.inputAmount.currency.isNative;
        const etherOut = trade.outputAmount.currency.isNative;
        // the router does not support both ether in and out
        (0, tiny_invariant_1.default)(!(etherIn && etherOut), 'ETHER_IN_OUT');
        (0, tiny_invariant_1.default)(!('ttl' in options) || options.ttl > 0, 'TTL');
        const to = (0, utils_1.validateAndParseAddress)(options.recipient);
        const amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
        const amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
        const path = trade.route.path.map((token) => token.address);
        const deadline = 'ttl' in options
            ? `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`
            : `0x${options.deadline.toString(16)}`;
        const useFeeOnTransfer = Boolean(options.feeOnTransfer);
        let methodName;
        let args;
        let value;
        // eslint-disable-next-line default-case
        switch (trade.tradeType) {
            case constants_1.TradeType.EXACT_INPUT:
                if (etherIn) {
                    methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens';
                    // (uint amountOutMin, address[] calldata path, address to, uint deadline)
                    args = [amountOut, path, to, deadline];
                    value = amountIn;
                }
                else if (etherOut) {
                    methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH';
                    // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
                    args = [amountIn, amountOut, path, to, deadline];
                    value = ZERO_HEX;
                }
                else {
                    methodName = useFeeOnTransfer
                        ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
                        : 'swapExactTokensForTokens';
                    // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
                    args = [amountIn, amountOut, path, to, deadline];
                    value = ZERO_HEX;
                }
                break;
            case constants_1.TradeType.EXACT_OUTPUT:
                (0, tiny_invariant_1.default)(!useFeeOnTransfer, 'EXACT_OUT_FOT');
                if (etherIn) {
                    methodName = 'swapETHForExactTokens';
                    // (uint amountOut, address[] calldata path, address to, uint deadline)
                    args = [amountOut, path, to, deadline];
                    value = amountIn;
                }
                else if (etherOut) {
                    methodName = 'swapTokensForExactETH';
                    // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
                    args = [amountOut, amountIn, path, to, deadline];
                    value = ZERO_HEX;
                }
                else {
                    methodName = 'swapTokensForExactTokens';
                    // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
                    args = [amountOut, amountIn, path, to, deadline];
                    value = ZERO_HEX;
                }
                break;
        }
        return {
            methodName,
            args,
            value,
        };
    }
}
exports.Router = Router;
