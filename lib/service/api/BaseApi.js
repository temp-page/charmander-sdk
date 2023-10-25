"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_API = exports.BaseApi = void 0;
const axios_1 = __importDefault(require("axios"));
const tool_1 = require("../tool");
const graphql_request_1 = require("graphql-request");
const BasicException_1 = require("../../BasicException");
const Constant_1 = require("../../Constant");
class BaseApi {
    async request(path, method, data, config = {
        headers: {},
    }) {
        return await new Promise((resolve, reject) => {
            const requestUrl = path;
            const req = {
                url: requestUrl,
                method,
                params: undefined,
                data: undefined,
                headers: {},
            };
            if (['get', 'delete'].indexOf(method.toLowerCase()) > -1) {
                req.params = data;
            }
            else {
                req.data = data;
            }
            if (config.headers) {
                req.headers = config.headers;
            }
            (0, axios_1.default)(req)
                .then((res) => {
                tool_1.Trace.debug(`request success ${method} ${requestUrl} data =`, data, `result = `, res.data);
                resolve(res.data);
            })
                .catch((err) => {
                tool_1.Trace.debug(`request error ${method} ${requestUrl} data =`, data, `error = `, err);
                const msg = 'Network Error';
                reject(msg);
            });
        });
    }
    async graphBase(fullUrl, query, variables) {
        tool_1.Trace.debug(`graph node request: ${fullUrl}`, query, variables);
        try {
            const t = await (0, graphql_request_1.request)(fullUrl, query, variables);
            tool_1.Trace.debug(`graph node request success data =`, t);
            return t;
        }
        catch (e) {
            tool_1.Trace.debug('graph node request error', e);
            throw new BasicException_1.BasicException('Request failed', e);
        }
    }
    async blockGraph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().blockGraphApi, query, variables);
    }
    async exchangeGraph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().exchangeGraphApi, query, variables);
    }
    async launchpadGraph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().launchpadGraphApi, query, variables);
    }
    connectInfo() {
        return (0, Constant_1.getCurrentAddressInfo)().readonlyConnectInfo();
    }
    address() {
        return (0, Constant_1.getCurrentAddressInfo)();
    }
}
exports.BaseApi = BaseApi;
exports.BASE_API = new BaseApi();
