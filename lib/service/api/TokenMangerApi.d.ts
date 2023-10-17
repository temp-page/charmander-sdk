import { BaseApi } from "./BaseApi";
import { TokenListInfo, TokenManagerAddInfo, TokenManagerInfo, TokenPrice, TokenSelectInfo } from "../vo";
import { Token } from "../tool";
export declare class TokenMangerApi {
    baseApi: BaseApi;
    defaultTokenListUrl: string;
    constructor();
    tokenPrice(...tokens: Token[]): Promise<TokenPrice[]>;
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
