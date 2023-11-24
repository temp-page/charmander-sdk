"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseApi = exports.BASE_API = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _graphqlRequest = require("graphql-request");
var _tool = require("../tool/index.cjs");
var _BasicException = require("../../BasicException.cjs");
var _Constant = require("../../Constant.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class BaseApi {
  async request(path, method, data, config = {
    headers: {}
  }) {
    return await new Promise((resolve, reject) => {
      const requestUrl = path;
      const req = {
        url: requestUrl,
        method,
        params: void 0,
        data: void 0,
        headers: {}
      };
      if (["get", "delete"].includes(method.toLowerCase())) req.params = data;else req.data = data;
      if (config.headers) req.headers = config.headers;
      (0, _axios.default)(req).then(res => {
        _tool.Trace.debug(`request success ${method} ${requestUrl} data =`, data, `result = `, res.data);
        resolve(res.data);
      }).catch(err => {
        _tool.Trace.debug(`request error ${method} ${requestUrl} data =`, data, `error = `, err);
        const msg = "Network Error";
        reject(msg);
      });
    });
  }
  async graphBase(fullUrl, query, variables) {
    _tool.Trace.debug(`graph node request: ${fullUrl}`, query, variables);
    try {
      const t = await (0, _graphqlRequest.request)(fullUrl, query, variables);
      _tool.Trace.debug(`graph node request success data =`, t);
      return t;
    } catch (e) {
      _tool.Trace.debug("graph node request error", e);
      throw new _BasicException.BasicException("Request failed", e);
    }
  }
  async blockGraph(query, variables) {
    return this.graphBase((0, _Constant.getCurrentAddressInfo)().blockGraphApi, query, variables);
  }
  async projectPartyRewardGraph(query, variables) {
    return this.graphBase((0, _Constant.getCurrentAddressInfo)().projectPartyRewardGraphApi, query, variables);
  }
  async exchangeGraph(query, variables) {
    return this.graphBase((0, _Constant.getCurrentAddressInfo)().exchangeGraphApi, query, variables);
  }
  async launchpadGraph(query, variables) {
    return this.graphBase((0, _Constant.getCurrentAddressInfo)().launchpadGraphApi, query, variables);
  }
  connectInfo() {
    return (0, _Constant.getCurrentAddressInfo)().readonlyConnectInfo();
  }
  address() {
    return (0, _Constant.getCurrentAddressInfo)();
  }
}
exports.BaseApi = BaseApi;
const BASE_API = exports.BASE_API = new BaseApi();