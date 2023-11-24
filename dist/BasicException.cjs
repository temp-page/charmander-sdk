"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicException = void 0;
class BasicException extends Error {
  static CODE = 400;
  static SAFE_CHECK = 999999;
  _code = BasicException.CODE;
  _msg = "";
  _sourceError;
  _detail = {};
  /**
   * @param msg
   * @param code
   * @param sourceError
   * @param detail
   */
  constructor(msg = "", sourceError = void 0, code = BasicException.CODE, detail = {}) {
    super(msg);
    this.name = "BasicException";
    this._msg = msg;
    this._code = code;
    this._sourceError = sourceError;
    this._detail = detail;
  }
  get code() {
    return this._code;
  }
  /**
   * 错误信息
   */
  get msg() {
    return this._msg;
  }
  /**
   * 其他数据
   */
  get detail() {
    return this._detail;
  }
  get sourceError() {
    return this._sourceError;
  }
  toString() {
    return `${this._msg}`;
  }
}
exports.BasicException = BasicException;