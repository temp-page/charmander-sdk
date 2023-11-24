"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  COST_PER_UNINIT_TICK: true,
  BASE_SWAP_COST_V3: true,
  COST_PER_INIT_TICK: true,
  COST_PER_HOP_V3: true
};
exports.BASE_SWAP_COST_V3 = BASE_SWAP_COST_V3;
exports.COST_PER_HOP_V3 = COST_PER_HOP_V3;
exports.COST_PER_INIT_TICK = COST_PER_INIT_TICK;
exports.COST_PER_UNINIT_TICK = void 0;
var _sdk = require("../../sdk/index.cjs");
var _poolSelector = require("./poolSelector.cjs");
Object.keys(_poolSelector).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _poolSelector[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _poolSelector[key];
    }
  });
});
var _routeConfig = require("./routeConfig.cjs");
Object.keys(_routeConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _routeConfig[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _routeConfig[key];
    }
  });
});
const COST_PER_UNINIT_TICK = exports.COST_PER_UNINIT_TICK = 0n;
function BASE_SWAP_COST_V3(id) {
  switch (id) {
    case _sdk.ChainId.MANTLE:
    case _sdk.ChainId.MANTLE_TESTNET:
      return 2000n;
    default:
      return 0n;
  }
}
function COST_PER_INIT_TICK(id) {
  switch (id) {
    case _sdk.ChainId.MANTLE:
    case _sdk.ChainId.MANTLE_TESTNET:
      return 31000n;
    default:
      return 0n;
  }
}
function COST_PER_HOP_V3(id) {
  switch (id) {
    case _sdk.ChainId.MANTLE:
    case _sdk.ChainId.MANTLE_TESTNET:
      return 80000n;
    default:
      return 0n;
  }
}