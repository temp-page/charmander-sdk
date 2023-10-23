import { ConnectInfo } from '../../ConnectInfo';
import { Percent, Token } from '../tool';
import { BaseAbi } from './BaseAbi';
import { Position } from "../tool/sdk/v3";
import { TransactionEvent } from "../vo";
export declare class NonfungiblePositionManager extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    collect(tokenId: string, token0: Token, token1: Token, fee0: string, fee1: string, involvesMNT: boolean): Promise<TransactionEvent>;
    addLiquidity(position: Position, tokenId: string | null, createPool: boolean, slippageTolerance: Percent, deadline: number): Promise<TransactionEvent>;
    removeLiquidity(rate: string, token0: Token, token1: Token, partialPosition: Position, tokenId: string, fee0: string, fee1: string, involvesMNT: boolean, slippageTolerance: Percent, deadline: number): Promise<TransactionEvent>;
}
