"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Abi = void 0;
var _ethers = require("ethers");
var _service = require("../service/index.cjs");
class Abi {
  static encode(name, inputs, params) {
    try {
      const functionSignature = getFunctionSignature(name, inputs);
      const functionHash = (0, _ethers.keccak256)((0, _ethers.toUtf8Bytes)(functionSignature));
      const functionData = functionHash.substring(2, 10);
      const abiCoder = new _ethers.AbiCoder();
      const argumentString = abiCoder.encode(inputs, params);
      const argumentData = argumentString.substring(2);
      const inputData = `0x${functionData}${argumentData}`;
      return inputData;
    } catch (e) {
      _service.Trace.error("Abi encode error", name, inputs, params, e);
      throw e;
    }
  }
  static decode(outputs, data) {
    try {
      const abiCoder = _ethers.ethers.AbiCoder.defaultAbiCoder();
      let params = abiCoder.decode(outputs, data);
      const newParams = [];
      for (let i = 0; i < outputs.length; i++) {
        newParams[i] = params[i];
        const output = outputs[i];
        if (typeof output !== "string" && output.name !== "") newParams[output.name] = params[i];
      }
      params = outputs.length === 1 ? params[0] : newParams;
      const dataToString = data2 => {
        if (Array.isArray(data2)) {
          const result = [];
          for (const key in data2) {
            if (Object.prototype.hasOwnProperty.call(data2, key)) result[key] = dataToString(data2[key]);
          }
          return result;
        } else {
          if ((0, _service.isNullOrUndefined)(data2)) data2 = void 0;else data2 = data2.toString();
        }
        return data2;
      };
      params = dataToString(params);
      return params;
    } catch (e) {
      _service.Trace.error("Abi decode error", outputs, data, e);
      return void 0;
    }
  }
}
exports.Abi = Abi;
function getFunctionSignature(name, inputs) {
  const types = [];
  for (const input of inputs) {
    if (input.type === "tuple") {
      const tupleString = getFunctionSignature("", input.components);
      types.push(tupleString);
      continue;
    }
    if (input.type === "tuple[]") {
      const tupleString = getFunctionSignature("", input.components);
      const arrayString = `${tupleString}[]`;
      types.push(arrayString);
      continue;
    }
    types.push(input.type);
  }
  const typeString = types.join(",");
  const functionSignature = `${name}(${typeString})`;
  return functionSignature;
}