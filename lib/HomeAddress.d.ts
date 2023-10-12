import { AddressInfo } from "./service";
export declare class HomeAddress extends AddressInfo {
    chainName: string;
}
export declare function initAddress(ENV: string): void;
export declare function getAddressInfo(): HomeAddress;
