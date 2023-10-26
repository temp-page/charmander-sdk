"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdoPool = exports.InsurancePool = exports.IStakingPool = exports.INonfungiblePositionManager = exports.IAgniPool = exports.Multicall2 = exports.IERC20 = void 0;
/**
 * ABI
 */
const IERC20_json_1 = __importDefault(require("./IERC20.json"));
const Multicall2_json_1 = __importDefault(require("./Multicall2.json"));
const IAgniPool_json_1 = __importDefault(require("./core/IAgniPool.json"));
const INonfungiblePositionManager_json_1 = __importDefault(require("./periphery/INonfungiblePositionManager.json"));
const IStakingPool_json_1 = __importDefault(require("./launchpad/IStakingPool.json"));
const IInsurancePool_json_1 = __importDefault(require("./launchpad/IInsurancePool.json"));
const IIdoPool_json_1 = __importDefault(require("./launchpad/IIdoPool.json"));
exports.IERC20 = IERC20_json_1.default;
exports.Multicall2 = Multicall2_json_1.default;
exports.IAgniPool = IAgniPool_json_1.default;
exports.INonfungiblePositionManager = INonfungiblePositionManager_json_1.default;
exports.IStakingPool = IStakingPool_json_1.default;
exports.InsurancePool = IInsurancePool_json_1.default;
exports.IdoPool = IIdoPool_json_1.default;
