"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageProvider = exports.STORAGE_KEY_TOKEN_LIST = exports.STORAGE_KEY_TOKENS = void 0;
var _Tool = require("./Tool.cjs");
let data = {};
const STORAGE_KEY_TOKEN_LIST = exports.STORAGE_KEY_TOKEN_LIST = "STORAGE_KEY_TOKEN_LIST";
const STORAGE_KEY_TOKENS = exports.STORAGE_KEY_TOKENS = "STORAGE_KEY_TOKENS";
class StorageProvider {
  type;
  constructor(type) {
    this.type = type;
  }
  get(key) {
    switch (this.type) {
      case "web":
        return localStorage.getItem(key) || "";
      case "node":
        return data[key] || "";
    }
    return "";
  }
  getArray(key) {
    const str = this.get(key);
    let dataList;
    if (str) {
      try {
        const data2 = JSON.parse(str);
        if (Array.isArray(data2)) dataList = data2;
      } catch (e) {
        _Tool.Trace.debug("StorageProvider.getArray", e);
      }
    }
    return dataList;
  }
  getObj(key) {
    const str = this.get(key);
    let result = null;
    if (str) {
      try {
        const data2 = JSON.parse(str);
        if (!Array.isArray(data2)) result = data2;
      } catch (e) {
        _Tool.Trace.debug("StorageProvider.getObj", e);
      }
    }
    return result;
  }
  set(key, value) {
    switch (this.type) {
      case "web":
        localStorage.setItem(key, value);
        break;
      case "node":
        data[key] = value;
        break;
    }
  }
  setJson(key, value) {
    this.set(key, JSON.stringify(value));
  }
  clearKey(key) {
    switch (this.type) {
      case "web":
        localStorage.removeItem(key);
        break;
      case "node":
        delete data[key];
        break;
    }
  }
  clear() {
    switch (this.type) {
      case "web":
        localStorage.clear();
        break;
      case "node":
        data = {};
        break;
    }
  }
}
exports.StorageProvider = StorageProvider;