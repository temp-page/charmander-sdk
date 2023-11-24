"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsufficientReservesError = exports.InsufficientInputAmountError = void 0;
const CAN_SET_PROTOTYPE = ("setPrototypeOf" in Object);
class InsufficientReservesError extends Error {
  isInsufficientReservesError = true;
  constructor() {
    super();
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(this, new.target.prototype);
  }
}
exports.InsufficientReservesError = InsufficientReservesError;
class InsufficientInputAmountError extends Error {
  isInsufficientInputAmountError = true;
  constructor() {
    super();
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(this, new.target.prototype);
  }
}
exports.InsufficientInputAmountError = InsufficientInputAmountError;