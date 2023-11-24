import Ajv from "ajv";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import remove from "lodash/remove";
import { isAddress } from "ethers";
import BigNumber from "bignumber.js";
import {
  CacheKey,
  STORAGE_KEY_TOKENS,
  STORAGE_KEY_TOKEN_LIST,
  Token,
  Trace,
  eqAddress,
  isNullOrBlank
} from "../tool/index.mjs";
import {
  AgniTokenListSchema,
  ETH_ADDRESS,
  TokenListInfo,
  TokenManagerAddInfo,
  TokenManagerInfo,
  TokenPrice,
  TokenSelectInfo
} from "../vo/index.mjs";
import { BasicException } from "../../BasicException.mjs";
import tokens from "../../config/tokens.json";
import { TokenPriceGQL } from "./gql/index.mjs";
import { BASE_API } from "./BaseApi.mjs";
@CacheKey("TokenMangerApi")
export class TokenMangerApi {
  baseApi;
  defaultTokenListUrl = "https://raw.githubusercontent.com/magma-protocol/tokenList/main/magma.json";
  constructor() {
    this.baseApi = BASE_API;
  }
  async batchGetTokens(addresses) {
    const tokenAddressMap = groupBy(await this.getTokenByTokenList(), (it) => it.address);
    const tokens2 = await this.getTokenByContract(addresses);
    const tokenMap = {};
    addresses.forEach((it, index) => {
      const tokenListToken = tokenAddressMap[it.toLowerCase()] || [];
      tokenMap[it] = tokenListToken.length > 0 ? tokenListToken[0] : tokens2[index];
    });
    return tokenMap;
  }
  async tokenPrice(...tokens2) {
    const addresses = tokens2.map((it) => it.erc20Address().toLowerCase());
    const {
      bundles,
      tokens: tokenPrices
    } = await this.baseApi.exchangeGraph(TokenPriceGQL, { addresses });
    const _groupBy = groupBy(tokenPrices, (it) => it.id.toLowerCase());
    return tokens2.map((token) => {
      const mntPrice = get(bundles, "0.ethPriceUSD", "0");
      const groupByElementElement = _groupBy[token.erc20Address().toLowerCase()][0];
      if (groupByElementElement) {
        const price = groupByElementElement.derivedETH;
        const priceUSD = new BigNumber(price).times(mntPrice).toFixed();
        const priceMNT = new BigNumber(price).toFixed();
        return new TokenPrice(token, priceUSD, priceMNT);
      } else {
        return new TokenPrice(token, "0", "0");
      }
    });
  }
  async tokenList(url = "") {
    if (url === "") {
      const storageTokenListInfos = this.storageTokenListUrls();
      const tokenListInfos = [];
      for (const info of storageTokenListInfos) {
        const urls = this.uriToHttp(info.url);
        try {
          const tokenList = await this.searchTokenList(urls);
          const tokenListInfo = this.mapToTokenList(info, tokenList, true);
          tokenListInfos.push(tokenListInfo);
        } catch (e) {
          Trace.debug("showList error ignore", e);
        }
      }
      return tokenListInfos;
    } else {
      const urls = this.uriToHttp(url);
      if (urls.length === 0)
        throw new BasicException(`Unrecognized list URL protocol.`);
      const storageTokenListInfos = this.storageTokenListUrls();
      const tokenList = await this.searchTokenList(urls);
      const storageTokenListInfo = storageTokenListInfos.find((it) => it.url === url);
      return [
        this.mapToTokenList({
          url,
          enable: get(storageTokenListInfo, "enable", false)
        }, tokenList, !!storageTokenListInfo)
      ];
    }
  }
  async tokenSelectList(account, searchStr = "") {
    const search = searchStr.toLowerCase();
    let storageToken = this.storageToken();
    if (search !== "") {
      storageToken = storageToken.filter((it) => {
        return it.address.toLowerCase().includes(search) || it.symbol.toLowerCase().includes(search) || it.name.toLowerCase().includes(search);
      });
    }
    let balance = {};
    if (account !== "") {
      balance = await this.baseApi.address().readonlyConnectInfo().erc20().batchGetBalance(
        account,
        storageToken.map((it) => it.address)
      );
    }
    const mapToTokenManager = (token, tokenBalances) => {
      const tokenSelectInfo = new TokenSelectInfo();
      tokenSelectInfo.token = token;
      tokenSelectInfo.balance = tokenBalances[token.address]?.amount ?? "0";
      return tokenSelectInfo;
    };
    if (search === "") {
      return {
        searchTokens: [],
        customTokens: storageToken.map((it) => mapToTokenManager(it, balance))
      };
    } else {
      const tokenManager = await this.tokenManager(searchStr);
      return {
        searchTokens: tokenManager.searchTokens,
        customTokens: storageToken.map((it) => mapToTokenManager(it, balance))
      };
    }
  }
  async getTokenByTokenList() {
    try {
      return Array.from(await this.tokenList()).flatMap((it) => it.tokenList.tokens.map((it2) => Token.fromSerialized(it2))).filter((it) => it.chainId === this.baseApi.address().chainId);
    } catch (e) {
      Trace.error("getTokenByTokenList error ignore", e);
      return [];
    }
  }
  async getTokenByContract(addresses) {
    try {
      const addressInfo = this.baseApi.address();
      const tokenInfos = await addressInfo.readonlyConnectInfo().erc20().batchGetTokenInfo(...addresses);
      return tokenInfos.filter((it) => !isNullOrBlank(it.name) && !isNullOrBlank(it.symbol) && it.decimals > 0).map((it) => {
        return new Token(addressInfo.chainId, it.address, it.decimals, it.symbol, it.name, `https://agni.finance/static/${it.symbol}.png`);
      });
    } catch (e) {
      Trace.error("getTokenByContract error ignore", e);
      return [];
    }
  }
  async tokenManager(searchStr = "") {
    const search = searchStr.toLowerCase();
    const storageToken = this.storageToken();
    const mapToTokenManager = (token) => {
      const tokenManagerInfo = new TokenManagerInfo();
      tokenManagerInfo.token = token;
      tokenManagerInfo.remove = () => {
        this.storageTokenRemove(tokenManagerInfo.token);
      };
      return tokenManagerInfo;
    };
    if (search === "") {
      return {
        searchTokens: [],
        customTokens: storageToken.map((it) => mapToTokenManager(it))
      };
    } else {
      const searchTokens = [];
      const tokensByTokenList = Array.from(await this.getTokenByTokenList()).filter((it) => {
        return it.address.toLowerCase().includes(search) || it.symbol.toLowerCase().includes(search) || it.name.toLowerCase().includes(search);
      }).map((it) => this.mapToTokenAdd(it, storageToken));
      searchTokens.push(...tokensByTokenList);
      if (isAddress(search)) {
        const searchRpcTokens = (await this.getTokenByContract([search])).map((it) => this.mapToTokenAdd(it, storageToken));
        searchTokens.push(...searchRpcTokens);
      }
      const searchResult = [];
      const searchTokensSet = /* @__PURE__ */ new Set();
      for (const searchToken of searchTokens) {
        if (searchTokensSet.has(searchToken.token.address)) {
          searchResult.push(searchToken);
          searchTokensSet.add(searchToken.token.address);
        }
      }
      return {
        searchTokens: searchResult,
        customTokens: storageToken.filter((it) => {
          return it.address.toLowerCase().includes(search) || it.symbol.toLowerCase().includes(search) || it.name.toLowerCase().includes(search);
        }).map((it) => mapToTokenManager(it))
      };
    }
  }
  systemTokens() {
    return tokens.filter((t) => t.chainId === this.baseApi.address().chainId).map((it) => {
      return new Token(this.baseApi.address().chainId, it.address, it.decimals, it.symbol, it.name, it.logoURI);
    });
  }
  tradeTokens() {
    const addressInfo = this.baseApi.address();
    const systemTokens = this.systemTokens();
    return systemTokens.filter((it) => addressInfo.baseTradeToken.find((add) => eqAddress(it.address, add)));
  }
  WNATIVE() {
    const addressInfo = this.baseApi.address();
    const systemTokens = this.systemTokens();
    return systemTokens.find((it) => eqAddress(it.address, addressInfo.WMNT));
  }
  USDT() {
    const addressInfo = this.baseApi.address();
    const systemTokens = this.systemTokens();
    return systemTokens.find((it) => eqAddress(it.address, addressInfo.USDT));
  }
  NATIVE() {
    const systemTokens = this.systemTokens();
    return systemTokens.find((it) => eqAddress(it.address, ETH_ADDRESS));
  }
  async searchTokenList(urls) {
    for (let i = 0; i < urls.length; i++) {
      const isLast = i === urls.length - 1;
      let json;
      try {
        json = await this.baseApi.request(urls[i], "get", {}, {});
      } catch (e) {
        if (isLast)
          throw new Error(`Failed to download list ${urls[i]}`);
        continue;
      }
      if (json.tokens) {
        remove(json.tokens, (token) => {
          return token.symbol ? token.symbol.length === 0 : true;
        });
      }
      const tokenListValidator = new Ajv({ allErrors: true }).compile(AgniTokenListSchema);
      if (!tokenListValidator(json)) {
        const validationErrors = tokenListValidator.errors?.reduce((memo, error) => {
          const add = `${error.dataPath} ${error.message ?? ""}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, "") ?? "unknown error";
        if (isLast)
          throw new Error(`Token list failed validation: ${validationErrors}`);
        continue;
      }
      return json;
    }
    throw new Error("Unrecognized list URL protocol.");
  }
  mapToTokenAdd(token, storageToken) {
    const tokenManagerAddInfo = new TokenManagerAddInfo();
    tokenManagerAddInfo.active = !!storageToken.find((it) => eqAddress(it.address, token.address));
    tokenManagerAddInfo.token = token;
    tokenManagerAddInfo.import = () => {
      tokenManagerAddInfo.active = true;
      this.storageTokenAdd(tokenManagerAddInfo.token);
    };
    return tokenManagerAddInfo;
  }
  mapToTokenList(info, tokenList, showRemove) {
    const tokenListInfo = new TokenListInfo();
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
    let tokens2 = this.baseApi.address().storage.getArray(STORAGE_KEY_TOKENS);
    if (!tokens2) {
      tokens2 = this.systemTokens();
      this.baseApi.address().storage.setJson(STORAGE_KEY_TOKENS, tokens2);
    }
    return tokens2;
  }
  storageTokenAdd(token) {
    const tokens2 = this.storageToken();
    if (tokens2.find((it) => eqAddress(it.address, token.address)))
      return;
    tokens2.push(token);
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKENS, tokens2);
  }
  storageTokenRemove(token) {
    const tokens2 = this.storageToken().filter((it) => !eqAddress(it.address, token.address));
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKENS, tokens2);
  }
  storageTokenListUrls() {
    let storageTokenListInfos = this.baseApi.address().storage.getArray(STORAGE_KEY_TOKEN_LIST);
    if (!storageTokenListInfos) {
      storageTokenListInfos = [{
        url: this.defaultTokenListUrl,
        enable: true
      }];
      this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
    }
    return storageTokenListInfos;
  }
  storageTokenListUrlsAdd(storageTokenListInfo) {
    const storageTokenListInfos = this.storageTokenListUrls();
    if (storageTokenListInfos.find((it) => it.url === storageTokenListInfo.url))
      return;
    storageTokenListInfos.push(storageTokenListInfo);
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
  }
  storageTokenListUrlsUpdate(storageTokenListInfo) {
    const storageTokenListInfos = this.storageTokenListUrls();
    const find = storageTokenListInfos.find((it) => it.url === storageTokenListInfo.url);
    if (!find) {
      this.storageTokenListUrlsAdd(storageTokenListInfo);
    } else {
      find.enable = storageTokenListInfo.enable;
      this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
    }
  }
  storageTokenListUrlsRemove(storageTokenListInfo) {
    const strings = this.storageTokenListUrls().filter((it) => it.url !== storageTokenListInfo.url);
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, strings);
  }
  uriToHttp(uri) {
    const protocol = uri.split(":")[0].toLowerCase();
    switch (protocol) {
      case "https":
        return [uri];
      case "http":
        return [`https${uri.substring(4)}`, uri];
      case "ipfs": {
        const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
        return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
      }
      case "ipns": {
        const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
        return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
      }
      default:
        return [];
    }
  }
}
