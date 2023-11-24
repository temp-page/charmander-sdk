const CAN_SET_PROTOTYPE = "setPrototypeOf" in Object;
export class InsufficientReservesError extends Error {
  isInsufficientReservesError = true;
  constructor() {
    super();
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class InsufficientInputAmountError extends Error {
  isInsufficientInputAmountError = true;
  constructor() {
    super();
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(this, new.target.prototype);
  }
}
