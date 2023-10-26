"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenMangerApi = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const vo_1 = require("../vo");
const tokens_json_1 = __importDefault(require("../../config/tokens.json"));
const ajv_1 = __importDefault(require("ajv"));
const BasicException_1 = require("../../BasicException");
const lodash_1 = __importStar(require("lodash"));
const ethers_1 = require("ethers");
const gql_1 = require("./gql");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
let TokenMangerApi = class TokenMangerApi {
    constructor() {
        this.defaultTokenListUrl = "https://raw.githubusercontent.com/magma-protocol/tokenList/main/magma.json";
        this.baseApi = BaseApi_1.BASE_API;
    }
    async batchGetTokens(addresses) {
        let tokenAddressMap = lodash_1.default.groupBy(await this.getTokenByTokenList(), (it) => it.address);
        let tokens = await this.getTokenByContract(addresses);
        let tokenMap = {};
        addresses.forEach((it, index) => {
            let tokenListToken = tokenAddressMap[it.toLowerCase()] || [];
            tokenMap[it] = tokenListToken.length > 0 ? tokenListToken[0] : tokens[index];
        });
        return tokenMap;
    }
    async tokenPrice(...tokens) {
        let addresses = tokens.map(it => it.erc20Address().toLowerCase());
        let { bundles, tokens: tokenPrices } = await this.baseApi.exchangeGraph(gql_1.TokenPriceGQL, { addresses });
        let groupBy = lodash_1.default.groupBy(tokenPrices, (it) => it.id.toLowerCase());
        return tokens.map(token => {
            let mntPrice = lodash_1.default.get(bundles, "0.ethPriceUSD", "0");
            let groupByElementElement = groupBy[token.erc20Address().toLowerCase()][0];
            if (groupByElementElement) {
                let price = groupByElementElement.derivedETH;
                let priceUSD = new bignumber_js_1.default(price).times(mntPrice).toFixed();
                let priceMNT = new bignumber_js_1.default(price).toFixed();
                return new vo_1.TokenPrice(token, priceUSD, priceMNT);
            }
            else {
                return new vo_1.TokenPrice(token, "0", "0");
            }
        });
    }
    async tokenList(url = '') {
        if (url === '') {
            let storageTokenListInfos = this.storageTokenListUrls();
            let tokenListInfos = [];
            for (const info of storageTokenListInfos) {
                let urls = this.uriToHttp(info.url);
                try {
                    let tokenList = await this.searchTokenList(urls);
                    let tokenListInfo = this.mapToTokenList(info, tokenList, true);
                    tokenListInfos.push(tokenListInfo);
                }
                catch (e) {
                    tool_1.Trace.debug("showList error ignore", e);
                }
            }
            return tokenListInfos;
        }
        else {
            let urls = this.uriToHttp(url);
            if (urls.length === 0) {
                throw new BasicException_1.BasicException(`Unrecognized list URL protocol.`);
            }
            let storageTokenListInfos = this.storageTokenListUrls();
            const tokenList = await this.searchTokenList(urls);
            let storageTokenListInfo = storageTokenListInfos.find(it => it.url == url);
            return [
                this.mapToTokenList({
                    url: url,
                    enable: lodash_1.default.get(storageTokenListInfo, "enable", false),
                }, tokenList, !!storageTokenListInfo)
            ];
        }
    }
    async tokenSelectList(account, searchStr = '') {
        let search = searchStr.toLowerCase();
        let storageToken = this.storageToken();
        if (search !== "") {
            storageToken = storageToken.filter(it => {
                return it.address.toLowerCase().indexOf(search) > -1 || it.symbol.toLowerCase().indexOf(search) > -1 || it.name.toLowerCase().indexOf(search) > -1;
            });
        }
        let balance = {};
        if (account != '') {
            balance = await this.baseApi.address().readonlyConnectInfo().erc20().batchGetBalance(account, storageToken.map(it => it.address));
        }
        const mapToTokenManager = (token, tokenBalances) => {
            let tokenSelectInfo = new vo_1.TokenSelectInfo();
            tokenSelectInfo.token = token;
            tokenSelectInfo.balance = tokenBalances[token.address]?.amount ?? "0";
            return tokenSelectInfo;
        };
        if (search === "") {
            return {
                searchTokens: [],
                customTokens: storageToken.map(it => mapToTokenManager(it, balance))
            };
        }
        else {
            let tokenManager = await this.tokenManager(searchStr);
            return {
                searchTokens: tokenManager.searchTokens,
                customTokens: storageToken.map(it => mapToTokenManager(it, balance))
            };
        }
    }
    async getTokenByTokenList() {
        try {
            return Array.from(await this.tokenList())
                .flatMap(it => it.tokenList.tokens.map(it => tool_1.Token.fromSerialized(it)))
                .filter(it => it.chainId == this.baseApi.address().chainId);
        }
        catch (e) {
            tool_1.Trace.error("getTokenByTokenList error ignore", e);
            return [];
        }
    }
    async getTokenByContract(addresses) {
        try {
            let addressInfo = this.baseApi.address();
            let tokenInfos = await addressInfo.readonlyConnectInfo().erc20().batchGetTokenInfo(...addresses);
            return tokenInfos
                .filter(it => !(0, tool_1.isNullOrBlank)(it.name) && !(0, tool_1.isNullOrBlank)(it.symbol) && it.decimals > 0)
                .map(it => {
                return new tool_1.Token(addressInfo.chainId, it.address, it.decimals, it.symbol, it.name, `https://agni.finance/static/${it.symbol}.png`);
            });
        }
        catch (e) {
            tool_1.Trace.error("getTokenByContract error ignore", e);
            return [];
        }
    }
    async tokenManager(searchStr = '') {
        let search = searchStr.toLowerCase();
        let storageToken = this.storageToken();
        const mapToTokenManager = (token) => {
            let tokenManagerInfo = new vo_1.TokenManagerInfo();
            tokenManagerInfo.token = token;
            tokenManagerInfo.remove = () => {
                this.storageTokenRemove(tokenManagerInfo.token);
            };
            return tokenManagerInfo;
        };
        if (search === "") {
            return {
                searchTokens: [],
                customTokens: storageToken.map(it => mapToTokenManager(it))
            };
        }
        else {
            let searchTokens = [];
            let tokensByTokenList = Array.from(await this.getTokenByTokenList())
                .filter(it => {
                return it.address.toLowerCase().indexOf(search) > -1 || it.symbol.toLowerCase().indexOf(search) > -1 || it.name.toLowerCase().indexOf(search) > -1;
            })
                .map(it => this.mapToTokenAdd(it, storageToken));
            searchTokens.push(...tokensByTokenList);
            if ((0, ethers_1.isAddress)(search)) {
                let searchRpcTokens = (await this.getTokenByContract([search]))
                    .map(it => this.mapToTokenAdd(it, storageToken));
                searchTokens.push(...searchRpcTokens);
            }
            const searchResult = [];
            // searchTokens 去重
            const searchTokensSet = new Set();
            for (const searchToken of searchTokens) {
                if (searchTokensSet.has(searchToken.token.address)) {
                    searchResult.push(searchToken);
                    searchTokensSet.add(searchToken.token.address);
                }
            }
            return {
                searchTokens: searchResult,
                customTokens: storageToken.filter(it => {
                    return it.address.toLowerCase().indexOf(search) > -1 || it.symbol.toLowerCase().indexOf(search) > -1 || it.name.toLowerCase().indexOf(search) > -1;
                }).map(it => mapToTokenManager(it))
            };
        }
    }
    systemTokens() {
        return tokens_json_1.default.filter(t => t.chainId === this.baseApi.address().chainId)
            .map(it => {
            return new tool_1.Token(this.baseApi.address().chainId, it.address, it.decimals, it.symbol, it.name, it.logoURI);
        });
    }
    async searchTokenList(urls) {
        for (let i = 0; i < urls.length; i++) {
            const isLast = i === urls.length - 1;
            let json;
            try {
                json = await this.baseApi.request(urls[i], "get", {}, {});
            }
            catch (e) {
                if (isLast)
                    throw new Error(`Failed to download list ${urls[i]}`);
                continue;
            }
            if (json.tokens) {
                (0, lodash_1.remove)(json.tokens, (token) => {
                    return token.symbol ? token.symbol.length === 0 : true;
                });
            }
            const tokenListValidator = new ajv_1.default({ allErrors: true }).compile(vo_1.AgniTokenListSchema);
            if (!tokenListValidator(json)) {
                const validationErrors = tokenListValidator.errors?.reduce((memo, error) => {
                    const add = `${error.dataPath} ${error.message ?? ''}`;
                    return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
                }, '') ?? 'unknown error';
                if (isLast)
                    throw new Error(`Token list failed validation: ${validationErrors}`);
                continue;
            }
            return json;
        }
        throw new Error('Unrecognized list URL protocol.');
    }
    mapToTokenAdd(token, storageToken) {
        let tokenManagerAddInfo = new vo_1.TokenManagerAddInfo();
        tokenManagerAddInfo.active = !!storageToken.find(it => (0, tool_1.eqAddress)(it.address, token.address));
        tokenManagerAddInfo.token = token;
        tokenManagerAddInfo.import = () => {
            tokenManagerAddInfo.active = true;
            this.storageTokenAdd(tokenManagerAddInfo.token);
        };
        return tokenManagerAddInfo;
    }
    ;
    mapToTokenList(info, tokenList, showRemove) {
        let tokenListInfo = new vo_1.TokenListInfo();
        tokenListInfo.storageTokenListInfo = info;
        tokenListInfo.tokenList = tokenList;
        tokenListInfo.showRemove = showRemove;
        tokenListInfo.remove = () => {
            this.storageTokenListUrlsRemove(tokenListInfo.storageTokenListInfo);
        };
        tokenListInfo.updateEnable = (bool) => {
            tokenListInfo.storageTokenListInfo.enable = bool;
            this.storageTokenListUrlsUpdate(tokenListInfo.storageTokenListInfo);
        };
        return tokenListInfo;
    }
    storageToken() {
        let tokens = this.baseApi.address().storage.getArray(tool_1.STORAGE_KEY_TOKENS);
        if (!tokens) {
            tokens = this.systemTokens();
            this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKENS, tokens);
        }
        return tokens;
    }
    storageTokenAdd(token) {
        let tokens = this.storageToken();
        if (tokens.find(it => (0, tool_1.eqAddress)(it.address, token.address))) {
            return;
        }
        tokens.push(token);
        this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKENS, tokens);
    }
    storageTokenRemove(token) {
        let tokens = this.storageToken().filter(it => !(0, tool_1.eqAddress)(it.address, token.address));
        this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKENS, tokens);
    }
    storageTokenListUrls() {
        let storageTokenListInfos = this.baseApi.address().storage.getArray(tool_1.STORAGE_KEY_TOKEN_LIST);
        if (!storageTokenListInfos) {
            storageTokenListInfos = [{
                    url: this.defaultTokenListUrl,
                    enable: true
                }];
            this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
        }
        return storageTokenListInfos;
    }
    storageTokenListUrlsAdd(storageTokenListInfo) {
        let storageTokenListInfos = this.storageTokenListUrls();
        if (storageTokenListInfos.find(it => it.url == storageTokenListInfo.url)) {
            return;
        }
        storageTokenListInfos.push(storageTokenListInfo);
        this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
    }
    storageTokenListUrlsUpdate(storageTokenListInfo) {
        let storageTokenListInfos = this.storageTokenListUrls();
        let find = storageTokenListInfos.find(it => it.url == storageTokenListInfo.url);
        if (!find) {
            this.storageTokenListUrlsAdd(storageTokenListInfo);
        }
        else {
            find.enable = storageTokenListInfo.enable;
            this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
        }
    }
    storageTokenListUrlsRemove(storageTokenListInfo) {
        let strings = this.storageTokenListUrls().filter(it => it.url !== storageTokenListInfo.url);
        this.baseApi.address().storage.setJson(tool_1.STORAGE_KEY_TOKEN_LIST, strings);
    }
    uriToHttp(uri) {
        const protocol = uri.split(':')[0].toLowerCase();
        switch (protocol) {
            case 'https':
                return [uri];
            case 'http':
                return [`https${uri.substring(4)}`, uri];
            case 'ipfs':
                const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
                return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
            case 'ipns':
                const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
                return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
            default:
                return [];
        }
    }
};
exports.TokenMangerApi = TokenMangerApi;
exports.TokenMangerApi = TokenMangerApi = __decorate([
    (0, tool_1.CacheKey)("TokenMangerApi"),
    __metadata("design:paramtypes", [])
], TokenMangerApi);
