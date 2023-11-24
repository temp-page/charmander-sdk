"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WETHAbi = exports.RUSDYAbi = exports.Multicall2 = exports.InsurancePool = exports.IdoPool = exports.ISwapRouter = exports.IStakingPool = exports.IQuoterV2 = exports.INonfungiblePositionManager = exports.IERC20 = exports.IAgniPool = exports.GasLimitMulticall = exports.AgniProjectPartyRewardAbi = void 0;
var _IERC = _interopRequireDefault(require("./IERC20.json"));
var _Multicall = _interopRequireDefault(require("./Multicall2.json"));
var _IAgniPool = _interopRequireDefault(require("./core/IAgniPool.json"));
var _INonfungiblePositionManager = _interopRequireDefault(require("./periphery/INonfungiblePositionManager.json"));
var _IQuoterV = _interopRequireDefault(require("./periphery/IQuoterV2.json"));
var _IStakingPool = _interopRequireDefault(require("./launchpad/IStakingPool.json"));
var _IInsurancePool = _interopRequireDefault(require("./launchpad/IInsurancePool.json"));
var _IIdoPool = _interopRequireDefault(require("./launchpad/IIdoPool.json"));
var _GasLimitMulticall = _interopRequireDefault(require("./GasLimitMulticall.json"));
var _RUSDY = _interopRequireDefault(require("./RUSDY.json"));
var _WETH = _interopRequireDefault(require("./WETH.json"));
var _ISwapRouter = _interopRequireDefault(require("./periphery/ISwapRouter.json"));
var _AgniProjectPartyReward = _interopRequireDefault(require("./AgniProjectPartyReward.json"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const IERC20 = exports.IERC20 = _IERC.default;
const Multicall2 = exports.Multicall2 = _Multicall.default;
const IAgniPool = exports.IAgniPool = _IAgniPool.default;
const INonfungiblePositionManager = exports.INonfungiblePositionManager = _INonfungiblePositionManager.default;
const IStakingPool = exports.IStakingPool = _IStakingPool.default;
const InsurancePool = exports.InsurancePool = _IInsurancePool.default;
const IdoPool = exports.IdoPool = _IIdoPool.default;
const IQuoterV2 = exports.IQuoterV2 = _IQuoterV.default;
const GasLimitMulticall = exports.GasLimitMulticall = _GasLimitMulticall.default;
const ISwapRouter = exports.ISwapRouter = _ISwapRouter.default;
const RUSDYAbi = exports.RUSDYAbi = _RUSDY.default;
const WETHAbi = exports.WETHAbi = _WETH.default;
const AgniProjectPartyRewardAbi = exports.AgniProjectPartyRewardAbi = _AgniProjectPartyReward.default;