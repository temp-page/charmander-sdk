import { ConnectInfo } from '../../ConnectInfo';
import { BigintIsh, Percent, Token } from '../tool';
import { BaseAbi } from './BaseAbi';
import { Position } from "../tool/sdk/v3";
import { TransactionEvent } from "../vo";
export declare const MaxUint128: bigint;
export interface MintSpecificOptions {
    /**
     * The account that should receive the minted NFT.
     */
    recipient: string;
    /**
     * Creates pool if not initialized before mint.
     */
    createPool?: boolean;
}
export interface IncreaseSpecificOptions {
    /**
     * Indicates the ID of the position to increase liquidity for.
     */
    tokenId: BigintIsh;
}
/**
 * Options for producing the calldata to add liquidity.
 */
export interface CommonAddLiquidityOptions {
    /**
     * How much the pool price is allowed to move.
     */
    slippageTolerance: Percent;
    /**
     * When the transaction expires, in epoch seconds.
     */
    deadline: BigintIsh;
    /**
     * Whether to spend ether. If true, one of the pool tokens must be WETH, by default false
     */
    useNative?: Token;
}
export type MintOptions = CommonAddLiquidityOptions & MintSpecificOptions;
export type IncreaseOptions = CommonAddLiquidityOptions & IncreaseSpecificOptions;
export type AddLiquidityOptions = MintOptions | IncreaseOptions;
export declare function isMint(options: AddLiquidityOptions): options is MintOptions;
export declare class NonfungiblePositionManager extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    collect(tokenId: string, token0: Token, token1: Token, fee0: string, fee1: string, involvesMNT: boolean): Promise<TransactionEvent>;
    private encodeCreate;
    addLiquidity(position: Position, tokenId: string | null, createPool: boolean, slippageTolerance: Percent, deadline: number): Promise<TransactionEvent>;
    removeLiquidity(rate: string, token0: Token, token1: Token, partialPosition: Position, tokenId: string, fee0: string, fee1: string, involvesMNT: boolean, slippageTolerance: Percent, deadline: number): Promise<TransactionEvent>;
}
