// Cost for crossing an uninitialized tick.
import { ChainId } from '../../sdk';
export const COST_PER_UNINIT_TICK = 0n;
export function BASE_SWAP_COST_V3(id) {
    switch (id) {
        case ChainId.MANTLE:
        case ChainId.MANTLE_TESTNET:
            // case ChainId.ETHEREUM:
            // case ChainId.GOERLI:
            return 2000n;
        default:
            return 0n;
    }
}
export function COST_PER_INIT_TICK(id) {
    switch (id) {
        case ChainId.MANTLE:
        case ChainId.MANTLE_TESTNET:
            return 31000n;
        default:
            return 0n;
    }
}
export function COST_PER_HOP_V3(id) {
    switch (id) {
        case ChainId.MANTLE:
        case ChainId.MANTLE_TESTNET:
            return 80000n;
        default:
            return 0n;
    }
}
export * from './poolSelector';
export * from './routeConfig';
