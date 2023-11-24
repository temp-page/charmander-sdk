import { BasicException } from './BasicException';
let currentAddressInfo;
export function updateCurrentAddressInfo(addressInfo) {
    currentAddressInfo = addressInfo;
}
export function getCurrentAddressInfo() {
    if (currentAddressInfo === undefined)
        throw new BasicException('not initialized');
    return currentAddressInfo;
}
