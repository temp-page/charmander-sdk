"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INonfungiblePositionManager = exports.IAgniPool = exports.Multicall2 = exports.IERC20 = void 0;
/**
 * ABI
 */
const IERC20_json_1 = __importDefault(require("./IERC20.json"));
const Multicall2_json_1 = __importDefault(require("./Multicall2.json"));
const IAgniPool_json_1 = __importDefault(require("./core/IAgniPool.json"));
const INonfungiblePositionManager_json_1 = __importDefault(require("./periphery/INonfungiblePositionManager.json"));
const IERC20 = IERC20_json_1.default;
exports.IERC20 = IERC20;
const Multicall2 = Multicall2_json_1.default;
exports.Multicall2 = Multicall2;
const IAgniPool = IAgniPool_json_1.default;
exports.IAgniPool = IAgniPool;
const INonfungiblePositionManager = INonfungiblePositionManager_json_1.default;
exports.INonfungiblePositionManager = INonfungiblePositionManager;
