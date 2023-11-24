import { BasicException } from "./BasicException.mjs";
let currentAddressInfo;
export function updateCurrentAddressInfo(addressInfo) {
  currentAddressInfo = addressInfo;
}
export function getCurrentAddressInfo() {
  if (currentAddressInfo === void 0)
    throw new BasicException("not initialized");
  return currentAddressInfo;
}
