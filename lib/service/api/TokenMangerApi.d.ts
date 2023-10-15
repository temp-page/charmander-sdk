import { BaseApi } from "./BaseApi";
import { Token, TokenListInfo, TokenManagerAddInfo, TokenManagerInfo, TokenSelectInfo } from "../vo";
export declare class TokenMangerApi {
    baseApi: BaseApi;
    defaultTokenListUrl: string;
    constructor();
    tokenList(url?: string): Promise<TokenListInfo[]>;
    tokenSelectList(account: string, searchStr?: string): Promise<{
        searchTokens: TokenManagerAddInfo[];
        customTokens: TokenSelectInfo[];
    }>;
    tokenManager(searchStr?: string): Promise<{
        searchTokens: TokenManagerAddInfo[];
        customTokens: TokenManagerInfo[];
    }>;
    systemTokens(): Token[];
    private searchTokenList;
    private mapToTokenAdd;
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
