import { BaseApi } from "./BaseApi";
import { Token, TokenListInfo, TokenManagerAddInfo, TokenManagerInfo } from "../vo";
export declare class TokenMangerApi {
    baseApi: BaseApi;
    defaultTokenListUrl: string;
    constructor();
    tokenList(url?: string): Promise<TokenListInfo[]>;
    tokenSelectList(): Promise<Token[]>;
    tokenManager(searchStr?: string): Promise<{
        searchTokens: TokenManagerAddInfo[];
        customTokens: TokenManagerInfo[];
    }>;
    systemTokens(): Token[];
    private searchTokenList;
    private mapToTokenList;
    private storageToken;
    private storageTokenAdd;
    private storageTokenRemove;
    private storageTokenListUrls;
    private storageTokenListUrlsAdd;
    private storageTokenListUrlsUpdate;
    private storageTokenListUrlsRemove;
    private uriToHttp;
}
