import { Price, Token } from "../sdk";
import { FeeAmount } from "../../vo";
export declare function invariant(state: boolean, errorMsg?: string): void;
export declare function tryParsePrice(baseToken?: Token, quoteToken?: Token, value?: string): Price<Token, Token>;
export declare function tryParseTick(baseToken?: Token, quoteToken?: Token, feeAmount?: FeeAmount, value?: string): number | undefined;
export declare function getTickToPrice(baseToken?: Token, quoteToken?: Token, tick?: number): Price<Token, Token> | undefined;
export declare function validateAndParseAddress(address: string): string;
