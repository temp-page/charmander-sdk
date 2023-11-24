import { ChainId } from "../../sdk/index.mjs";
export const COST_PER_UNINIT_TICK = 0n;
export function BASE_SWAP_COST_V3(id) {
  switch (id) {
    case ChainId.MANTLE:
    case ChainId.MANTLE_TESTNET:
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
export * from "./poolSelector.mjs";
export * from "./routeConfig.mjs";
