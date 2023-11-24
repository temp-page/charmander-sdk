"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUOTER_TRADE_GAS = exports.MAX_GAS_LIMIT = exports.CHUNK_SIZE = void 0;
exports.multicallExecute = multicallExecute;
var _chunk = _interopRequireDefault(require("lodash/chunk"));
var _service = require("../service/index.cjs");
var _abi = require("./abi.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MAX_GAS_LIMIT = exports.MAX_GAS_LIMIT = 3e7;
const QUOTER_TRADE_GAS = exports.QUOTER_TRADE_GAS = 3e6;
const CHUNK_SIZE = exports.CHUNK_SIZE = 255;
async function multicallExecute(multicall, calls) {
  const callRequests = calls.map(call => {
    const callData = _abi.Abi.encode(call.name, call.inputs, call.params);
    return {
      target: call.contract.address,
      callData
    };
  });
  const callRequestsChuck = (0, _chunk.default)(callRequests, CHUNK_SIZE);
  try {
    const response = [];
    for (const callChuck of callRequestsChuck) {
      const result = await multicall.tryAggregate.staticCall(false, callChuck, {
        gasLimit: MAX_GAS_LIMIT
      });
      response.push(...result);
    }
    const callCount = calls.length;
    const callResult = [];
    for (let i = 0; i < callCount; i++) {
      const outputs = calls[i].outputs;
      const result = response[i];
      if (result.success) {
        const params = _abi.Abi.decode(outputs, result.returnData);
        callResult.push(params);
      } else {
        callResult.push(void 0);
      }
    }
    return callResult;
  } catch (e) {
    _service.Trace.error("multicall call error", e);
    throw e;
  }
}