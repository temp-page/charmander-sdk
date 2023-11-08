import BigNumber from 'bignumber.js';
export { default as BigNumber } from 'bignumber.js';
import { get, template, chunk, toPairs, fromPairs, flatMap, groupBy, remove } from 'lodash-es';
import { BrowserProvider, keccak256, toUtf8Bytes, AbiCoder, ethers, FunctionFragment, Fragment, Contract, solidityPackedKeccak256, getCreate2Address, isAddress, JsonRpcProvider } from 'ethers';
import axios from 'axios';
import { request, gql } from 'graphql-request';
import Ajv from 'ajv';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var IERC20$1 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const IERC20Abi = /*@__PURE__*/getDefaultExportFromCjs(IERC20$1);

var Multicall2$1 = [
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "aggregate",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				internalType: "bytes[]",
				name: "returnData",
				type: "bytes[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "blockAndAggregate",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				internalType: "bytes32",
				name: "blockHash",
				type: "bytes32"
			},
			{
				components: [
					{
						internalType: "bool",
						name: "success",
						type: "bool"
					},
					{
						internalType: "bytes",
						name: "returnData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Result[]",
				name: "returnData",
				type: "tuple[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			}
		],
		name: "getBlockHash",
		outputs: [
			{
				internalType: "bytes32",
				name: "blockHash",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getBlockNumber",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getCurrentBlockCoinbase",
		outputs: [
			{
				internalType: "address",
				name: "coinbase",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getCurrentBlockDifficulty",
		outputs: [
			{
				internalType: "uint256",
				name: "difficulty",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getCurrentBlockGasLimit",
		outputs: [
			{
				internalType: "uint256",
				name: "gaslimit",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getCurrentBlockTimestamp",
		outputs: [
			{
				internalType: "uint256",
				name: "timestamp",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "addr",
				type: "address"
			}
		],
		name: "getEthBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "balance",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getLastBlockHash",
		outputs: [
			{
				internalType: "bytes32",
				name: "blockHash",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "requireSuccess",
				type: "bool"
			},
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "tryAggregate",
		outputs: [
			{
				components: [
					{
						internalType: "bool",
						name: "success",
						type: "bool"
					},
					{
						internalType: "bytes",
						name: "returnData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Result[]",
				name: "returnData",
				type: "tuple[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "requireSuccess",
				type: "bool"
			},
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "tryBlockAndAggregate",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				internalType: "bytes32",
				name: "blockHash",
				type: "bytes32"
			},
			{
				components: [
					{
						internalType: "bool",
						name: "success",
						type: "bool"
					},
					{
						internalType: "bytes",
						name: "returnData",
						type: "bytes"
					}
				],
				internalType: "struct Multicall2.Result[]",
				name: "returnData",
				type: "tuple[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const Multicall2Abi = /*@__PURE__*/getDefaultExportFromCjs(Multicall2$1);

var IAgniPool$1 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Burn",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		name: "Collect",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		name: "CollectProtocol",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "paid0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "paid1",
				type: "uint256"
			}
		],
		name: "Flash",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "observationCardinalityNextOld",
				type: "uint16"
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "observationCardinalityNextNew",
				type: "uint16"
			}
		],
		name: "IncreaseObservationCardinalityNext",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			},
			{
				indexed: false,
				internalType: "int24",
				name: "tick",
				type: "int24"
			}
		],
		name: "Initialize",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Mint",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint32",
				name: "feeProtocol0Old",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "feeProtocol1Old",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "feeProtocol0New",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "feeProtocol1New",
				type: "uint32"
			}
		],
		name: "SetFeeProtocol",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "amount0",
				type: "int256"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "amount1",
				type: "int256"
			},
			{
				indexed: false,
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "int24",
				name: "tick",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "protocolFeesToken0",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "protocolFeesToken1",
				type: "uint128"
			}
		],
		name: "Swap",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			}
		],
		name: "burn",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "amount0Requested",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1Requested",
				type: "uint128"
			}
		],
		name: "collect",
		outputs: [
			{
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint128",
				name: "amount0Requested",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1Requested",
				type: "uint128"
			}
		],
		name: "collectProtocol",
		outputs: [
			{
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "fee",
		outputs: [
			{
				internalType: "uint24",
				name: "",
				type: "uint24"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeGrowthGlobal0X128",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeGrowthGlobal1X128",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "flash",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "observationCardinalityNext",
				type: "uint16"
			}
		],
		name: "increaseObservationCardinalityNext",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "liquidity",
		outputs: [
			{
				internalType: "uint128",
				name: "",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "maxLiquidityPerTick",
		outputs: [
			{
				internalType: "uint128",
				name: "",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "observations",
		outputs: [
			{
				internalType: "uint32",
				name: "blockTimestamp",
				type: "uint32"
			},
			{
				internalType: "int56",
				name: "tickCumulative",
				type: "int56"
			},
			{
				internalType: "uint160",
				name: "secondsPerLiquidityCumulativeX128",
				type: "uint160"
			},
			{
				internalType: "bool",
				name: "initialized",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint32[]",
				name: "secondsAgos",
				type: "uint32[]"
			}
		],
		name: "observe",
		outputs: [
			{
				internalType: "int56[]",
				name: "tickCumulatives",
				type: "int56[]"
			},
			{
				internalType: "uint160[]",
				name: "secondsPerLiquidityCumulativeX128s",
				type: "uint160[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "positions",
		outputs: [
			{
				internalType: "uint128",
				name: "_liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside0LastX128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside1LastX128",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "tokensOwed0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "tokensOwed1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "protocolFees",
		outputs: [
			{
				internalType: "uint128",
				name: "token0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "token1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint32",
				name: "feeProtocol0",
				type: "uint32"
			},
			{
				internalType: "uint32",
				name: "feeProtocol1",
				type: "uint32"
			}
		],
		name: "setFeeProtocol",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "lmPool",
				type: "address"
			}
		],
		name: "setLmPool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "slot0",
		outputs: [
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			},
			{
				internalType: "int24",
				name: "tick",
				type: "int24"
			},
			{
				internalType: "uint16",
				name: "observationIndex",
				type: "uint16"
			},
			{
				internalType: "uint16",
				name: "observationCardinality",
				type: "uint16"
			},
			{
				internalType: "uint16",
				name: "observationCardinalityNext",
				type: "uint16"
			},
			{
				internalType: "uint32",
				name: "feeProtocol",
				type: "uint32"
			},
			{
				internalType: "bool",
				name: "unlocked",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			}
		],
		name: "snapshotCumulativesInside",
		outputs: [
			{
				internalType: "int56",
				name: "tickCumulativeInside",
				type: "int56"
			},
			{
				internalType: "uint160",
				name: "secondsPerLiquidityInsideX128",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "secondsInside",
				type: "uint32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "bool",
				name: "zeroForOne",
				type: "bool"
			},
			{
				internalType: "int256",
				name: "amountSpecified",
				type: "int256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceLimitX96",
				type: "uint160"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "swap",
		outputs: [
			{
				internalType: "int256",
				name: "amount0",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1",
				type: "int256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int16",
				name: "wordPosition",
				type: "int16"
			}
		],
		name: "tickBitmap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "tickSpacing",
		outputs: [
			{
				internalType: "int24",
				name: "",
				type: "int24"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int24",
				name: "tick",
				type: "int24"
			}
		],
		name: "ticks",
		outputs: [
			{
				internalType: "uint128",
				name: "liquidityGross",
				type: "uint128"
			},
			{
				internalType: "int128",
				name: "liquidityNet",
				type: "int128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthOutside0X128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthOutside1X128",
				type: "uint256"
			},
			{
				internalType: "int56",
				name: "tickCumulativeOutside",
				type: "int56"
			},
			{
				internalType: "uint160",
				name: "secondsPerLiquidityOutsideX128",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "secondsOutside",
				type: "uint32"
			},
			{
				internalType: "bool",
				name: "initialized",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token0",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token1",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

const IAgniPoolAbi = /*@__PURE__*/getDefaultExportFromCjs(IAgniPool$1);

var INonfungiblePositionManager$1 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Collect",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "DecreaseLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "IncreaseLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
		],
		name: "WMNT",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "balance",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "burn",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint128",
						name: "amount0Max",
						type: "uint128"
					},
					{
						internalType: "uint128",
						name: "amount1Max",
						type: "uint128"
					}
				],
				internalType: "struct INonfungiblePositionManager.CollectParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "collect",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			}
		],
		name: "createAndInitializePoolIfNecessary",
		outputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint128",
						name: "liquidity",
						type: "uint128"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.DecreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "decreaseLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "deployer",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "getApproved",
		outputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.IncreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "increaseLiquidity",
		outputs: [
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "isApprovedForAll",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "token0",
						type: "address"
					},
					{
						internalType: "address",
						name: "token1",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "int24",
						name: "tickLower",
						type: "int24"
					},
					{
						internalType: "int24",
						name: "tickUpper",
						type: "int24"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.MintParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ownerOf",
		outputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "positions",
		outputs: [
			{
				internalType: "uint96",
				name: "nonce",
				type: "uint96"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside0LastX128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside1LastX128",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "tokensOwed0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "tokensOwed1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundMNT",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "bool",
				name: "_approved",
				type: "bool"
			}
		],
		name: "setApprovalForAll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenOfOwnerByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "tokenURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWMNT",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];

const INonfungiblePositionManagerAbi = /*@__PURE__*/getDefaultExportFromCjs(INonfungiblePositionManager$1);

var IQuoterV2$1 = [
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		name: "quoteExactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "sqrtPriceX96AfterList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactInputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96After",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "initializedTicksCrossed",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "quoteExactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "sqrtPriceX96AfterList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactOutputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96After",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "initializedTicksCrossed",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const IQuoterV2Abi$1 = /*@__PURE__*/getDefaultExportFromCjs(IQuoterV2$1);

var IStakingPool$1 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "oldPeriod",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newPeriod",
				type: "uint256"
			}
		],
		name: "LockPeriodUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "oldCalculator",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newCalculator",
				type: "address"
			}
		],
		name: "ScoreCalculatorUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenIdOrAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "unlockTime",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "score",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "stakeId",
				type: "uint256"
			}
		],
		name: "Staked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "StakingTokenAdded",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "StakingTokenRemoved",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "oldScore",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newScore",
				type: "uint256"
			}
		],
		name: "TierScoreUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "stakeId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenIdOrAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "score",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			}
		],
		name: "Unstaked",
		type: "event"
	},
	{
		inputs: [
		],
		name: "WMNT",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "addStakingToken",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			}
		],
		name: "getScoreByTier",
		outputs: [
			{
				internalType: "uint256",
				name: "score",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "stakeId",
				type: "uint256"
			}
		],
		name: "getStakeInfo",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "user",
						type: "address"
					},
					{
						internalType: "address",
						name: "token",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "tokenIdOrAmount",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "unlockTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "score",
						type: "uint256"
					},
					{
						internalType: "bool",
						name: "unstaked",
						type: "bool"
					},
					{
						internalType: "bool",
						name: "isERC721",
						type: "bool"
					}
				],
				internalType: "struct IStakingPool.StakeInfo",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "score",
				type: "uint256"
			}
		],
		name: "getTierByScore",
		outputs: [
			{
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getUserScore",
		outputs: [
			{
				internalType: "uint256",
				name: "score",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getUserTier",
		outputs: [
			{
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "isStakingToken",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "lockPeriod",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "removeStakingToken",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "scoreCalculator",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tier",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "score",
				type: "uint256"
			}
		],
		name: "setTierScore",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenIdOrAmount",
				type: "uint256"
			}
		],
		name: "stake",
		outputs: [
			{
				internalType: "uint256",
				name: "stakeId",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stakeNativeToken",
		outputs: [
			{
				internalType: "uint256",
				name: "stakeId",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "stakeIds",
				type: "uint256[]"
			}
		],
		name: "unstake",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "newPeriod",
				type: "uint256"
			}
		],
		name: "updateLockPeriod",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newCalculator",
				type: "address"
			}
		],
		name: "updateScoreCalculator",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const IStakingPoolAbi = /*@__PURE__*/getDefaultExportFromCjs(IStakingPool$1);

var IInsurancePool = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "idoPool",
				type: "address"
			}
		],
		name: "IdoPoolRegistered",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "idoPool",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "buyQuota",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "price",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "insuranceId",
				type: "uint256"
			}
		],
		name: "Insured",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "insuranceId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "payAmount",
				type: "uint256"
			}
		],
		name: "LossClaimed",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "insuranceId",
				type: "uint256"
			}
		],
		name: "claimLoss",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		name: "getIdoPoolInfo",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "paymentToken",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "presalePrice",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "publicSalePrice",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "avgPrice",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "presaleTotalQuota",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "publicSaleTotalQuota",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "needToPay",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "sellingTokenExp",
						type: "uint256"
					}
				],
				internalType: "struct IInsurancePool.IdoPoolInfo",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "insuranceId",
				type: "uint256"
			}
		],
		name: "getInsuranceDetail",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "idoPool",
						type: "address"
					},
					{
						internalType: "address",
						name: "token",
						type: "address"
					},
					{
						internalType: "address",
						name: "user",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "buyQuota",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "price",
						type: "uint256"
					},
					{
						internalType: "bool",
						name: "lossClaimed",
						type: "bool"
					}
				],
				internalType: "struct IInsurancePool.InsuranceDetail",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getInsuranceIdsByUser",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "buyQuota",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "price",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "isPresale",
				type: "bool"
			}
		],
		name: "insure",
		outputs: [
			{
				internalType: "uint256",
				name: "insuranceId",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		name: "isRegisteredPool",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "idoPool",
				type: "address"
			}
		],
		name: "registerIdoPool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "price",
				type: "uint256"
			}
		],
		name: "setAvgPrice",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "totalNeedToPayByToken",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

const InsurancePoolAbi$1 = /*@__PURE__*/getDefaultExportFromCjs(IInsurancePool);

var IIdoPool = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "transferAmount",
				type: "uint256"
			}
		],
		name: "CallbackFromInsurance",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "claimedAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "refund",
				type: "uint256"
			}
		],
		name: "Claimed",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "buyQuota",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "buyInsurance",
				type: "bool"
			}
		],
		name: "PresaleDeposited",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address[]",
				name: "users",
				type: "address[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "quotas",
				type: "uint256[]"
			}
		],
		name: "PresaleWhiteListSet",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "buyQuota",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "extraDeposit",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "buyInsurance",
				type: "bool"
			}
		],
		name: "PublicSaleDeposited",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address[]",
				name: "users",
				type: "address[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "quotas",
				type: "uint256[]"
			}
		],
		name: "PublicSaleListSet",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "UserEnrolled",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "users",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "quotas",
				type: "uint256[]"
			}
		],
		name: "addPresaleWhitelist",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "users",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "quotas",
				type: "uint256[]"
			}
		],
		name: "addPublicSaleList",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "transferAmount",
				type: "uint256"
			}
		],
		name: "callbackFromInsurance",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "claim",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "claimStartTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "claimable",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "deductedByInsurance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "enroll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "fundraiser",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getPresaleQuota",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getPublicSaleQuota",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "getUserIDO",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "totalPurchased",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "tgeUnlocked",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "refundable",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "claimed",
						type: "uint256"
					},
					{
						internalType: "uint256[]",
						name: "insuranceIds",
						type: "uint256[]"
					}
				],
				internalType: "struct IIdoPool.UserIDO",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "totalSupply_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "presalePrice_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "publicSalePrice_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "presaleAndEnrollStartTime_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "presaleAndEnrollPeriod_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "publicSaleDepositStartTime_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "publicSaleDepositPeriod_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "claimStartTime_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "lockPeriod_",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "tgeUnlockRatio_",
				type: "uint8"
			}
		],
		name: "initParams",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "factory_",
				type: "address"
			},
			{
				internalType: "address",
				name: "insurancePool_",
				type: "address"
			},
			{
				internalType: "address",
				name: "stakingPool_",
				type: "address"
			},
			{
				internalType: "address",
				name: "platformTreasury_",
				type: "address"
			},
			{
				internalType: "address",
				name: "fundraiser_",
				type: "address"
			},
			{
				internalType: "address",
				name: "raisingToken_",
				type: "address"
			},
			{
				internalType: "address",
				name: "sellingToken_",
				type: "address"
			},
			{
				internalType: "uint8",
				name: "insuranceFeeRate_",
				type: "uint8"
			},
			{
				internalType: "uint8",
				name: "platformCommissionFeeRate_",
				type: "uint8"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "insuranceFeeRate",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "insurancePool",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "isEnrolled",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "minBuyQuota",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "platformCommissionFeeRate",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "platformTreasury",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "presaleAndEnrollEndTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "presaleAndEnrollStartTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "buyQuota",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "buyInsurance",
				type: "bool"
			}
		],
		name: "presaleDeposit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "presaleDeposited",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "presalePrice",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "buyInsurance",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "buyQuota",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "extraDeposit",
				type: "uint256"
			}
		],
		name: "publicSaleDeposit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "publicSaleDepositEndTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "publicSaleDepositStartTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "publicSaleDeposited",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "publicSalePrice",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "raisingToken",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			}
		],
		name: "refundable",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "sellingToken",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stakingPool",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "tgeUnlockRatio",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalBuyedByUsers",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalExtraDeposit",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalLeftQuotas",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalLockByInsurance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalRaised",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "unlockTillTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "withdrawLeftQuotas",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "withdrawRaisingToken",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const IIdoPoolAbi = /*@__PURE__*/getDefaultExportFromCjs(IIdoPool);

var GasLimitMulticall$1 = [
	{
		inputs: [
		],
		name: "gasLeft",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "gaslimit",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct MultiCallV2.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				components: [
					{
						internalType: "bool",
						name: "success",
						type: "bool"
					},
					{
						internalType: "uint256",
						name: "gasUsed",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "returnData",
						type: "bytes"
					}
				],
				internalType: "struct MultiCallV2.Result[]",
				name: "returnData",
				type: "tuple[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct MultiCallV2.Call[]",
				name: "calls",
				type: "tuple[]"
			},
			{
				internalType: "uint256",
				name: "gasBuffer",
				type: "uint256"
			}
		],
		name: "multicallWithGasLimitation",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				components: [
					{
						internalType: "bool",
						name: "success",
						type: "bool"
					},
					{
						internalType: "uint256",
						name: "gasUsed",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "returnData",
						type: "bytes"
					}
				],
				internalType: "struct MultiCallV2.Result[]",
				name: "returnData",
				type: "tuple[]"
			},
			{
				internalType: "uint256",
				name: "lastSuccessIndex",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const GasLimitMulticallAbi = /*@__PURE__*/getDefaultExportFromCjs(GasLimitMulticall$1);

const IERC20 = IERC20Abi;
const Multicall2 = Multicall2Abi;
const IAgniPool = IAgniPoolAbi;
const INonfungiblePositionManager = INonfungiblePositionManagerAbi;
const IStakingPool = IStakingPoolAbi;
const InsurancePool = InsurancePoolAbi$1;
const IdoPool = IIdoPoolAbi;
const IQuoterV2 = IQuoterV2Abi$1;
const GasLimitMulticall = GasLimitMulticallAbi;

const _BasicException = class extends Error {
  /**
   * @param msg
   * @param code
   * @param sourceError
   * @param detail
   */
  constructor(msg = "", sourceError = null, code = _BasicException.CODE, detail = {}) {
    super(msg);
    this._code = _BasicException.CODE;
    this._msg = "";
    this._sourceError = null;
    this._detail = {};
    this.name = "BasicException";
    this._msg = msg;
    this._code = code;
    this._sourceError = sourceError;
    this._detail = detail;
  }
  get code() {
    return this._code;
  }
  /**
   * 错误信息
   */
  get msg() {
    return this._msg;
  }
  /**
   * 其他数据
   */
  get detail() {
    return this._detail;
  }
  get sourceError() {
    return this._sourceError;
  }
  toString() {
    return `${this._msg}`;
  }
};
let BasicException = _BasicException;
BasicException.CODE = 400;
BasicException.SAFE_CHECK = 999999;

class ConnectInfo {
  constructor() {
    this._instanceCache = /* @__PURE__ */ new Map();
  }
  create(clazz, ...args) {
    const cacheKey = clazz.CACHE_KEY;
    if (!cacheKey)
      return new clazz(this, ...args);
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    const element = this._instanceCache.get(key);
    if (typeof element !== "undefined") {
      return element;
    } else {
      const instance = createProxy(new clazz(this, ...args));
      this._instanceCache.set(key, instance);
      return instance;
    }
  }
  clear() {
    this._instanceCache.clear();
    clearCache();
  }
  /**
   * 获取 ERC20 API
   */
  erc20() {
    return this.create(Erc20Service);
  }
  /**
   * 获取交易API
   */
  tx() {
    return this.create(TransactionService);
  }
  /**
   * multiCall service
   */
  multiCall() {
    return this.create(MultiCallContract);
  }
  get provider() {
    if (this._status)
      return this._provider;
    throw new BasicException("Wallet not connected!");
  }
  set provider(value) {
    this._provider = value;
  }
  /**
   * 获取连接的状态
   */
  get status() {
    return this._status;
  }
  set status(value) {
    this._status = value;
  }
  /**
   * 获取连接的消息
   */
  get msg() {
    return this._msg;
  }
  set msg(value) {
    this._msg = value;
  }
  /**
   * 获取连接的地址
   */
  get account() {
    return this._account;
  }
  set account(value) {
    this._account = value;
  }
  /**
   * 获取连接的网络ID
   */
  get chainId() {
    return this._chainId;
  }
  set chainId(value) {
    this._chainId = value;
  }
  /**
   * 获取连接的地址信息
   */
  get addressInfo() {
    return this._addressInfo;
  }
  set addressInfo(value) {
    this._addressInfo = value;
  }
  // eslint-disable-next-line accessor-pairs
  set wallet(value) {
    this._wallet = value;
  }
  getWalletOrProvider() {
    return this._wallet || this._provider;
  }
  getScan() {
    return this.addressInfo.scan;
  }
  async addToken(tokenAddress) {
    const token = await this.erc20().getTokenInfo(tokenAddress);
    Trace.debug("token info", token);
    try {
      const wasAdded = await this.provider.send("wallet_watchAsset", {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimal
        }
      });
      if (wasAdded)
        return true;
    } catch (error) {
      Trace.error(error);
    }
    return false;
  }
}

let currentAddressInfo = null;
function updateCurrentAddressInfo(addressInfo) {
  currentAddressInfo = addressInfo;
}
function getCurrentAddressInfo() {
  if (currentAddressInfo === null)
    throw new BasicException("not initialized");
  return currentAddressInfo;
}

class PrivateWallet {
}
let currentConnect = null;
function getCurrentConnect() {
  return currentConnect;
}
class WalletConnect {
  constructor(walletName) {
    this.wallet = walletName;
    const connectInfo = new ConnectInfo();
    connectInfo.status = false;
    connectInfo.msg = "Check your wallet!";
    this.connectInfo = connectInfo;
  }
  disConnect() {
    const connectInfo = this.connectInfo;
    connectInfo.status = false;
    connectInfo.msg = "Check your wallet!";
    this.update();
  }
  update() {
    const connectInfo = this.connectInfo;
    connectInfo.walletConnect = this;
    if (typeof connectInfo.account === "undefined" || connectInfo.account === "") {
      connectInfo.status = false;
      transactionHistory.initUpdateTransaction(connectInfo, false);
    }
    const currentAddressInfo = getCurrentAddressInfo();
    if (connectInfo.status) {
      connectInfo.account = connectInfo.account.toLowerCase();
      connectInfo.addressInfo = currentAddressInfo;
      Trace.debug("connect success ", connectInfo.account);
    }
    if (connectInfo.status) {
      connectInfo.clear();
      transactionHistory.initUpdateTransaction(connectInfo, true);
    }
  }
  // 测试用，直接私钥+rpc链接
  async privateWallet() {
    const connectInfo = this.connectInfo;
    const privateWallet = this.wallet;
    const provider = privateWallet.provider;
    const wallet = privateWallet.wallet;
    connectInfo.chainId = Number.parseInt((await provider.getNetwork()).chainId.toString());
    connectInfo.msg = "success";
    connectInfo.provider = provider;
    connectInfo.account = wallet.address;
    connectInfo.status = true;
    connectInfo.wallet = wallet;
    this.update();
  }
  async web3Provider() {
    const connectInfo = this.connectInfo;
    const web3Provider = this.wallet;
    connectInfo.chainId = Number.parseInt((await web3Provider.getNetwork()).chainId.toString());
    connectInfo.msg = "success";
    connectInfo.provider = web3Provider;
    connectInfo.account = await (await web3Provider.getSigner()).getAddress();
    connectInfo.status = true;
    connectInfo.wallet = await web3Provider.getSigner();
    this.update();
  }
  static async connectMetaMask() {
    const _ethereum = WalletConnect.getEthereum();
    if (!_ethereum)
      throw new BasicException("Check your wallet!");
    await _ethereum.enable();
    const provider = new BrowserProvider(_ethereum, "any");
    const walletConnect = new WalletConnect(provider);
    walletConnect.provider = _ethereum;
    return walletConnect;
  }
  static getEthereum() {
    return get(window, "ethereum");
  }
  /**
   * 链接钱包
   * @returns
   */
  async connect() {
    try {
      if (this.wallet instanceof PrivateWallet)
        await this.privateWallet();
      else if (this.wallet instanceof BrowserProvider)
        await this.web3Provider();
      else if (this.wallet.provider)
        await this.web3Provider();
      else
        throw new BasicException("Wallet type error");
      currentConnect = this.connectInfo;
      return this.connectInfo;
    } catch (e) {
      this.connectInfo.status = false;
      this.connectInfo.msg = e.message || e.toString();
      this.update();
      throw e;
    }
  }
}
const _ConnectManager = class {
  /**
   * 初始化
   * @param wallet
   */
  static async connect(wallet) {
    _ConnectManager.walletConnect = wallet;
    _ConnectManager.connectInfo = await wallet.connect();
    return _ConnectManager.connectInfo;
  }
  /**
   * 断开连接
   */
  static async disConnect() {
    if (_ConnectManager.walletConnect) {
      _ConnectManager.walletConnect.disConnect();
      _ConnectManager.walletConnect = null;
    }
    if (_ConnectManager.connectInfo)
      _ConnectManager.connectInfo = null;
  }
  /**
   * 获取连接
   */
  static getConnect() {
    if (_ConnectManager.connectInfo) {
      if (_ConnectManager.connectInfo.status)
        return _ConnectManager.connectInfo;
    }
    throw new Error("Wallet not connected");
  }
  static addMetamaskChain(chainName) {
    const _ethereum = WalletConnect.getEthereum();
    if (!_ethereum)
      return;
    const data = _ConnectManager.chainMap[chainName];
    if (!data)
      return;
    if (typeof data === "string") {
      _ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: data
          }
        ]
      }).catch();
      return;
    }
    _ethereum.request({ method: "wallet_addEthereumChain", params: data }).catch();
  }
};
let ConnectManager = _ConnectManager;
ConnectManager.chainMap = {
  rinkeby: "0x4",
  mainnet: "0x1"
};

function CacheKey(key) {
  return function(target) {
    target.CACHE_KEY = key;
  };
}
function EnableProxy() {
  return function(target, propertyKey, descriptor) {
    target[propertyKey].proxyEnable = true;
  };
}
function EnableLogs() {
  return function(target, propertyKey, descriptor) {
    target[propertyKey].logEnable = true;
  };
}
function MethodCache(key, ttl) {
  return function(target, propertyKey, descriptor) {
    target[propertyKey].methodCache = true;
    target[propertyKey].methodCacheKey = key;
    target[propertyKey].methodCacheTTL = ttl;
  };
}

const SLEEP_MS = 1e3;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const INVALID_ADDRESS = "0x0000000000000000000000000000030000000000";
const MAXIMUM_U256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
function convertBigNumber(bnAmount, precision = 1e18) {
  return new BigNumber(bnAmount).dividedBy(new BigNumber(precision)).toFixed();
}
function convertBigNumber1(bnAmount, decimals = 18) {
  return new BigNumber(bnAmount).dividedBy(new BigNumber("10").pow(decimals)).toFixed();
}
function convertAmount(bnAmount, precision = 1e18) {
  return new BigNumber(bnAmount).multipliedBy(new BigNumber(precision)).toFixed();
}
function convertAmount1(amount, decimals = 18) {
  return new BigNumber(amount).multipliedBy(new BigNumber("10").pow(decimals)).toFixed();
}
async function sleep(ms) {
  return await new Promise(
    (resolve) => setTimeout(() => {
      resolve(1);
    }, ms)
  );
}
function isNullOrBlank(value) {
  return !value || value === void 0 || value === "" || value.length === 0;
}
async function retry(func, retryCount = 3) {
  let count = retryCount;
  do {
    try {
      return await func();
    } catch (e) {
      if (count > 0) {
        count--;
      }
      if (count <= 0)
        throw new BasicException(e.toString(), e);
      console.error("retry", e);
      await sleep(SLEEP_MS);
    }
  } while (true);
}
function calculateGasMargin(value) {
  return Number.parseInt(new BigNumber(value).multipliedBy(1.2).toFixed(0, BigNumber.ROUND_DOWN), 10);
}
function eqAddress(addr0, addr1) {
  return addr0.toLowerCase() === addr1.toLowerCase();
}
function showApprove(balanceInfo) {
  const amount = convertBigNumber1(balanceInfo.allowance, balanceInfo.decimals);
  return new BigNumber(amount).comparedTo("100000000") <= 0;
}
function getValue(obj, path, defaultValue) {
  return get(obj, path, defaultValue) || defaultValue;
}
function isNumber(input) {
  const tempValue = new BigNumber(input);
  return !(tempValue.isNaN() || !tempValue.isFinite() || tempValue.comparedTo(new BigNumber("0")) < 0);
}
class TraceTool {
  constructor() {
    this.logShow = true;
    this.errorShow = true;
    this.debugShow = true;
  }
  setLogShow(b) {
    this.logShow = b;
  }
  setErrorShow(b) {
    this.errorShow = b;
  }
  setDebugShow(b) {
    this.debugShow = b;
  }
  log(...args) {
    console.log(...args);
  }
  print(...args) {
    if (this.logShow)
      this.log(...args);
  }
  error(...args) {
    if (this.errorShow)
      this.log(...args);
  }
  debug(...args) {
    if (this.debugShow)
      this.log(...args);
  }
}
const Trace = new TraceTool();

class Cache {
  constructor(ttl) {
    this.ttl = 0;
    this.data = {};
    this.ttl = ttl;
  }
  now() {
    return (/* @__PURE__ */ new Date()).getTime();
  }
  nuke(key) {
    delete this.data[key];
    return this;
  }
  get(key) {
    let val = null;
    const obj = this.data[key];
    if (obj) {
      if (obj.expires === 0 || this.now() < obj.expires) {
        val = obj.val;
      } else {
        val = null;
        this.nuke(key);
      }
    }
    return val;
  }
  del(key) {
    const oldVal = this.get(key);
    this.nuke(key);
    return oldVal;
  }
  put(key, val = null, ttl = 0) {
    if (ttl === 0)
      ttl = this.ttl;
    const expires = ttl === 0 ? 0 : this.now() + ttl;
    const oldVal = this.del(key);
    if (val !== null) {
      this.data[key] = {
        expires,
        val
      };
    }
    return oldVal;
  }
}

class ErrorInfo {
}
let availableErrorHandler = (error) => {
  Trace.error("availableErrorHandler", error);
};
function registerTransactionErrorHandler(errorHandler) {
  availableErrorHandler = errorHandler;
}
function errorHandlerController(e, method, args, target) {
  try {
    const errorInfo = new ErrorInfo();
    errorInfo.error = e;
    errorInfo.method = method;
    try {
      errorInfo.args = JSON.stringify(args);
    } catch (e2) {
      errorInfo.args = args;
    }
    errorInfo.target = target;
    if (e instanceof BasicException)
      errorInfo.msg = e.msg;
    else
      errorInfo.msg = e.toString();
    availableErrorHandler(errorInfo);
  } catch (e2) {
    Trace.error(e2);
  }
}
let cache = new Cache(10 * 1e3);
function clearCache() {
  cache = new Cache(10 * 1e3);
}
function createProxy(obj) {
  return new Proxy(obj, {
    get(target, propKey) {
      const ins = target[propKey];
      if (ins && (ins.proxyEnable || ins.logEnable || ins.methodCache)) {
        return function() {
          const args = arguments;
          const showError = (err) => {
            if (ins.proxyEnable)
              errorHandlerController(err, propKey, args, target);
            if (ins.logEnable) {
              errorHandlerController(err, propKey, args, target);
              Trace.debug(`${target.constructor.CACHE_KEY}.${propKey}`, "args=", args, "error", err);
            }
          };
          const showLog = (data) => {
            if (ins.logEnable) {
              Trace.debug(
                `${target.constructor.CACHE_KEY}.${propKey} `,
                "args=",
                args,
                "result",
                data
              );
            }
          };
          const call = (saveCache = (data) => {
          }) => {
            const res = ins.apply(target, args);
            if (res instanceof Promise) {
              return new Promise((resolve, reject) => {
                res.then((data) => {
                  showLog(data);
                  saveCache(data);
                  resolve(data);
                }).catch((err) => {
                  showError(err);
                  reject(err);
                });
              });
            } else {
              showLog(res);
              saveCache(res);
              return res;
            }
          };
          try {
            if (ins.methodCache) {
              const ttl = ins.methodCacheTTL;
              const compiled = template(ins.methodCacheKey);
              const key = compiled(args);
              const data = cache.get(key);
              if (data) {
                Trace.debug("hit cache", key, data);
                return Promise.resolve(data);
              } else {
                Trace.debug("miss cache", key);
              }
              return call((v) => {
                Trace.debug("save cache", key, v, ttl);
                cache.put(key, v, ttl);
              });
            } else {
              return call();
            }
          } catch (err) {
            showError(err);
            throw err;
          }
        };
      } else {
        return ins;
      }
    }
  });
}

let data = {};
const STORAGE_KEY_TOKEN_LIST = "STORAGE_KEY_TOKEN_LIST";
const STORAGE_KEY_TOKENS = "STORAGE_KEY_TOKENS";
class StorageProvider {
  constructor(type) {
    this.type = type;
  }
  get(key) {
    switch (this.type) {
      case "web":
        return localStorage.getItem(key) || "";
      case "node":
        return data[key] || "";
    }
    return "";
  }
  getArray(key) {
    const str = this.get(key);
    let dataList;
    if (str) {
      try {
        const data2 = JSON.parse(str);
        if (Array.isArray(data2))
          dataList = data2;
      } catch (e) {
        Trace.debug("StorageProvider.getArray", e);
      }
    }
    return dataList;
  }
  getObj(key) {
    const str = this.get(key);
    let result = null;
    if (str) {
      try {
        const data2 = JSON.parse(str);
        if (!Array.isArray(data2))
          result = data2;
      } catch (e) {
        Trace.debug("StorageProvider.getObj", e);
      }
    }
    return result;
  }
  set(key, value) {
    switch (this.type) {
      case "web":
        localStorage.setItem(key, value);
        break;
      case "node":
        data[key] = value;
        break;
    }
  }
  setJson(key, value) {
    this.set(key, JSON.stringify(value));
  }
  clearKey(key) {
    switch (this.type) {
      case "web":
        localStorage.removeItem(key);
        break;
      case "node":
        delete data[key];
        break;
    }
  }
  clear() {
    switch (this.type) {
      case "web":
        localStorage.clear();
        break;
      case "node":
        data = {};
        break;
    }
  }
}

var ChainId = /* @__PURE__ */ ((ChainId2) => {
  ChainId2[ChainId2["MANTLE"] = 5e3] = "MANTLE";
  ChainId2[ChainId2["MANTLE_TESTNET"] = 5001] = "MANTLE_TESTNET";
  return ChainId2;
})(ChainId || {});
var TradeType = /* @__PURE__ */ ((TradeType2) => {
  TradeType2[TradeType2["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType2[TradeType2["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
  return TradeType2;
})(TradeType || {});
var Rounding = /* @__PURE__ */ ((Rounding2) => {
  Rounding2[Rounding2["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding2[Rounding2["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding2[Rounding2["ROUND_UP"] = 2] = "ROUND_UP";
  return Rounding2;
})(Rounding || {});
const MINIMUM_LIQUIDITY = 1000n;
const ZERO$1 = 0n;
const ONE$1 = 1n;
const TWO$1 = 2n;
const THREE = 3n;
const FIVE = 5n;
const TEN = 10n;
const _100 = 100n;
const _9975 = 9975n;
const _10000 = 10000n;
const MaxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
var VMType = /* @__PURE__ */ ((VMType2) => {
  VMType2["uint8"] = "uint8";
  VMType2["uint256"] = "uint256";
  return VMType2;
})(VMType || {});
const VM_TYPE_MAXIMA = {
  ["uint8" /* uint8 */]: BigInt("0xff"),
  ["uint256" /* uint256 */]: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
};

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: BigNumber.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: BigNumber.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: BigNumber.ROUND_UP
};
const toFixedRounding = {
  [Rounding.ROUND_DOWN]: 0 /* RoundDown */,
  [Rounding.ROUND_HALF_UP]: 1 /* RoundHalfUp */,
  [Rounding.ROUND_UP]: 3 /* RoundUp */
};
class Fraction {
  constructor(numerator, denominator = 1n) {
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator);
  }
  static tryParseFraction(fractionish) {
    if (typeof fractionish === "bigint" || typeof fractionish === "number" || typeof fractionish === "string")
      return new Fraction(fractionish);
    if ("numerator" in fractionish && "denominator" in fractionish)
      return fractionish;
    throw new Error("Could not parse fraction");
  }
  // performs floor division
  get quotient() {
    return this.numerator / this.denominator;
  }
  // remainder after floor division
  get remainder() {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }
  invert() {
    return new Fraction(this.denominator, this.numerator);
  }
  add(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator)
      return new Fraction(this.numerator + otherParsed.numerator, this.denominator);
    return new Fraction(
      this.numerator * otherParsed.denominator + otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator
    );
  }
  subtract(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator)
      return new Fraction(this.numerator - otherParsed.numerator, this.denominator);
    return new Fraction(
      this.numerator * otherParsed.denominator - otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator
    );
  }
  lessThan(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator < otherParsed.numerator * this.denominator;
  }
  equalTo(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator === otherParsed.numerator * this.denominator;
  }
  greaterThan(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator > otherParsed.numerator * this.denominator;
  }
  multiply(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(this.numerator * otherParsed.numerator, this.denominator * otherParsed.denominator);
  }
  divide(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(this.numerator * otherParsed.denominator, this.denominator * otherParsed.numerator);
  }
  toSignificant(significantDigits, format = { groupSeparator: "" }, rounding = Rounding.ROUND_HALF_UP) {
    invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
    invariant(significantDigits > 0, `${significantDigits} is not positive.`);
    const quotient = new BigNumber(this.numerator.toString()).div(this.denominator.toString()).dp(significantDigits, toSignificantRounding[rounding]);
    return quotient.toFormat(significantDigits, format);
  }
  toFixed(decimalPlaces, format = { groupSeparator: "" }, rounding = Rounding.ROUND_HALF_UP) {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
    return new BigNumber(this.numerator.toString()).div(this.denominator.toString()).toFixed(decimalPlaces, toFixedRounding[rounding]);
  }
  /**
   * Helper method for converting any super class back to a fraction
   */
  get asFraction() {
    return new Fraction(this.numerator, this.denominator);
  }
}

const ONE_HUNDRED = new Fraction(100n);
function toPercent(fraction) {
  return new Percent(fraction.numerator, fraction.denominator);
}
class Percent extends Fraction {
  constructor() {
    super(...arguments);
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    this.isPercent = true;
  }
  add(other) {
    return toPercent(super.add(other));
  }
  subtract(other) {
    return toPercent(super.subtract(other));
  }
  multiply(other) {
    return toPercent(super.multiply(other));
  }
  divide(other) {
    return toPercent(super.divide(other));
  }
  toSignificant(significantDigits = 5, format, rounding) {
    return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 2, format, rounding) {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  }
}

class CurrencyAmount extends Fraction {
  constructor(currency, numerator, denominator) {
    super(numerator, denominator);
    invariant(this.quotient <= MaxUint256, "AMOUNT");
    this.currency = currency;
    this.decimalScale = 10n ** BigInt(currency.decimals);
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  static fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  static fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  }
  add(other) {
    invariant(this.currency.equals(other.currency), "CURRENCY");
    const added = super.add(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  }
  subtract(other) {
    invariant(this.currency.equals(other.currency), "CURRENCY");
    const subtracted = super.subtract(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
  }
  multiply(other) {
    const multiplied = super.multiply(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
  }
  divide(other) {
    const divided = super.divide(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
  }
  toSignificant(significantDigits = 6, format, rounding = Rounding.ROUND_DOWN) {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = this.currency.decimals, format, rounding = Rounding.ROUND_DOWN) {
    invariant(decimalPlaces <= this.currency.decimals, "DECIMALS");
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding);
  }
  toExact(format = { groupSeparator: "" }) {
    return new BigNumber(this.quotient.toString()).div(this.decimalScale.toString()).dp(this.currency.decimals, BigNumber.ROUND_DOWN).toFormat(this.currency.decimals, format);
  }
  get wrapped() {
    if (this.currency.isToken)
      return this;
    return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
  }
}

class Price extends Fraction {
  // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token
  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  constructor(...args) {
    let baseCurrency;
    let quoteCurrency;
    let denominator;
    let numerator;
    if (args.length === 4) {
      [baseCurrency, quoteCurrency, denominator, numerator] = args;
    } else {
      const result = args[0].quoteAmount.divide(args[0].baseAmount);
      [baseCurrency, quoteCurrency, denominator, numerator] = [
        args[0].baseAmount.currency,
        args[0].quoteAmount.currency,
        result.denominator,
        result.numerator
      ];
    }
    super(numerator, denominator);
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.scalar = new Fraction(10n ** BigInt(baseCurrency.decimals), 10n ** BigInt(quoteCurrency.decimals));
  }
  /**
   * Flip the price, switching the base and quote currency
   */
  invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  multiply(other) {
    invariant(this.quoteCurrency.equals(other.baseCurrency), "TOKEN");
    const fraction = super.multiply(other);
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  }
  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */
  quote(currencyAmount) {
    invariant(currencyAmount.currency.equals(this.baseCurrency), "TOKEN");
    const result = super.multiply(currencyAmount);
    return CurrencyAmount.fromFractionalAmount(this.quoteCurrency, result.numerator, result.denominator);
  }
  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  get adjustedForDecimals() {
    return super.multiply(this.scalar);
  }
  toSignificant(significantDigits = 6, format, rounding) {
    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 4, format, rounding) {
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  }
}

function validateVMTypeInstance(value, vmType) {
  invariant(value >= ZERO$1, `${value} is not a ${vmType}.`);
  invariant(value <= VM_TYPE_MAXIMA[vmType], `${value} is not a ${vmType}.`);
}
function sqrt(y) {
  invariant(y >= ZERO$1, "NEGATIVE");
  let z = ZERO$1;
  let x;
  if (y > THREE) {
    z = y;
    x = y / TWO$1 + ONE$1;
    while (x < z) {
      z = x;
      x = (y / x + x) / TWO$1;
    }
  } else if (y !== ZERO$1) {
    z = ONE$1;
  }
  return z;
}
function sortedInsert(items, add, maxSize, comparator) {
  invariant(maxSize > 0, "MAX_SIZE_ZERO");
  invariant(items.length <= maxSize, "ITEMS_SIZE");
  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    const isFull = items.length === maxSize;
    if (isFull && comparator(items[items.length - 1], add) <= 0)
      return add;
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (comparator(items[mid], add) <= 0)
        lo = mid + 1;
      else
        hi = mid;
    }
    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}
function computePriceImpact(midPrice, inputAmount, outputAmount) {
  const quotedOutputAmount = midPrice.quote(inputAmount);
  const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
  return new Percent(priceImpact.numerator, priceImpact.denominator);
}
function balanceComparator(balanceA, balanceB) {
  if (balanceA && balanceB)
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1;
  if (balanceA && balanceA.greaterThan("0"))
    return -1;
  if (balanceB && balanceB.greaterThan("0"))
    return 1;
  return 0;
}
function getTokenComparator(balances) {
  return function sortTokens(tokenA, tokenB) {
    const balanceA = balances[tokenA.erc20Address()];
    const balanceB = balances[tokenB.erc20Address()];
    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0)
      return balanceComp;
    if (tokenA.symbol && tokenB.symbol) {
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    }
    return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
  };
}

function encodeSqrtRatioX96(amount1, amount0) {
  const numerator = BigInt(amount1) << 192n;
  const denominator = BigInt(amount0);
  const ratioX192 = numerator / denominator;
  return sqrt(ratioX192);
}

const NEGATIVE_ONE = BigInt(-1);
const ZERO = 0n;
const ONE = 1n;
const Q96 = 2n ** 96n;
const Q192 = Q96 ** 2n;
const MAX_FEE = 10n ** 6n;
new Percent("1");
new Percent("0");

class FullMath {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  static mulDivRoundingUp(a, b, denominator) {
    const product = a * b;
    let result = product / denominator;
    if (product % denominator !== ZERO)
      result = result + ONE;
    return result;
  }
}

function isSorted(list, comparator) {
  for (let i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0)
      return false;
  }
  return true;
}

class LiquidityMath {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  static addDelta(x, y) {
    if (y < ZERO)
      return x - y * NEGATIVE_ONE;
    return x + y;
  }
}

function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  const intermediate = sqrtRatioAX96 * sqrtRatioBX96 / Q96;
  return BigInt(amount0) * intermediate / (sqrtRatioBX96 - sqrtRatioAX96);
}
function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  const numerator = BigInt(amount0) * sqrtRatioAX96 * sqrtRatioBX96;
  const denominator = Q96 * (sqrtRatioBX96 - sqrtRatioAX96);
  if (denominator === 0n)
    return 0n;
  return numerator / denominator;
}
function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  if (sqrtRatioBX96 - sqrtRatioAX96 === 0n)
    return 0n;
  return BigInt(amount1) * Q96 / (sqrtRatioBX96 - sqrtRatioAX96);
}
function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }
  const maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;
  if (sqrtRatioCurrentX96 <= sqrtRatioAX96)
    return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  if (sqrtRatioCurrentX96 < sqrtRatioBX96) {
    const liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    const liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return liquidity0 < liquidity1 ? liquidity0 : liquidity1;
  }
  return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
}

const TWO = 2n;
const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow) => [pow, TWO ** BigInt(pow)]);
function mostSignificantBit(x) {
  invariant(x > ZERO, "ZERO");
  invariant(x <= MaxUint256, "MAX");
  let msb = 0;
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      x = x >> BigInt(power);
      msb += power;
    }
  }
  return msb;
}

function mulShift(val, mulBy) {
  return val * BigInt(mulBy) >> 128n;
}
const Q32 = 2n ** 32n;
const _TickMath = class {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */
  static getSqrtRatioAtTick(tick) {
    invariant(tick >= _TickMath.MIN_TICK && tick <= _TickMath.MAX_TICK && Number.isInteger(tick), "TICK");
    const absTick = tick < 0 ? tick * -1 : tick;
    let ratio = (absTick & 1) !== 0 ? BigInt("0xfffcb933bd6fad37aa2d162d1a594001") : BigInt("0x100000000000000000000000000000000");
    if ((absTick & 2) !== 0)
      ratio = mulShift(ratio, "0xfff97272373d413259a46990580e213a");
    if ((absTick & 4) !== 0)
      ratio = mulShift(ratio, "0xfff2e50f5f656932ef12357cf3c7fdcc");
    if ((absTick & 8) !== 0)
      ratio = mulShift(ratio, "0xffe5caca7e10e4e61c3624eaa0941cd0");
    if ((absTick & 16) !== 0)
      ratio = mulShift(ratio, "0xffcb9843d60f6159c9db58835c926644");
    if ((absTick & 32) !== 0)
      ratio = mulShift(ratio, "0xff973b41fa98c081472e6896dfb254c0");
    if ((absTick & 64) !== 0)
      ratio = mulShift(ratio, "0xff2ea16466c96a3843ec78b326b52861");
    if ((absTick & 128) !== 0)
      ratio = mulShift(ratio, "0xfe5dee046a99a2a811c461f1969c3053");
    if ((absTick & 256) !== 0)
      ratio = mulShift(ratio, "0xfcbe86c7900a88aedcffc83b479aa3a4");
    if ((absTick & 512) !== 0)
      ratio = mulShift(ratio, "0xf987a7253ac413176f2b074cf7815e54");
    if ((absTick & 1024) !== 0)
      ratio = mulShift(ratio, "0xf3392b0822b70005940c7a398e4b70f3");
    if ((absTick & 2048) !== 0)
      ratio = mulShift(ratio, "0xe7159475a2c29b7443b29c7fa6e889d9");
    if ((absTick & 4096) !== 0)
      ratio = mulShift(ratio, "0xd097f3bdfd2022b8845ad8f792aa5825");
    if ((absTick & 8192) !== 0)
      ratio = mulShift(ratio, "0xa9f746462d870fdf8a65dc1f90e061e5");
    if ((absTick & 16384) !== 0)
      ratio = mulShift(ratio, "0x70d869a156d2a1b890bb3df62baf32f7");
    if ((absTick & 32768) !== 0)
      ratio = mulShift(ratio, "0x31be135f97d08fd981231505542fcfa6");
    if ((absTick & 65536) !== 0)
      ratio = mulShift(ratio, "0x9aa508b5b7a84e1c677de54f3e99bc9");
    if ((absTick & 131072) !== 0)
      ratio = mulShift(ratio, "0x5d6af8dedb81196699c329225ee604");
    if ((absTick & 262144) !== 0)
      ratio = mulShift(ratio, "0x2216e584f5fa1ea926041bedfe98");
    if ((absTick & 524288) !== 0)
      ratio = mulShift(ratio, "0x48a170391f7dc42444e8fa2");
    if (tick > 0)
      ratio = MaxUint256 / ratio;
    return ratio % Q32 > ZERO ? ratio / Q32 + ONE : ratio / Q32;
  }
  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */
  static getTickAtSqrtRatio(sqrtRatioX96) {
    invariant(sqrtRatioX96 >= _TickMath.MIN_SQRT_RATIO && sqrtRatioX96 < _TickMath.MAX_SQRT_RATIO, "SQRT_RATIO");
    const sqrtRatioX128 = sqrtRatioX96 << 32n;
    const msb = mostSignificantBit(sqrtRatioX128);
    let r;
    if (BigInt(msb) >= 128n)
      r = sqrtRatioX128 >> BigInt(msb - 127);
    else
      r = sqrtRatioX128 << BigInt(127 - msb);
    let log_2 = BigInt(msb) - 128n << 64n;
    for (let i = 0; i < 14; i++) {
      r = r * r >> 127n;
      const f = r >> 128n;
      log_2 = log_2 | f << BigInt(63 - i);
      r = r >> f;
    }
    const log_sqrt10001 = log_2 * 255738958999603826347141n;
    const tickLow = Number(log_sqrt10001 - 3402992956809132418596140100660247210n >> 128n);
    const tickHigh = Number(log_sqrt10001 + 291339464771989622907027621153398088495n >> 128n);
    return tickLow === tickHigh ? tickLow : _TickMath.getSqrtRatioAtTick(tickHigh) <= sqrtRatioX96 ? tickHigh : tickLow;
  }
};
let TickMath = _TickMath;
/**
 * The minimum tick that can be used on any pool.
 */
TickMath.MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */
TickMath.MAX_TICK = -_TickMath.MIN_TICK;
/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */
TickMath.MIN_SQRT_RATIO = 4295128739n;
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */
TickMath.MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n;

function nearestUsableTick(tick, tickSpacing) {
  invariant(Number.isInteger(tick) && Number.isInteger(tickSpacing), "INTEGERS");
  invariant(tickSpacing > 0, "TICK_SPACING");
  invariant(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK, "TICK_BOUND");
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK)
    return rounded + tickSpacing;
  if (rounded > TickMath.MAX_TICK)
    return rounded - tickSpacing;
  return rounded;
}

function tickToPrice(baseToken, quoteToken, tick) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96;
  return baseToken.sortsBefore(quoteToken) ? new Price(baseToken, quoteToken, Q192, ratioX192) : new Price(baseToken, quoteToken, ratioX192, Q192);
}
function priceToClosestTick(price) {
  const sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  const sqrtRatioX96 = sorted ? encodeSqrtRatioX96(price.numerator, price.denominator) : encodeSqrtRatioX96(price.denominator, price.numerator);
  let tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  const nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);
  if (sorted) {
    if (!price.lessThan(nextTickPrice))
      tick++;
  } else if (!price.greaterThan(nextTickPrice)) {
    tick++;
  }
  return tick;
}

const MaxUint160 = 2n ** 160n - ONE;
function multiplyIn256(x, y) {
  const product = x * y;
  return product & MaxUint256;
}
function addIn256(x, y) {
  const sum = x + y;
  return sum & MaxUint256;
}
class SqrtPriceMath {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  static getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      sqrtRatioAX96 = sqrtRatioBX96;
      sqrtRatioBX96 = sqrtRatioAX96;
    }
    const numerator1 = liquidity << 96n;
    const numerator2 = sqrtRatioBX96 - sqrtRatioAX96;
    return roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96) : numerator1 * numerator2 / sqrtRatioBX96 / sqrtRatioAX96;
  }
  static getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      sqrtRatioAX96 = sqrtRatioBX96;
      sqrtRatioBX96 = sqrtRatioAX96;
    }
    return roundUp ? FullMath.mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, Q96) : liquidity * (sqrtRatioBX96 - sqrtRatioAX96) / Q96;
  }
  static getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    invariant(sqrtPX96 > ZERO);
    invariant(liquidity > ZERO);
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  }
  static getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    invariant(sqrtPX96 > ZERO);
    invariant(liquidity > ZERO);
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  }
  static getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    if (amount === ZERO)
      return sqrtPX96;
    const numerator1 = liquidity << 96n;
    if (add) {
      const product2 = multiplyIn256(amount, sqrtPX96);
      if (product2 / amount === sqrtPX96) {
        const denominator2 = addIn256(numerator1, product2);
        if (denominator2 >= numerator1)
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator2);
      }
      return FullMath.mulDivRoundingUp(numerator1, ONE, numerator1 / sqrtPX96 + amount);
    }
    const product = multiplyIn256(amount, sqrtPX96);
    invariant(product / amount === sqrtPX96);
    invariant(numerator1 > product);
    const denominator = numerator1 - product;
    return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
  }
  static getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      const quotient2 = amount <= MaxUint160 ? (amount << 96n) / liquidity : amount * Q96 / liquidity;
      return sqrtPX96 + quotient2;
    }
    const quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity);
    invariant(sqrtPX96 > quotient);
    return sqrtPX96 - quotient;
  }
}

class SwapMath {
  /**
   * Cannot be constructed.
   */
  constructor() {
  }
  static computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    const returnValues = {};
    const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;
    const exactIn = amountRemaining >= ZERO;
    if (exactIn) {
      const amountRemainingLessFee = amountRemaining * (MAX_FEE - BigInt(feePips)) / MAX_FEE;
      returnValues.amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);
      if (amountRemainingLessFee >= returnValues.amountIn) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemainingLessFee,
          zeroForOne
        );
      }
    } else {
      returnValues.amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);
      if (amountRemaining * NEGATIVE_ONE >= returnValues.amountOut) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemaining * NEGATIVE_ONE,
          zeroForOne
        );
      }
    }
    const max = sqrtRatioTargetX96 === returnValues.sqrtRatioNextX96;
    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }
    if (!exactIn && returnValues.amountOut > amountRemaining * NEGATIVE_ONE)
      returnValues.amountOut = amountRemaining * NEGATIVE_ONE;
    if (exactIn && returnValues.sqrtRatioNextX96 !== sqrtRatioTargetX96) {
      returnValues.feeAmount = amountRemaining - returnValues.amountIn;
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(
        returnValues.amountIn,
        BigInt(feePips),
        MAX_FEE - BigInt(feePips)
      );
    }
    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  }
}

function tickComparator(a, b) {
  return a.index - b.index;
}
class TickList {
  /**
   * Cannot be constructed
   */
  constructor() {
  }
  static validateList(ticks, tickSpacing) {
    invariant(tickSpacing > 0, "TICK_SPACING_NONZERO");
    invariant(
      ticks.every(({ index }) => index % tickSpacing === 0),
      "TICK_SPACING"
    );
    invariant(ticks.reduce((accumulator, { liquidityNet }) => accumulator + liquidityNet, ZERO) === ZERO, "ZERO_NET");
    invariant(isSorted(ticks, tickComparator), "SORTED");
  }
  static isBelowSmallest(ticks, tick) {
    invariant(ticks.length > 0, "LENGTH");
    return tick < ticks[0].index;
  }
  static isAtOrAboveLargest(ticks, tick) {
    invariant(ticks.length > 0, "LENGTH");
    return tick >= ticks[ticks.length - 1].index;
  }
  static getTick(ticks, index) {
    const tick = ticks[this.binarySearch(ticks, index)];
    invariant(tick.index === index, "NOT_CONTAINED");
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */
  static binarySearch(ticks, tick) {
    invariant(!this.isBelowSmallest(ticks, tick), "BELOW_SMALLEST");
    let l = 0;
    let r = ticks.length - 1;
    let i;
    while (true) {
      i = Math.floor((l + r) / 2);
      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick))
        return i;
      if (ticks[i].index < tick)
        l = i + 1;
      else
        r = i - 1;
    }
  }
  static nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      invariant(!TickList.isBelowSmallest(ticks, tick), "BELOW_SMALLEST");
      if (TickList.isAtOrAboveLargest(ticks, tick))
        return ticks[ticks.length - 1];
      const index2 = this.binarySearch(ticks, tick);
      return ticks[index2];
    }
    invariant(!this.isAtOrAboveLargest(ticks, tick), "AT_OR_ABOVE_LARGEST");
    if (this.isBelowSmallest(ticks, tick))
      return ticks[0];
    const index = this.binarySearch(ticks, tick);
    return ticks[index + 1];
  }
  static nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    const compressed = Math.floor(tick / tickSpacing);
    if (lte) {
      const wordPos2 = compressed >> 8;
      const minimum = (wordPos2 << 8) * tickSpacing;
      if (TickList.isBelowSmallest(ticks, tick))
        return [minimum, false];
      const { index: index2 } = TickList.nextInitializedTick(ticks, tick, lte);
      const nextInitializedTick2 = Math.max(minimum, index2);
      return [nextInitializedTick2, nextInitializedTick2 === index2];
    }
    const wordPos = compressed + 1 >> 8;
    const maximum = ((wordPos + 1 << 8) - 1) * tickSpacing;
    if (this.isAtOrAboveLargest(ticks, tick))
      return [maximum, false];
    const { index } = this.nextInitializedTick(ticks, tick, lte);
    const nextInitializedTick = Math.min(maximum, index);
    return [nextInitializedTick, nextInitializedTick === index];
  }
  static countInitializedTicksCrossed(ticks, tickBefore, tickAfter) {
    if (tickBefore === tickAfter)
      return 0;
    const beforeIndex = this.binarySearch(ticks, tickBefore);
    const afterIndex = this.binarySearch(ticks, tickAfter);
    return Math.abs(beforeIndex - afterIndex);
  }
}

function getToken0Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower) {
    return SqrtPriceMath.getAmount0Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidity,
      false
    );
  }
  if (tickCurrent < tickUpper)
    return SqrtPriceMath.getAmount0Delta(sqrtRatioX96, TickMath.getSqrtRatioAtTick(tickUpper), liquidity, false);
  return ZERO;
}
function getToken1Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower)
    return ZERO;
  if (tickCurrent < tickUpper)
    return SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(tickLower), sqrtRatioX96, liquidity, false);
  return SqrtPriceMath.getAmount1Delta(
    TickMath.getSqrtRatioAtTick(tickLower),
    TickMath.getSqrtRatioAtTick(tickUpper),
    liquidity,
    false
  );
}
const PositionMath = {
  getToken0Amount,
  getToken1Amount
};

class Tick {
  constructor({ index, liquidityGross, liquidityNet }) {
    invariant(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK, "TICK");
    this.index = index;
    this.liquidityGross = BigInt(liquidityGross);
    this.liquidityNet = BigInt(liquidityNet);
  }
}

const FEE_BASE = 10n ** 4n;
function parseProtocolFees(feeProtocol) {
  const packed = Number(feeProtocol);
  if (Number.isNaN(packed))
    throw new Error(`Invalid fee protocol ${feeProtocol}`);
  const token0ProtocolFee = packed % 2 ** 16;
  const token1ProtocolFee = packed >> 16;
  return [new Percent(token0ProtocolFee, FEE_BASE), new Percent(token1ProtocolFee, FEE_BASE)];
}

function invariant(state, errorMsg = "ERROR") {
  if (!state)
    throw new Error(errorMsg);
}
const ENDLESS = "\u221E";
function tryParsePrice(baseToken, quoteToken, value) {
  if (!baseToken || !quoteToken || !value)
    return void 0;
  if (!value.match(/^\d*\.?\d+$/))
    return void 0;
  const [whole, fraction] = value.split(".");
  const decimals = fraction?.length ?? 0;
  const withoutDecimals = BigInt((whole ?? "") + (fraction ?? ""));
  return new Price(
    baseToken,
    quoteToken,
    BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals),
    withoutDecimals * BigInt(10 ** quoteToken.decimals)
  );
}
function tryParseTick(baseToken, quoteToken, feeAmount, value) {
  if (!baseToken || !quoteToken || !feeAmount || !value)
    return void 0;
  const price = tryParsePrice(baseToken, quoteToken, value);
  if (!price)
    return void 0;
  let tick;
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);
  if (sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO) {
    tick = TickMath.MAX_TICK;
  } else if (sqrtRatioX96 <= TickMath.MIN_SQRT_RATIO) {
    tick = TickMath.MIN_TICK;
  } else {
    tick = priceToClosestTick(price);
  }
  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
}
function computeSurroundingTicks(token0, token1, activeTickProcessed, sortedTickData, pivot, ascending) {
  let previousTickProcessed = {
    ...activeTickProcessed
  };
  let processedTicks = [];
  for (let i = pivot + (ascending ? 1 : -1); ascending ? i < sortedTickData.length : i >= 0; ascending ? i++ : i--) {
    const tick = Number(sortedTickData[i].tick);
    const currentTickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: BigInt(sortedTickData[i].liquidityNet),
      price0: tickToPrice(token0, token1, tick).toFixed()
    };
    if (ascending) {
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive + BigInt(sortedTickData[i].liquidityNet);
    } else if (!ascending && previousTickProcessed.liquidityNet !== 0n) {
      currentTickProcessed.liquidityActive = previousTickProcessed.liquidityActive - previousTickProcessed.liquidityNet;
    }
    processedTicks.push(currentTickProcessed);
    previousTickProcessed = currentTickProcessed;
  }
  if (!ascending)
    processedTicks = processedTicks.reverse();
  return processedTicks;
}
function tickToPriceString(token0, token1, feeAmount, tick) {
  const min = nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]);
  const max = nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]);
  if (tick === min)
    return "0";
  if (tick === max)
    return ENDLESS;
  return tickToPrice(token0, token1, tick).toFixed();
}

class BaseCurrency {
  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  constructor(chainId, decimals, symbol, name) {
    invariant(Number.isSafeInteger(chainId), "CHAIN_ID");
    invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "DECIMALS");
    this.chainId = chainId;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
}

class NativeCurrency extends BaseCurrency {
  constructor() {
    super(...arguments);
    this.isNative = true;
    this.isToken = false;
  }
}

class Token extends BaseCurrency {
  constructor(chainId, address, decimals, symbol, name, logoURI) {
    super(chainId, decimals, symbol, name);
    this.address = address;
    this.logoURI = logoURI;
    this.isNative = this.address === ETH_ADDRESS;
    this.isToken = true;
  }
  static fromSerialized(serializedToken) {
    return new Token(serializedToken.chainId, serializedToken.address, serializedToken.decimals, serializedToken.symbol, serializedToken.name, serializedToken.logoURI);
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  equals(other) {
    return other?.isToken && this.chainId === other.chainId && this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  sortsBefore(other) {
    invariant(this.chainId === other.chainId, "CHAIN_IDS");
    return this.erc20Address().toLowerCase() < other?.erc20Address().toLowerCase();
  }
  /**
   * Return this token, which does not need to be wrapped
   */
  get wrapped() {
    return this;
  }
  get serialize() {
    return {
      address: this.address,
      chainId: this.chainId,
      decimals: this.decimals,
      symbol: this.symbol,
      name: this.name,
      logoURI: this.logoURI
    };
  }
  erc20Address() {
    return this.address === ETH_ADDRESS ? getCurrentAddressInfo().WMNT : this.address;
  }
  iconUrl() {
    return this.logoURI ? this.logoURI : DEFAULT_ICON;
  }
  scanUrl() {
    return this.address === ETH_ADDRESS ? "" : getCurrentAddressInfo().getEtherscanAddress(this.address);
  }
}

const CAN_SET_PROTOTYPE = "setPrototypeOf" in Object;
class InsufficientReservesError extends Error {
  constructor() {
    super();
    this.isInsufficientReservesError = true;
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(this, new.target.prototype);
  }
}
class InsufficientInputAmountError extends Error {
  constructor() {
    super();
    this.isInsufficientInputAmountError = true;
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class TimeUtils {
  static getDeltaTimestamps() {
    const currentTime = (/* @__PURE__ */ new Date()).getTime();
    const t24h = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3) / 1e3).toString());
    const t48h = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3 * 2) / 1e3).toString());
    const t7d = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3 * 7) / 1e3).toString());
    const t14d = Number.parseInt(Number((currentTime - 24 * 60 * 60 * 1e3 * 14) / 1e3).toString());
    return {
      t24h,
      t48h,
      t7d,
      t14d
    };
  }
}

class BaseApi {
  async request(path, method, data, config = {
    headers: {}
  }) {
    return await new Promise((resolve, reject) => {
      const requestUrl = path;
      const req = {
        url: requestUrl,
        method,
        params: void 0,
        data: void 0,
        headers: {}
      };
      if (["get", "delete"].includes(method.toLowerCase()))
        req.params = data;
      else
        req.data = data;
      if (config.headers)
        req.headers = config.headers;
      axios(req).then((res) => {
        Trace.debug(`request success ${method} ${requestUrl} data =`, data, `result = `, res.data);
        resolve(res.data);
      }).catch((err) => {
        Trace.debug(`request error ${method} ${requestUrl} data =`, data, `error = `, err);
        const msg = "Network Error";
        reject(msg);
      });
    });
  }
  async graphBase(fullUrl, query, variables) {
    Trace.debug(`graph node request: ${fullUrl}`, query, variables);
    try {
      const t = await request(fullUrl, query, variables);
      Trace.debug(`graph node request success data =`, t);
      return t;
    } catch (e) {
      Trace.debug("graph node request error", e);
      throw new BasicException("Request failed", e);
    }
  }
  async blockGraph(query, variables) {
    return this.graphBase(getCurrentAddressInfo().blockGraphApi, query, variables);
  }
  async exchangeGraph(query, variables) {
    return this.graphBase(getCurrentAddressInfo().exchangeGraphApi, query, variables);
  }
  async launchpadGraph(query, variables) {
    return this.graphBase(getCurrentAddressInfo().launchpadGraphApi, query, variables);
  }
  connectInfo() {
    return getCurrentAddressInfo().readonlyConnectInfo();
  }
  address() {
    return getCurrentAddressInfo();
  }
}
const BASE_API = new BaseApi();

class Abi {
  static encode(name, inputs, params) {
    try {
      const functionSignature = getFunctionSignature(name, inputs);
      const functionHash = keccak256(toUtf8Bytes(functionSignature));
      const functionData = functionHash.substring(2, 10);
      const abiCoder = new AbiCoder();
      const argumentString = abiCoder.encode(inputs, params);
      const argumentData = argumentString.substring(2);
      const inputData = `0x${functionData}${argumentData}`;
      return inputData;
    } catch (e) {
      Trace.error("Abi encode error", name, inputs, params, e);
      throw e;
    }
  }
  static decode(outputs, data) {
    try {
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      let params = abiCoder.decode(outputs, data);
      const newParams = [];
      for (let i = 0; i < outputs.length; i++) {
        newParams[i] = params[i];
        const output = outputs[i];
        if (typeof output !== "string" && output.name !== "")
          newParams[output.name] = params[i];
      }
      params = outputs.length === 1 ? params[0] : newParams;
      const dataToString = (it) => {
        if (Array.isArray(it)) {
          const result = [];
          for (const key in it) {
            if (Object.prototype.hasOwnProperty.call(it, key)) {
              const v = it[key];
              if (v)
                result[key] = dataToString(v);
              else
                result[key] = v;
            }
          }
          return result;
        } else {
          if (it)
            it = it.toString();
        }
        return it;
      };
      params = dataToString(params);
      return params;
    } catch (e) {
      Trace.error("Abi decode error", outputs, data, e);
      return void 0;
    }
  }
}
function getFunctionSignature(name, inputs) {
  const types = [];
  for (const input of inputs) {
    if (input.type === "tuple") {
      const tupleString = getFunctionSignature("", input.components);
      types.push(tupleString);
      continue;
    }
    if (input.type === "tuple[]") {
      const tupleString = getFunctionSignature("", input.components);
      const arrayString = `${tupleString}[]`;
      types.push(arrayString);
      continue;
    }
    types.push(input.type);
  }
  const typeString = types.join(",");
  const functionSignature = `${name}(${typeString})`;
  return functionSignature;
}

const MAX_GAS_LIMIT = 3e7;
const QUOTER_TRADE_GAS = 3e6;
const CHUNK_SIZE = 255;
async function multicallExecute(multicall, calls) {
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params);
    return {
      target: call.contract.address,
      callData
    };
  });
  const callRequestsChuck = chunk(callRequests, CHUNK_SIZE);
  try {
    const response = [];
    for (const callChuck of callRequestsChuck) {
      const result = await multicall.tryAggregate.staticCall(false, callChuck, { gasLimit: MAX_GAS_LIMIT });
      response.push(...result);
    }
    const callCount = calls.length;
    const callResult = [];
    for (let i = 0; i < callCount; i++) {
      const outputs = calls[i].outputs;
      const result = response[i];
      if (result.success) {
        const params = Abi.decode(outputs, result.returnData);
        callResult.push(params);
      } else {
        callResult.push(void 0);
      }
    }
    return callResult;
  } catch (e) {
    Trace.error("multicall call error", e);
    throw e;
  }
}

class MulContract {
  get address() {
    return this._address;
  }
  get abi() {
    return this._abi;
  }
  get functions() {
    return this._functions;
  }
  constructor(address, abi) {
    this._address = address;
    this._abi = toFragment(abi);
    this._functions = this._abi.filter((x) => x.type === "function").map((x) => FunctionFragment.from(x));
    const callFunctions = this._functions.filter((x) => x.stateMutability === "pure" || x.stateMutability === "view");
    for (const callFunction of callFunctions) {
      const { name } = callFunction;
      const getCall = makeCallFunction(this, name);
      if (!this[name])
        defineReadOnly(this, name, getCall);
    }
  }
}
function toFragment(abi) {
  return abi.map((item) => Fragment.from(item));
}
function makeCallFunction(contract, name) {
  return (...params) => {
    const { address } = contract;
    const f1 = contract.functions.find((f) => f.name === name);
    const f2 = contract.functions.find((f) => f.name === name);
    return {
      contract: {
        address
      },
      name,
      inputs: f1?.inputs,
      outputs: f2?.outputs,
      params
    };
  };
}
function defineReadOnly(object, name, value) {
  Object.defineProperty(object, name, {
    enumerable: true,
    value,
    writable: false
  });
}

class BaseAbi {
  constructor(connectInfo, address, abi) {
    this.provider = connectInfo.provider;
    this.connectInfo = connectInfo;
    this.addressInfo = connectInfo.addressInfo;
    this.mulContract = new MulContract(address, abi);
    this.contract = new Contract(address, abi, connectInfo.getWalletOrProvider());
  }
}

var __defProp$g = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$g(target, key, result);
  return result;
};
let ERC20 = class extends BaseAbi {
  constructor(connectInfo, token) {
    super(connectInfo, token, IERC20);
  }
  async allowance(owner, sender) {
    return (await this.contract.allowance(owner, sender)).toString();
  }
  async approve(spender, value) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "approve", [spender, value], {});
  }
  async transfer(to, value) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "transfer", [to, value], {});
  }
  async transferFrom(from, to, value) {
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "transferFrom", [from, to, value], {});
  }
  async totalSupply() {
    return (await this.contract.totalSupply()).toString();
  }
  async balanceOf(owner) {
    return (await this.contract.balanceOf(owner)).toString();
  }
  async name() {
    return (await this.contract.name()).toString();
  }
  async symbol() {
    return (await this.contract.symbol()).toString();
  }
  async decimals() {
    return Number.parseInt((await this.contract.decimals()).toString(), 10);
  }
};
ERC20 = __decorateClass$g([
  CacheKey("ERC20")
], ERC20);

var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$f(target, key, result);
  return result;
};
let MultiCallContract = class extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.multicall, Multicall2);
  }
  async singleCall(shapeWithLabel) {
    const [res] = await this.call(...[shapeWithLabel]);
    return res;
  }
  async call(...shapeWithLabels) {
    const calls = [];
    shapeWithLabels.forEach((relay) => {
      const pairs = toPairs(relay);
      pairs.forEach(([, value]) => {
        if (typeof value !== "string")
          calls.push(value);
      });
    });
    const res = await multicallExecute(this.contract, calls);
    let index = 0;
    const datas = shapeWithLabels.map((relay) => {
      const pairs = toPairs(relay);
      pairs.forEach((obj) => {
        if (typeof obj[1] !== "string") {
          obj[1] = res[index];
          index++;
        }
      });
      return fromPairs(pairs);
    });
    return datas;
  }
};
MultiCallContract = __decorateClass$f([
  CacheKey("MultiCallContract")
], MultiCallContract);

var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$e(target, key, result);
  return result;
};
let PoolV3 = class extends BaseAbi {
  constructor(connectInfo, poolAddress) {
    super(connectInfo, poolAddress, IAgniPool);
  }
};
PoolV3 = __decorateClass$e([
  CacheKey("PoolV3")
], PoolV3);

var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$d(target, key, result);
  return result;
};
const MaxUint128 = 2n ** 128n - 1n;
let NonfungiblePositionManager = class extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.nonfungiblePositionManager, INonfungiblePositionManager);
  }
  async collect(tokenId, token0, token1, fee0, fee1, involvesMNT) {
    const calldatas = [];
    const involvesETH = involvesMNT && (token0.address === ETH_ADDRESS || token1.address === ETH_ADDRESS);
    const account = this.connectInfo.account;
    calldatas.push(
      this.contract.interface.encodeFunctionData("collect", [{
        tokenId,
        recipient: involvesETH ? ZERO_ADDRESS : account,
        amount0Max: MaxUint128.toString(),
        amount1Max: MaxUint128.toString()
      }])
    );
    if (involvesETH) {
      const ethAmount = token0.address === ETH_ADDRESS ? fee0 : fee1;
      const token = token0.address === ETH_ADDRESS ? token1 : token0;
      const tokenAmount = token0.address === ETH_ADDRESS ? fee1 : fee0;
      calldatas.push(
        this.contract.interface.encodeFunctionData("unwrapWMNT", [ethAmount, account])
      );
      calldatas.push(
        this.contract.interface.encodeFunctionData("sweepToken", [token.erc20Address(), tokenAmount, account])
      );
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas]);
  }
  async addLiquidity(position, tokenId, createPool, slippageTolerance, deadline) {
    invariant(position.liquidity > ZERO$1, "ZERO_LIQUIDITY");
    const recipient = this.connectInfo.account;
    const calldatas = [];
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts;
    const minimumAmounts = position.mintAmountsWithSlippage(slippageTolerance);
    const amount0Min = minimumAmounts.amount0;
    const amount1Min = minimumAmounts.amount1;
    if (createPool) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("createAndInitializePoolIfNecessary", [
          position.pool.token0.erc20Address(),
          position.pool.token1.erc20Address(),
          position.pool.fee,
          position.pool.sqrtRatioX96
        ])
      );
    }
    if (tokenId !== null) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("increaseLiquidity", [
          {
            tokenId: BigInt(tokenId),
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            deadline
          }
        ])
      );
    } else {
      calldatas.push(
        this.contract.interface.encodeFunctionData("mint", [{
          token0: position.pool.token0.erc20Address(),
          token1: position.pool.token1.erc20Address(),
          fee: position.pool.fee,
          tickLower: position.tickLower,
          tickUpper: position.tickUpper,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          recipient,
          deadline
        }])
      );
    }
    let value = "0";
    if (position.pool.token0.isNative || position.pool.token1.isNative) {
      const wrapped = position.pool.token0.isNative ? position.pool.token0 : position.pool.token1.isNative ? position.pool.token1 : null;
      const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired;
      if (wrappedValue > ZERO$1)
        calldatas.push(this.contract.interface.encodeFunctionData("refundMNT", []));
      value = wrappedValue.toString();
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas], {
      value
    });
  }
  async removeLiquidity(rate, token0, token1, partialPosition, tokenId, fee0, fee1, involvesMNT, slippageTolerance, deadline) {
    const calldatas = [];
    invariant(partialPosition.liquidity > ZERO$1, "ZERO_LIQUIDITY");
    const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
      slippageTolerance
    );
    calldatas.push(
      this.contract.interface.encodeFunctionData("decreaseLiquidity", [
        {
          tokenId,
          liquidity: partialPosition.liquidity,
          amount0Min,
          amount1Min,
          deadline
        }
      ])
    );
    const involvesETH = involvesMNT && (token0.address === ETH_ADDRESS || token1.address === ETH_ADDRESS);
    const account = this.connectInfo.account;
    calldatas.push(
      this.contract.interface.encodeFunctionData("collect", [{
        tokenId,
        recipient: involvesETH ? ZERO_ADDRESS : account,
        amount0Max: MaxUint128.toString(),
        amount1Max: MaxUint128.toString()
      }])
    );
    if (involvesETH) {
      const ethAmount = token0.address === ETH_ADDRESS ? new BigNumber(fee0).multipliedBy(amount0Min.toString()).toFixed(0, BigNumber.ROUND_DOWN) : new BigNumber(fee1).multipliedBy(amount1Min.toString()).toFixed(0, BigNumber.ROUND_DOWN);
      const token = token0.address === ETH_ADDRESS ? token1 : token0;
      const tokenAmount = token0.address === ETH_ADDRESS ? new BigNumber(fee1).multipliedBy(amount1Min.toString()).toFixed(0, BigNumber.ROUND_DOWN) : new BigNumber(fee0).multipliedBy(amount0Min.toString()).toFixed(0, BigNumber.ROUND_DOWN);
      calldatas.push(
        this.contract.interface.encodeFunctionData("unwrapWMNT", [ethAmount, account])
      );
      calldatas.push(
        this.contract.interface.encodeFunctionData("sweepToken", [token.erc20Address(), tokenAmount, account])
      );
    }
    if (new BigNumber(rate).comparedTo("100") >= 0) {
      calldatas.push(
        this.contract.interface.encodeFunctionData("burn", [tokenId])
      );
    }
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "multicall", [calldatas]);
  }
};
__decorateClass$d([
  EnableLogs()
], NonfungiblePositionManager.prototype, "addLiquidity", 1);
__decorateClass$d([
  EnableLogs()
], NonfungiblePositionManager.prototype, "removeLiquidity", 1);
NonfungiblePositionManager = __decorateClass$d([
  CacheKey("NonfungiblePositionManager")
], NonfungiblePositionManager);

var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$c(target, key, result);
  return result;
};
let StakingPoolAbi = class extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.launchpadStakePool, IStakingPool);
  }
  async stake(token, tokenIdOrAmount) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "stake", args);
  }
  async unstake(stakeIds) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "unstake", args);
  }
};
__decorateClass$c([
  EnableLogs()
], StakingPoolAbi.prototype, "stake", 1);
__decorateClass$c([
  EnableLogs()
], StakingPoolAbi.prototype, "unstake", 1);
StakingPoolAbi = __decorateClass$c([
  CacheKey("StakingPoolAbi")
], StakingPoolAbi);

var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$b(target, key, result);
  return result;
};
let InsurancePoolAbi = class extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.launchpadInsurancePool, InsurancePool);
  }
  async claimLoss(insuranceId) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "claimLoss", args);
  }
};
__decorateClass$b([
  EnableLogs()
], InsurancePoolAbi.prototype, "claimLoss", 1);
InsurancePoolAbi = __decorateClass$b([
  CacheKey("InsurancePoolAbi")
], InsurancePoolAbi);

var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$a(target, key, result);
  return result;
};
let IdoPoolAbi = class extends BaseAbi {
  constructor(connectInfo, address) {
    super(connectInfo, address, IdoPool);
  }
  async enroll() {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "enroll", args);
  }
  async presaleDeposit(buyQuota, buyInsurance) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "presaleDeposit", args);
  }
  async publicSaleDeposit(buyInsurance, buyQuota, extraDeposit) {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "publicSaleDeposit", args);
  }
  async claim() {
    const args = Array.from(arguments);
    return await this.connectInfo.tx().sendContractTransaction(this.contract, "claim(", args);
  }
};
IdoPoolAbi = __decorateClass$a([
  CacheKey("IdoPoolAbi")
], IdoPoolAbi);

var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$9(target, key, result);
  return result;
};
let IQuoterV2Abi = class extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.quoterV2, IQuoterV2);
  }
};
IQuoterV2Abi = __decorateClass$9([
  CacheKey("IQuoterV2Abi")
], IQuoterV2Abi);

var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$8(target, key, result);
  return result;
};
let GasMultiCallContract = class extends BaseAbi {
  constructor(connectInfo) {
    super(connectInfo, connectInfo.addressInfo.gasMulticall, GasLimitMulticall);
  }
  async multicall(callRequests) {
    const splitCallsIntoChunks = (calls) => {
      const chunks = [[]];
      const gasLimit = Number.parseInt(Number(MAX_GAS_LIMIT * 0.9).toString());
      let gasLeft = gasLimit;
      for (const callRequest of calls) {
        const { target, callData, gasLimit: gasCostLimit } = callRequest;
        const singleGasLimit = gasCostLimit;
        const currentChunk = chunks[chunks.length - 1];
        if (singleGasLimit > gasLeft) {
          chunks.push([callRequest]);
          gasLeft = gasLimit - singleGasLimit;
          if (gasLeft < 0) {
            throw new Error(
              `Multicall request may fail as the gas cost of a single call exceeds the gas limit ${gasLimit}. Gas cost: ${singleGasLimit}. To: ${target}. Data: ${callData}`
            );
          }
          continue;
        }
        currentChunk.push(callRequest);
        gasLeft -= singleGasLimit;
      }
      return chunks;
    };
    const callRequestsChuck = splitCallsIntoChunks(callRequests);
    try {
      const response = [];
      for (const callChuck of callRequestsChuck) {
        const {
          returnData
        } = await this.contract.multicall.staticCall(callChuck, { gasLimit: MAX_GAS_LIMIT });
        response.push(...returnData);
      }
      return response;
    } catch (e) {
      Trace.error("multicall call error", e);
      throw e;
    }
  }
};
GasMultiCallContract = __decorateClass$8([
  CacheKey("GasMultiCallContract")
], GasMultiCallContract);

const _NoTickDataProvider = class {
  async getTick(_tick) {
    throw new Error(_NoTickDataProvider.ERROR_MESSAGE);
  }
  async nextInitializedTickWithinOneWord(_tick, _lte, _tickSpacing) {
    throw new Error(_NoTickDataProvider.ERROR_MESSAGE);
  }
};
let NoTickDataProvider = _NoTickDataProvider;
NoTickDataProvider.ERROR_MESSAGE = "No tick data provider was given";

class TickListDataProvider {
  constructor(ticks) {
    const ticksMapped = ticks.map((t) => t instanceof Tick ? t : new Tick(t));
    this.ticks = ticksMapped;
  }
  async getTick(tick) {
    return TickList.getTick(this.ticks, tick);
  }
  async nextInitializedTickWithinOneWord(tick, lte, tickSpacing) {
    return TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing);
  }
}

const NO_TICK_DATA_PROVIDER_DEFAULT = new NoTickDataProvider();
class Pool {
  static getAddress(token0, token1, feeAmount) {
    return PoolV3Api.computePoolAddress(token0, token1, feeAmount);
  }
  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  constructor(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent, ticks = NO_TICK_DATA_PROVIDER_DEFAULT) {
    invariant(Number.isInteger(fee) && fee < 1e6, "FEE");
    [this.token0, this.token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    this.fee = fee;
    this.sqrtRatioX96 = BigInt(sqrtRatioX96);
    this.liquidity = BigInt(liquidity);
    this.tickCurrent = tickCurrent;
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks) : ticks;
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  get token0Price() {
    return this._token0Price ?? (this._token0Price = new Price(this.token0, this.token1, Q192, this.sqrtRatioX96 * this.sqrtRatioX96));
  }
  /**
   * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
   */
  get token1Price() {
    return this._token1Price ?? (this._token1Price = new Price(this.token1, this.token0, this.sqrtRatioX96 * this.sqrtRatioX96, Q192));
  }
  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  priceOf(token) {
    invariant(this.involvesToken(token), "TOKEN");
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pool.
   */
  get chainId() {
    return this.token0.chainId;
  }
  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  async getOutputAmount(inputAmount, sqrtPriceLimitX96) {
    invariant(this.involvesToken(inputAmount.currency), "TOKEN");
    const zeroForOne = inputAmount.currency.equals(this.token0);
    const {
      amountCalculated: outputAmount,
      sqrtRatioX96,
      liquidity,
      tickCurrent
    } = await this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);
    const outputToken = zeroForOne ? this.token1 : this.token0;
    return [
      CurrencyAmount.fromRawAmount(outputToken, outputAmount * NEGATIVE_ONE),
      new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)
    ];
  }
  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  async getInputAmount(outputAmount, sqrtPriceLimitX96) {
    invariant(outputAmount.currency.isToken && this.involvesToken(outputAmount.currency), "TOKEN");
    const zeroForOne = outputAmount.currency.equals(this.token1);
    const {
      amountSpecifiedRemaining,
      amountCalculated: inputAmount,
      sqrtRatioX96,
      liquidity,
      tickCurrent
    } = await this.swap(zeroForOne, outputAmount.quotient * NEGATIVE_ONE, sqrtPriceLimitX96);
    invariant(amountSpecifiedRemaining === ZERO, "INSUFICIENT_LIQUIDITY");
    const inputToken = zeroForOne ? this.token0 : this.token1;
    return [
      CurrencyAmount.fromRawAmount(inputToken, inputAmount),
      new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)
    ];
  }
  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  async swap(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
    if (!sqrtPriceLimitX96)
      sqrtPriceLimitX96 = zeroForOne ? TickMath.MIN_SQRT_RATIO + ONE : TickMath.MAX_SQRT_RATIO - ONE;
    if (zeroForOne) {
      invariant(sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO, "RATIO_MIN");
      invariant(sqrtPriceLimitX96 < this.sqrtRatioX96, "RATIO_CURRENT");
    } else {
      invariant(sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO, "RATIO_MAX");
      invariant(sqrtPriceLimitX96 > this.sqrtRatioX96, "RATIO_CURRENT");
    }
    const exactInput = amountSpecified >= ZERO;
    const state = {
      amountSpecifiedRemaining: amountSpecified,
      amountCalculated: ZERO,
      sqrtPriceX96: this.sqrtRatioX96,
      tick: this.tickCurrent,
      liquidity: this.liquidity
    };
    while (state.amountSpecifiedRemaining !== ZERO && state.sqrtPriceX96 !== sqrtPriceLimitX96) {
      const step = {};
      step.sqrtPriceStartX96 = state.sqrtPriceX96;
      [step.tickNext, step.initialized] = await this.tickDataProvider.nextInitializedTickWithinOneWord(
        state.tick,
        zeroForOne,
        this.tickSpacing
      );
      if (step.tickNext < TickMath.MIN_TICK)
        step.tickNext = TickMath.MIN_TICK;
      else if (step.tickNext > TickMath.MAX_TICK)
        step.tickNext = TickMath.MAX_TICK;
      step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
      [state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount] = SwapMath.computeSwapStep(
        state.sqrtPriceX96,
        (zeroForOne ? step.sqrtPriceNextX96 < sqrtPriceLimitX96 : step.sqrtPriceNextX96 > sqrtPriceLimitX96) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96,
        state.liquidity,
        state.amountSpecifiedRemaining,
        this.fee
      );
      if (exactInput) {
        state.amountSpecifiedRemaining = state.amountSpecifiedRemaining - (step.amountIn + step.feeAmount);
        state.amountCalculated = state.amountCalculated - step.amountOut;
      } else {
        state.amountSpecifiedRemaining = state.amountSpecifiedRemaining + step.amountOut;
        state.amountCalculated = state.amountCalculated + (step.amountIn + step.feeAmount);
      }
      if (state.sqrtPriceX96 === step.sqrtPriceNextX96) {
        if (step.initialized) {
          let liquidityNet = BigInt((await this.tickDataProvider.getTick(step.tickNext)).liquidityNet);
          if (zeroForOne)
            liquidityNet = liquidityNet * NEGATIVE_ONE;
          state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
        }
        state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
      } else if (state.sqrtPriceX96 !== step.sqrtPriceStartX96) {
        state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
      }
    }
    return {
      amountSpecifiedRemaining: state.amountSpecifiedRemaining,
      amountCalculated: state.amountCalculated,
      sqrtRatioX96: state.sqrtPriceX96,
      liquidity: state.liquidity,
      tickCurrent: state.tick
    };
  }
  get tickSpacing() {
    return TICK_SPACINGS[this.fee];
  }
}

class Position {
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  constructor({ pool, liquidity, tickLower, tickUpper }) {
    // cached resuts for the getters
    this._token0Amount = null;
    this._token1Amount = null;
    this._mintAmounts = null;
    invariant(tickLower < tickUpper, "TICK_ORDER");
    invariant(tickLower >= TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0, "TICK_LOWER");
    invariant(tickUpper <= TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0, "TICK_UPPER");
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */
  get token0PriceLower() {
    return tickToPrice(this.pool.token0, this.pool.token1, this.tickLower);
  }
  /**
   * Returns the price of token0 at the upper tick
   */
  get token0PriceUpper() {
    return tickToPrice(this.pool.token0, this.pool.token1, this.tickUpper);
  }
  /**
   * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
   */
  get amount0() {
    if (this._token0Amount === null) {
      this._token0Amount = CurrencyAmount.fromRawAmount(
        this.pool.token0,
        PositionMath.getToken0Amount(
          this.pool.tickCurrent,
          this.tickLower,
          this.tickUpper,
          this.pool.sqrtRatioX96,
          this.liquidity
        )
      );
    }
    return this._token0Amount;
  }
  /**
   * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
   */
  get amount1() {
    if (this._token1Amount === null) {
      this._token1Amount = CurrencyAmount.fromRawAmount(
        this.pool.token1,
        PositionMath.getToken1Amount(
          this.pool.tickCurrent,
          this.tickLower,
          this.tickUpper,
          this.pool.sqrtRatioX96,
          this.liquidity
        )
      );
    }
    return this._token1Amount;
  }
  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  ratiosAfterSlippage(slippageTolerance) {
    const priceLower = this.pool.token0Price.asFraction.multiply(new Percent(1).subtract(slippageTolerance));
    const priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    let sqrtRatioX96Lower = encodeSqrtRatioX96(priceLower.numerator, priceLower.denominator);
    if (sqrtRatioX96Lower <= TickMath.MIN_SQRT_RATIO)
      sqrtRatioX96Lower = TickMath.MIN_SQRT_RATIO + 1n;
    let sqrtRatioX96Upper = encodeSqrtRatioX96(priceUpper.numerator, priceUpper.denominator);
    if (sqrtRatioX96Upper >= TickMath.MAX_SQRT_RATIO)
      sqrtRatioX96Upper = TickMath.MAX_SQRT_RATIO - 1n;
    return {
      sqrtRatioX96Lower,
      sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  mintAmountsWithSlippage(slippageTolerance) {
    const { sqrtRatioX96Upper, sqrtRatioX96Lower } = this.ratiosAfterSlippage(slippageTolerance);
    const poolLower = new Pool(
      this.pool.token0,
      this.pool.token1,
      this.pool.fee,
      sqrtRatioX96Lower,
      0,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower)
    );
    const poolUpper = new Pool(
      this.pool.token0,
      this.pool.token1,
      this.pool.fee,
      sqrtRatioX96Upper,
      0,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)
    );
    const positionThatWillBeCreated = Position.fromAmounts({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper,
      ...this.mintAmounts,
      // the mint amounts are what will be passed as calldata
      useFullPrecision: false
    });
    const { amount0 } = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts;
    const { amount1 } = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts;
    return { amount0, amount1 };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  burnAmountsWithSlippage(slippageTolerance) {
    const { sqrtRatioX96Upper, sqrtRatioX96Lower } = this.ratiosAfterSlippage(slippageTolerance);
    const poolLower = new Pool(
      this.pool.token0,
      this.pool.token1,
      this.pool.fee,
      sqrtRatioX96Lower,
      0,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower)
    );
    const poolUpper = new Pool(
      this.pool.token0,
      this.pool.token1,
      this.pool.fee,
      sqrtRatioX96Upper,
      0,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)
    );
    const { amount0 } = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    });
    const { amount1 } = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    });
    return { amount0: amount0.quotient, amount1: amount1.quotient };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */
  get mintAmounts() {
    if (this._mintAmounts === null) {
      if (this.pool.tickCurrent < this.tickLower) {
        return {
          amount0: SqrtPriceMath.getAmount0Delta(
            TickMath.getSqrtRatioAtTick(this.tickLower),
            TickMath.getSqrtRatioAtTick(this.tickUpper),
            this.liquidity,
            true
          ),
          amount1: ZERO$1
        };
      }
      if (this.pool.tickCurrent < this.tickUpper) {
        return {
          amount0: SqrtPriceMath.getAmount0Delta(
            this.pool.sqrtRatioX96,
            TickMath.getSqrtRatioAtTick(this.tickUpper),
            this.liquidity,
            true
          ),
          amount1: SqrtPriceMath.getAmount1Delta(
            TickMath.getSqrtRatioAtTick(this.tickLower),
            this.pool.sqrtRatioX96,
            this.liquidity,
            true
          )
        };
      }
      return {
        amount0: ZERO$1,
        amount1: SqrtPriceMath.getAmount1Delta(
          TickMath.getSqrtRatioAtTick(this.tickLower),
          TickMath.getSqrtRatioAtTick(this.tickUpper),
          this.liquidity,
          true
        )
      };
    }
    return this._mintAmounts;
  }
  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  static fromAmounts({
    pool,
    tickLower,
    tickUpper,
    amount0,
    amount1,
    useFullPrecision
  }) {
    const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool,
      tickLower,
      tickUpper,
      liquidity: maxLiquidityForAmounts(
        pool.sqrtRatioX96,
        sqrtRatioAX96,
        sqrtRatioBX96,
        amount0,
        amount1,
        useFullPrecision
      )
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */
  static fromAmount0({
    pool,
    tickLower,
    tickUpper,
    amount0,
    useFullPrecision
  }) {
    return Position.fromAmounts({ pool, tickLower, tickUpper, amount0, amount1: MaxUint256, useFullPrecision });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */
  static fromAmount1({
    pool,
    tickLower,
    tickUpper,
    amount1
  }) {
    return Position.fromAmounts({ pool, tickLower, tickUpper, amount0: MaxUint256, amount1, useFullPrecision: true });
  }
}

const TokenPriceGQL = gql`
    query b ($addresses:[String]) {
        bundles {
            ethPriceUSD
        }
        tokens(
            where: {id_in: $addresses}
        ) {
            id
            derivedETH
        }
    }

`;
const AllV3TicksGQL = gql`
    query AllV3Ticks($poolAddress: String!, $lastTick: Int!, $pageSize: Int!) {
        ticks(
            first: $pageSize,
            where: {
                poolAddress: $poolAddress,
                tickIdx_gt: $lastTick,
            },
            orderBy: tickIdx
        ) {
            tick: tickIdx
            liquidityNet
            liquidityGross
        }
    }
`;
const FeeTierDistributionGQL = gql`
    query FeeTierDistribution($token0: String!, $token1: String!) {
        _meta {
            block {
                number
            }
        }
        asToken0: pools(
            orderBy: totalValueLockedToken0
            orderDirection: desc
            where: { token0: $token0, token1: $token1 }
        ) {
            feeTier
            totalValueLockedToken0
            totalValueLockedToken1
        }
        asToken1: pools(
            orderBy: totalValueLockedToken0
            orderDirection: desc
            where: { token0: $token1, token1: $token0 }
        ) {
            feeTier
            totalValueLockedToken0
            totalValueLockedToken1
        }
    }
`;
const PositionHistoryGQL = gql`
    query positionHistory($tokenId: String!) {
        positionSnapshots(where: { position: $tokenId }, orderBy: timestamp, orderDirection: desc, first: 30) {
            id
            transaction {
                mints(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                    id
                    timestamp
                    amount1
                    amount0
                    logIndex
                }
                burns(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                    id
                    timestamp
                    amount1
                    amount0
                    logIndex
                }
                collects(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                    id
                    timestamp
                    amount0
                    amount1
                    logIndex
                }
            }
        }
    }
`;
const UserStakeInfosGQL = gql`
    query stakeInfos($token:String!,$user:String!) {
        stakeInfos(where:{unStaked:false user:$user token:$token}){
            id
            user
            token
            tokenIdOrAmount
            unlockTime
            score
            unStaked

        }
    }
`;
const QueryIdoPoolInfosGQL = gql`
    query poolInfos {
        idoPoolStatistics(id: "idoPoolStatistics") {
            totalParticipants
            fundedProjects
        }
        idoPools(orderBy: block, orderDirection: desc) {
            id
            timestamp
            fundraiser
            raisingToken
            raisingTokenInfo {
                id
                name
                symbol
                decimals
            }
            sellingToken
            sellingTokenInfo {
                id
                name
                symbol
                decimals
            }
            totalSupply
            presalePrice
            publicSalePrice
            presaleAndEnrollStartTime
            presaleAndEnrollEndTime
            presaleAndEnrollPeriod
            publicSaleDepositStartTime
            publicSaleDepositEndTime
            publicSaleDepositPeriod
            claimStartTime
            unlockTillTime
            lockPeriod
            tgeUnlockRatio
            insuranceFeeRate
            platformCommissionFeeRate
            enrollCount
            totalBuy
            totalRaised
            totalExtraDeposit
            whiteListQuota
            whiteListCount
            publicQuota
            publicCount
        }
    }
`;
const QueryTokenATHPriceHistory = gql`
    query tokenDayDatas($token:String!) {
        tokenDayDatas(
            orderBy: date
            orderDirection: desc
            first: 1000
            where: {token: $token}
        ) {
            date
            priceUSD
            high
        }
    }
`;
const QueryIDOUserDepositedLogsByPool = gql`
    query userDepositedLogs($user:String!,$pool:String!) {
        idoPoolClaimedLogs(where:{user:$user pool:$pool refund_gt:0}){
            refund
        }
        idoPoolPresaleDepositedLogs(where:{user:$user pool:$pool}){
            buyQuota
            buyInsurance
        }
        idoPoolPublicSaleDepositedLogs(where:{user:$user pool:$pool}){
            buyInsurance
            buyQuota
            extraDeposit
        }
    }
`;
const QueryIDOPoolInfo = gql`query poolInfo($id:String!) {
    idoPool(id:$id) {
        id
        timestamp
        fundraiser
        raisingToken
        raisingTokenInfo {
            id
            name
            symbol
            decimals
        }
        sellingToken
        sellingTokenInfo {
            id
            name
            symbol
            decimals
        }
        totalSupply
        presalePrice
        publicSalePrice
        presaleAndEnrollStartTime
        presaleAndEnrollEndTime
        presaleAndEnrollPeriod
        publicSaleDepositStartTime
        publicSaleDepositEndTime
        publicSaleDepositPeriod
        claimStartTime
        unlockTillTime
        lockPeriod
        tgeUnlockRatio
        insuranceFeeRate
        platformCommissionFeeRate
        enrollCount
        whiteListQuota
        whiteListCount
        publicQuota
        publicCount
        totalRaised
    }
}`;
function QueryBlockTimeGQL(timestamps) {
  return gql`query blocks {
        ${timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
              number
            }`;
  })}
    }`;
}
const topPoolsGQL = gql`
    query topPools {
        pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
        }
    }
`;
function poolsBulkGQL(block, pools) {
  let poolString = `[`;
  pools.forEach((address) => {
    poolString = `${poolString}"${address}",`;
  });
  poolString += "]";
  const queryString = `
    query pools {
      pools(where: {id_in: ${poolString}},
     ${block ? `block: {number: ${block}} ,` : ``}
     orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        feeTier
        liquidity
        sqrtPrice
        tick
        token0 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token1 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token0Price
        token1Price
        volumeUSD
        volumeToken0
        volumeToken1
        txCount
        totalValueLockedToken0
        totalValueLockedToken1
        totalValueLockedUSD
        feesUSD
        protocolFeesUSD
      }
      bundles(where: {id: "1"}) {
        ethPriceUSD
      }
    }
    `;
  return gql`
        ${queryString}
    `;
}
const topTokensGQL = gql`
    query topPools {
        tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
        }
    }
`;
function tokensBulkGQL(block, tokens) {
  let tokenString = `[`;
  tokens.forEach((address) => {
    tokenString = `${tokenString}"${address}",`;
  });
  tokenString += "]";
  const queryString = `
    query tokens {
      tokens(where: {id_in: ${tokenString}},
    ${block ? `block: {number: ${block}} ,` : ""}
     orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        symbol
        name
        derivedETH
        volumeUSD
        volume
        txCount
        totalValueLocked
        feesUSD
        totalValueLockedUSD
      }
    }
    `;
  return gql`
        ${queryString}
    `;
}
function ethPricesGQL(block24, block48, blockWeek) {
  const dayQueryString = block24 ? `oneDay: bundles(first: 1, block: { number: ${block24} }) {
      ethPriceUSD
    }` : "";
  const twoDayQueryString = block48 ? `twoDay: bundles(first: 1, block: { number: ${block48} }) {
      ethPriceUSD
    }` : "";
  const weekQueryString = blockWeek ? `oneWeek: bundles(first: 1, block: { number: ${blockWeek} }) {
      ethPriceUSD
    }` : "";
  const queryString = `
  query prices {
    current: bundles(first: 1) {
      ethPriceUSD
    }
    ${dayQueryString}
    ${twoDayQueryString}
    ${weekQueryString}
  }
`;
  return gql`
        ${queryString}
    `;
}
function globalDataGQL(block) {
  const queryString = ` query magmaFactories {
      factories(
       ${block ? `block: { number: ${block}}` : ``}
       first: 1) {
        txCount
        totalVolumeUSD
        totalFeesUSD
        totalValueLockedUSD
        totalProtocolFeesUSD
      }
    }`;
  return gql`
        ${queryString}
    `;
}
const globalChartGQL = gql`
    query pancakeDayDatas($startTime: Int!, $skip: Int!) {
        pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
            id
            date
            volumeUSD
            tvlUSD
        }
    }
`;
const globalTransactionsGQL = gql`
    query transactions {
        mints(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            owner
            sender
            origin
            amount0
            amount1
            amountUSD
        }
        swaps(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            origin
            amount0
            amount1
            amountUSD
        }
        burns(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            owner
            origin
            amount0
            amount1
            amountUSD
        }
    }
`;

class TransactionHistory {
  constructor() {
    this.baseApi = BASE_API;
  }
  getKey(connectInfo) {
    return `${connectInfo.chainId}-${connectInfo.account}`;
  }
  initUpdateTransaction(connectInfo, start) {
    if (start) {
      TransactionHistory.connect = connectInfo;
      TransactionHistory.start = start;
      this.startUpdateTransaction();
    } else {
      TransactionHistory.connect = void 0;
      TransactionHistory.start = start;
      if (TransactionHistory.timoutId)
        clearTimeout(TransactionHistory.timoutId);
    }
  }
  startUpdateTransaction() {
    if (TransactionHistory.timoutId)
      clearTimeout(TransactionHistory.timoutId);
    if (TransactionHistory.start && TransactionHistory.connect) {
      TransactionHistory.timoutId = setTimeout(async () => {
        try {
          await this.updateTransaction(TransactionHistory.connect);
        } finally {
          this.startUpdateTransaction();
        }
      }, 5e3);
    } else {
      TransactionHistory.timoutId = null;
    }
  }
  async updateTransaction(connectInfo) {
    const transactions = this.storageHistories(connectInfo);
    const storageRecentTransactions = transactions.filter((it) => it.status === "pending");
    for (const storageRecentTransaction of storageRecentTransactions) {
      try {
        await connectInfo.tx().checkTransactionError(storageRecentTransaction.txHash);
        storageRecentTransaction.status = "success";
      } catch (e) {
        storageRecentTransaction.status = "fail";
      }
    }
    this.update(connectInfo, storageRecentTransactions);
  }
  saveHistory(connectInfo, event, saveData) {
    try {
      const transactions = this.storageHistories(connectInfo);
      const data = {
        index: transactions.length,
        txHash: event.hash(),
        chainId: connectInfo.chainId,
        token0: saveData.token0,
        token1: saveData.token1,
        token0Amount: saveData.token0Amount,
        token1Amount: saveData.token1Amount,
        type: saveData.type,
        time: (/* @__PURE__ */ new Date()).getTime(),
        to: saveData.to || connectInfo.account,
        status: "pending"
      };
      transactions.push(data);
      this.baseApi.address().storage?.setJson(this.getKey(connectInfo), transactions);
    } catch (e) {
      Trace.error("TransactionHistory:saveHistory error ", e);
    }
  }
  histories(connectInfo) {
    const storageRecentTransactions = this.storageHistories(connectInfo);
    return Array.from(storageRecentTransactions).reverse().map((it) => {
      const chainName = connectInfo.addressInfo.chainName;
      let title = "";
      switch (it.type) {
        case "remove":
          title = `Remove ${it.token0Amount} ${it.token0.symbol} for ${it.token1Amount} ${it.token1.symbol} to ${it.to}`;
          break;
        case "add":
          title = `Add ${it.token0Amount} ${it.token0.symbol} for ${it.token1Amount} ${it.token1.symbol} to ${it.to}`;
          break;
        case "collect_fee":
          title = `Collect Fee ${it.token0Amount} ${it.token0.symbol} for ${it.token1Amount} ${it.token1.symbol} to ${it.to}`;
          break;
        case "swap":
          title = `Swap ${it.token0Amount} ${it.token0.symbol} for min.${it.token1Amount} ${it.token1.symbol} to ${it.to}`;
          break;
      }
      return {
        ...it,
        hashUrl: connectInfo.addressInfo.getEtherscanAddress(it.txHash),
        title,
        chainName
      };
    });
  }
  removeByTxHash(connectInfo, txHash) {
    this.baseApi.address().storage?.setJson(this.getKey(connectInfo), this.storageHistories(connectInfo).filter((it) => it.txHash === txHash));
  }
  removeByIndex(connectInfo, index) {
    this.baseApi.address().storage?.setJson(this.getKey(connectInfo), this.storageHistories(connectInfo).filter((it) => it.index === index));
  }
  update(connectInfo, transactions) {
    const storageRecentTransactions = this.storageHistories(connectInfo);
    for (const it of transactions) {
      if (storageRecentTransactions[it.index].txHash === it.txHash)
        storageRecentTransactions[it.index] = it;
    }
    this.baseApi.address().storage?.setJson(this.getKey(connectInfo), storageRecentTransactions);
  }
  removeAll(connectInfo) {
    this.baseApi.address().storage?.setJson(this.getKey(connectInfo), []);
  }
  storageHistories(connectInfo) {
    return this.baseApi.address().storage?.getArray(this.getKey(connectInfo)) || [];
  }
}
const transactionHistory = new TransactionHistory();

var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$7(target, key, result);
  return result;
};
let PoolV3Api = class {
  constructor() {
    this.baseApi = BASE_API;
  }
  async myLiquidityList(connectInfo) {
    const nonfungiblePositionManager = connectInfo.create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
    const account = connectInfo.account;
    const [{ balanceOf }] = await connectInfo.multiCall().call({
      balanceOf: nonfungiblePositionManager.mulContract.balanceOf(account)
    });
    if (balanceOf === "0") {
      return {
        hideClosePosition: [],
        allPosition: []
      };
    }
    const tokenIds = await connectInfo.multiCall().call(...Array.from(Array.from({ length: Number.parseInt(balanceOf, 10) }).keys()).map((it) => {
      return {
        index: Number(it).toString(),
        tokenId: nonfungiblePositionManager.mulContract.tokenOfOwnerByIndex(account, it)
      };
    }));
    const positions = await connectInfo.multiCall().call(...tokenIds.map((it) => {
      return {
        tokenId: it.tokenId,
        position: nonfungiblePositionManager.mulContract.positions(it.tokenId)
      };
    }));
    const batchGetTokens = await this.baseApi.address().getApi().tokenMangerApi().batchGetTokens(
      Array.from(new Set(positions.map((it) => [it.position.token0, it.position.token1, ETH_ADDRESS]).flatMap((it) => it)))
    );
    const pools = await this.getPool(positions.map((it) => {
      const token0 = batchGetTokens[it.position.token0.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? ETH_ADDRESS : it.position.token0];
      const token1 = batchGetTokens[it.position.token1.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? ETH_ADDRESS : it.position.token1];
      return {
        token0,
        token1,
        feeAmount: Number.parseInt(it.position.fee)
      };
    }));
    const allPosition = positions.map((it, index) => {
      const token0 = batchGetTokens[it.position.token0.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? ETH_ADDRESS : it.position.token0];
      const token1 = batchGetTokens[it.position.token1.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? ETH_ADDRESS : it.position.token1];
      const pool = pools[index];
      const liquidityDetails = new LiquidityListData();
      this.initLiquidityData(liquidityDetails, it.tokenId, token0, token1, pool, it.position);
      return liquidityDetails;
    }).sort((a, b) => {
      const sortRank = {
        active: 1,
        inactive: 2,
        close: 3
      };
      const rank1 = sortRank[a.state];
      const rank2 = sortRank[b.state];
      if (rank1 !== rank2)
        return rank1 - rank2;
      return Number.parseInt(b.tokenId) - Number.parseInt(a.tokenId);
    });
    return {
      allPosition,
      hideClosePosition: allPosition.filter((it) => it.state === "close")
    };
  }
  initLiquidityData(liquidityDetails, tokenId, token0, token1, pool, position) {
    liquidityDetails.tokenId = tokenId;
    liquidityDetails.token0 = token0;
    liquidityDetails.token1 = token1;
    liquidityDetails.feeAmount = Number.parseInt(position.fee);
    const price = pool.priceOf(token1).toFixed();
    liquidityDetails.minPrice = tickToPriceString(token1, token0, liquidityDetails.feeAmount, Number.parseInt(position.tickUpper));
    liquidityDetails.maxPrice = tickToPriceString(token1, token0, liquidityDetails.feeAmount, Number.parseInt(position.tickLower));
    liquidityDetails.currentPrice = price;
    liquidityDetails.reverseMinPrice = liquidityDetails.maxPrice === ENDLESS ? "0" : new BigNumber(1).div(liquidityDetails.maxPrice).toFixed();
    liquidityDetails.reverseMaxPrice = liquidityDetails.minPrice === "0" ? ENDLESS : new BigNumber(1).div(liquidityDetails.minPrice).toFixed();
    liquidityDetails.reverseCurrentPrice = pool.priceOf(token0).toFixed();
    if (new BigNumber(position.liquidity).comparedTo("0") > 0) {
      if (pool.tickCurrent < Number.parseInt(position.tickLower) || pool.tickCurrent >= Number.parseInt(position.tickUpper))
        liquidityDetails.state = "inactive";
      else
        liquidityDetails.state = "active";
    } else {
      liquidityDetails.state = "close";
    }
    liquidityDetails.liquidity = position.liquidity.toString();
  }
  async positionHistoryByTokenId(tokenId) {
    const { positionSnapshots } = await this.baseApi.exchangeGraph(PositionHistoryGQL, { tokenId });
    return positionSnapshots.flatMap((it) => it.transaction).flatMap((it) => {
      const mapToLiquidityHistory = (it2, type) => {
        return {
          time: Number.parseInt(it2.timestamp) * 1e3,
          type,
          txUrl: this.baseApi.address().getEtherscanTx(it2.id.split("#")[0]),
          token0Amount: it2.amount0,
          token1Amount: it2.amount1
        };
      };
      return [
        ...it.mints.map((it2) => mapToLiquidityHistory(it2, "add")),
        ...it.burns.map((it2) => mapToLiquidityHistory(it2, "remove")),
        ...it.collects.map((it2) => mapToLiquidityHistory(it2, "collect_fee"))
      ];
    }).sort((a, b) => {
      return new BigNumber(b.time).comparedTo(a.time);
    });
  }
  async myLiquidityByTokenId(connectInfo, tokenId) {
    const nonfungiblePositionManager = connectInfo.create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
    const account = connectInfo.account;
    const [{
      position
    }] = await this.baseApi.connectInfo().multiCall().call({
      position: nonfungiblePositionManager.mulContract.positions(tokenId)
    });
    if (position.fee === "0")
      throw new Error("token id not found");
    const batchGetTokens = await this.baseApi.address().getApi().tokenMangerApi().batchGetTokens(
      Array.from(/* @__PURE__ */ new Set([position.token0, position.token1, ETH_ADDRESS]))
    );
    const token0 = batchGetTokens[position.token0.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? ETH_ADDRESS : position.token0];
    const token1 = batchGetTokens[position.token1.toLowerCase() === this.baseApi.address().WMNT.toLowerCase() ? ETH_ADDRESS : position.token1];
    const feeAmount = Number.parseInt(position.fee);
    const [[token0Price, token1Price], [pool], collect, liquidityHistory, balanceAndAllowances] = await Promise.all([
      this.baseApi.address().getApi().tokenMangerApi().tokenPrice(token0, token1),
      this.getPool([{ token0, token1, feeAmount }]),
      this.collectFeeData(tokenId, account),
      this.positionHistoryByTokenId(tokenId),
      this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
        account,
        this.baseApi.address().nonfungiblePositionManager,
        [token0, token1]
      )
    ]);
    const positionDetail = new Position({
      pool,
      liquidity: position.liquidity,
      tickLower: Number.parseInt(position.tickLower),
      tickUpper: Number.parseInt(position.tickUpper)
    });
    const liquidityInfo = new LiquidityInfo();
    this.initLiquidityData(liquidityInfo, tokenId, token0, token1, pool, position);
    liquidityInfo.token0Amount = positionDetail.amount0.toFixed();
    liquidityInfo.token1Amount = positionDetail.amount1.toFixed();
    liquidityInfo.token0Balance = balanceAndAllowances[token0.address];
    liquidityInfo.token1Balance = balanceAndAllowances[token1.address];
    liquidityInfo.token0Price = token0Price;
    liquidityInfo.token1Price = token1Price;
    liquidityInfo.token0USD = new BigNumber(token0Price.priceUSD).multipliedBy(liquidityInfo.token0Amount).toFixed();
    liquidityInfo.token1USD = new BigNumber(token1Price.priceUSD).multipliedBy(liquidityInfo.token1Amount).toFixed();
    liquidityInfo.liquidityUSD = new BigNumber(liquidityInfo.token0USD).plus(liquidityInfo.token1USD).toFixed();
    liquidityInfo.collectToken0 = new BigNumber(collect.amount0).div(10 ** token0.decimals).toFixed(token0.decimals, BigNumber.ROUND_DOWN);
    liquidityInfo.collectToken1 = new BigNumber(collect.amount1).div(10 ** token1.decimals).toFixed(token1.decimals, BigNumber.ROUND_DOWN);
    liquidityInfo.collectToken0USD = new BigNumber(token0Price.priceUSD).multipliedBy(liquidityInfo.collectToken0).toFixed();
    liquidityInfo.collectToken1USD = new BigNumber(token1Price.priceUSD).multipliedBy(liquidityInfo.collectToken1).toFixed();
    liquidityInfo.collectUSD = new BigNumber(liquidityInfo.collectToken0USD).plus(liquidityInfo.collectToken1USD).toFixed();
    liquidityInfo.histories = liquidityHistory;
    liquidityInfo.apr = Number.parseFloat(liquidityInfo.liquidityUSD) <= 0 ? "0" : liquidityHistory.filter((it) => it.type === "collect_fee").map((it) => new BigNumber(token0Price.priceUSD).multipliedBy(it.token0Amount).plus(new BigNumber(token0Price.priceUSD).multipliedBy(it.token1Amount)).toFixed()).reduce((a, b) => new BigNumber(a).plus(b), new BigNumber("0")).plus(liquidityInfo.collectToken0USD).plus(liquidityInfo.collectToken1USD).div(liquidityInfo.liquidityUSD).multipliedBy(100).toFixed();
    liquidityInfo.collectFee = async (connect, involvesMNT) => {
      const transactionEvent = await connect.create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager).collect(
        tokenId,
        token0,
        token1,
        collect.amount0,
        collect.amount1,
        involvesMNT
      );
      transactionHistory.saveHistory(
        connectInfo,
        transactionEvent,
        {
          token0,
          token1,
          token0Amount: collect.amount0,
          token1Amount: collect.amount1,
          type: "collect_fee",
          to: null
        }
      );
      return transactionEvent;
    };
    liquidityInfo.preRemoveLiquidity = (rate) => {
      if (new BigNumber(rate).comparedTo("0") <= 0 || new BigNumber(rate).comparedTo("1") > 0)
        throw new BasicException("rate is zero");
      const positionDetail2 = new Position({
        pool,
        liquidity: new BigNumber(position.liquidity).multipliedBy(rate).toFixed(0, BigNumber.ROUND_DOWN),
        tickLower: Number.parseInt(position.tickLower),
        tickUpper: Number.parseInt(position.tickUpper)
      });
      const amount0 = positionDetail2.amount0.toFixed();
      const amount1 = positionDetail2.amount1.toFixed();
      return {
        amount0,
        amount1
      };
    };
    liquidityInfo.removeLiquidity = async (connect, rate, involvesMNT, allowedSlippage, deadline) => {
      const preRemoveLiquidity = liquidityInfo.preRemoveLiquidity(rate);
      const positionDetail2 = new Position({
        pool,
        liquidity: new BigNumber(position.liquidity).multipliedBy(rate).toFixed(0, BigNumber.ROUND_DOWN),
        tickLower: Number.parseInt(position.tickLower),
        tickUpper: Number.parseInt(position.tickUpper)
      });
      const transactionEvent = await connect.create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager).removeLiquidity(
        rate,
        token0,
        token1,
        positionDetail2,
        tokenId,
        collect.amount0,
        collect.amount1,
        involvesMNT,
        new Percent(BigInt(new BigNumber(allowedSlippage).multipliedBy(1e4).toFixed(0, BigNumber.ROUND_DOWN)), 10000n),
        Number.parseInt(String((/* @__PURE__ */ new Date()).getTime() / 1e3)) + Number.parseInt(deadline.toString())
      );
      transactionHistory.saveHistory(
        connectInfo,
        transactionEvent,
        {
          token0,
          token1,
          token0Amount: preRemoveLiquidity.amount0,
          token1Amount: preRemoveLiquidity.amount1,
          type: "remove",
          to: null
        }
      );
      return transactionEvent;
    };
    liquidityInfo.preAddLiquidity = (inputToken, inputAmount) => {
      if (!isNumber(inputAmount))
        throw new BasicException("Amount Incorrect");
      const outAmount = this.outputTokenAmount(pool, inputToken, inputAmount, Number.parseInt(position.tickLower), Number.parseInt(position.tickUpper));
      if (token0.equals(inputToken)) {
        return {
          amount0: inputAmount,
          amount1: outAmount
        };
      } else {
        return {
          amount0: outAmount,
          amount1: inputAmount
        };
      }
    };
    liquidityInfo.addLiquidity = async (connect, amount0, amount1, allowedSlippage, deadline) => {
      if (!isNumber(amount0) || !isNumber(amount1))
        throw new BasicException("Amount Incorrect");
      const nextPosition = Position.fromAmounts({
        pool,
        tickLower: Number.parseInt(position.tickLower),
        tickUpper: Number.parseInt(position.tickUpper),
        amount0: new BigNumber(amount0).multipliedBy(10 ** token0.decimals).toFixed(),
        amount1: new BigNumber(amount1).multipliedBy(10 ** token1.decimals).toFixed(),
        useFullPrecision: true
        // we want full precision for the theoretical position
      });
      const slippageTolerance = new Percent(BigInt(new BigNumber(allowedSlippage).multipliedBy(1e4).toFixed(0, BigNumber.ROUND_DOWN)), 10000n);
      const deadlineReal = Number.parseInt(String((/* @__PURE__ */ new Date()).getTime() / 1e3)) + Number.parseInt(deadline.toString());
      const transactionEvent = await connect.create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager).addLiquidity(nextPosition, tokenId, false, slippageTolerance, deadlineReal);
      transactionHistory.saveHistory(
        connectInfo,
        transactionEvent,
        {
          token0,
          token1,
          token0Amount: amount0,
          token1Amount: amount1,
          type: "add",
          to: null
        }
      );
      return transactionEvent;
    };
    return liquidityInfo;
  }
  async collectFeeData(tokenId, account) {
    const nonfungiblePositionManager = this.baseApi.connectInfo().create(NonfungiblePositionManager, this.baseApi.address().nonfungiblePositionManager);
    const MAX_UINT128 = 2n ** 128n - 1n;
    const collect = { amount0: "0", amount1: "0" };
    try {
      const collectResult = await nonfungiblePositionManager.contract.collect.staticCall({
        tokenId,
        recipient: account,
        // some tokens might fail if transferred to address(0)
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128
      }, { from: account });
      collect.amount0 = collectResult.amount0;
      collect.amount1 = collectResult.amount1;
    } catch (e) {
      Trace.error("ignore collect error", e);
    }
    return collect;
  }
  async feeTierDistribution(token0, token1) {
    const result = await this.baseApi.exchangeGraph(FeeTierDistributionGQL, {
      token0: token0.erc20Address().toLowerCase(),
      token1: token1.erc20Address().toLowerCase()
    });
    const { asToken0, asToken1, _meta } = result;
    const all = asToken0.concat(asToken1);
    const tvlByFeeTier = all.reduce(
      (acc, value) => {
        acc[value.feeTier][0] = (acc[value.feeTier][0] ?? 0) + Number(value.totalValueLockedToken0);
        acc[value.feeTier][1] = (acc[value.feeTier][1] ?? 0) + Number(value.totalValueLockedToken1);
        return acc;
      },
      {
        [FeeAmount.LOWEST]: [void 0, void 0],
        [FeeAmount.LOW]: [void 0, void 0],
        [FeeAmount.MEDIUM]: [void 0, void 0],
        [FeeAmount.HIGH]: [void 0, void 0]
      }
    );
    const reduce = Object.values(tvlByFeeTier).reduce(
      (acc, value) => {
        const result2 = acc;
        result2[0] += value[0] || 0;
        result2[1] += value[1] || 0;
        return result2;
      },
      [0, 0]
    );
    const [sumToken0Tvl, sumToken1Tvl] = reduce;
    const mean = (tvl0, sumTvl0, tvl1, sumTvl1) => tvl0 === void 0 && tvl1 === void 0 ? void 0 : ((tvl0 ?? 0) + (tvl1 ?? 0)) / (sumTvl0 + sumTvl1) || 0;
    const distributions = {
      [FeeAmount.LOWEST]: mean(
        tvlByFeeTier[FeeAmount.LOWEST][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmount.LOWEST][1],
        sumToken1Tvl
      ),
      [FeeAmount.LOW]: mean(tvlByFeeTier[FeeAmount.LOW][0], sumToken0Tvl, tvlByFeeTier[FeeAmount.LOW][1], sumToken1Tvl),
      [FeeAmount.MEDIUM]: mean(
        tvlByFeeTier[FeeAmount.MEDIUM][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmount.MEDIUM][1],
        sumToken1Tvl
      ),
      [FeeAmount.HIGH]: mean(
        tvlByFeeTier[FeeAmount.HIGH][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmount.HIGH][1],
        sumToken1Tvl
      )
    };
    return distributions;
  }
  async allTickInfo(token0, token1, feeAmount) {
    const pools = await this.getPool([{ token0, token1, feeAmount }]);
    const poolAddress = PoolV3Api.computePoolAddress(token0, token1, feeAmount);
    const pool = pools[0];
    const tickDatas = [];
    let lastTick = TickMath.MIN_TICK - 1;
    while (true) {
      const { ticks } = await this.baseApi.exchangeGraph(AllV3TicksGQL, {
        poolAddress: poolAddress.toLowerCase(),
        lastTick: Number(lastTick),
        pageSize: 1e3
      });
      if (ticks.length === 0)
        break;
      lastTick = ticks[ticks.length - 1].tick;
      tickDatas.push(...ticks);
    }
    const activeTick = pool ? Math.floor(pool.tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount] : void 0;
    const pivot = tickDatas.findIndex(({ tick }) => Number(tick) > activeTick) - 1;
    if (pivot < 0) {
      Trace.error("TickData pivot not found");
      return {
        tickDatas,
        ticksProcessed: []
      };
    }
    const activeTickProcessed = {
      liquidityActive: pool.liquidity,
      tick: activeTick,
      liquidityNet: Number(tickDatas[pivot].tick) === activeTick ? BigInt(tickDatas[pivot].liquidityNet) : 0n,
      price0: tickToPrice(token0, token1, activeTick).toFixed()
    };
    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, tickDatas, pivot, true);
    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, tickDatas, pivot, false);
    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks);
    return {
      tickDatas,
      ticksProcessed
    };
  }
  static computePoolAddress(tokenA, tokenB, fee) {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    const currentAddressInfo = getCurrentAddressInfo();
    const poolInitCodeHash = currentAddressInfo.initCodeHash;
    const agniPoolDeployer = currentAddressInfo.agniPoolDeployer;
    const encodedParams = AbiCoder.defaultAbiCoder().encode(
      ["address", "address", "uint24"],
      [token0.erc20Address(), token1.erc20Address(), fee]
    );
    const salt = solidityPackedKeccak256(["bytes"], [encodedParams]);
    return getCreate2Address(
      agniPoolDeployer,
      salt,
      poolInitCodeHash
    );
  }
  async getPool(datas) {
    const connectInfo = this.baseApi.connectInfo();
    const poolDatas = await connectInfo.multiCall().call(
      ...datas.map((data) => {
        const address = PoolV3Api.computePoolAddress(data.token0, data.token1, data.feeAmount);
        const poolV3 = connectInfo.create(PoolV3, address);
        return {
          address,
          slot0: poolV3.mulContract.slot0(),
          liquidity: poolV3.mulContract.liquidity()
        };
      })
    );
    return poolDatas.map((poolData, index) => {
      const {
        slot0,
        liquidity
      } = poolData;
      if (!slot0 || !liquidity)
        return null;
      const { sqrtPriceX96, tick } = slot0;
      if (!sqrtPriceX96 || sqrtPriceX96 === "0")
        return null;
      return new Pool(datas[index].token0, datas[index].token1, datas[index].feeAmount, sqrtPriceX96, liquidity, tick);
    });
  }
  parsePrice(token0, token1, inputFirstPrice) {
    const baseAmount = CurrencyAmount.fromRawAmount(token0, BigInt(new BigNumber("1").multipliedBy(10 ** token0.decimals).toFixed(0, BigNumber.ROUND_DOWN)));
    const parsedQuoteAmount = CurrencyAmount.fromRawAmount(token1, BigInt(new BigNumber(inputFirstPrice).multipliedBy(10 ** token1.decimals).toFixed(0, BigNumber.ROUND_DOWN)));
    return new Price(
      baseAmount.currency,
      parsedQuoteAmount.currency,
      baseAmount.quotient,
      parsedQuoteAmount.quotient
    );
  }
  // 获取输出币种金额
  outputTokenAmount(pool, inputToken, inputAmount, tickLower, tickUpper) {
    const independentAmount = CurrencyAmount.fromRawAmount(inputToken, BigInt(new BigNumber(inputAmount).multipliedBy(10 ** inputToken.decimals).toFixed(0, BigNumber.ROUND_DOWN)));
    const wrappedIndependentAmount = independentAmount?.wrapped;
    const dependentCurrency = inputToken.equals(pool.token0) ? pool.token1 : pool.token0;
    if (independentAmount && wrappedIndependentAmount && typeof tickLower === "number" && typeof tickUpper === "number" && pool) {
      const position = wrappedIndependentAmount.currency.equals(pool.token0) ? Position.fromAmount0({
        pool,
        tickLower,
        tickUpper,
        amount0: independentAmount.quotient,
        useFullPrecision: true
        // we want full precision for the theoretical position
      }) : Position.fromAmount1({
        pool,
        tickLower,
        tickUpper,
        amount1: independentAmount.quotient
      });
      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(pool.token0) ? position.amount1 : position.amount0;
      return dependentCurrency && CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient).toFixed();
    }
    return "";
  }
  // useV3DerivedInfo
  async addLiquidity(token0, token1, account) {
    const addLiquidityV3Info = new AddLiquidityV3Info();
    addLiquidityV3Info.token0 = token0;
    addLiquidityV3Info.token1 = token1;
    addLiquidityV3Info.feeAmount = FeeAmount.MEDIUM;
    addLiquidityV3Info.token0Amount = "";
    addLiquidityV3Info.token1Amount = "";
    addLiquidityV3Info.firstPrice = "";
    addLiquidityV3Info.first = false;
    addLiquidityV3Info.token0Balance = BalanceAndAllowance.unavailable(token0);
    addLiquidityV3Info.token1Balance = BalanceAndAllowance.unavailable(token1);
    const feeAmounts = [
      FeeAmount.LOWEST,
      FeeAmount.LOW,
      FeeAmount.MEDIUM,
      FeeAmount.HIGH
    ];
    const reset = () => {
      addLiquidityV3Info.token0Amount = "";
      addLiquidityV3Info.token1Amount = "";
      addLiquidityV3Info.tickLower = null;
      addLiquidityV3Info.tickUpper = null;
      addLiquidityV3Info.firstPrice = null;
      addLiquidityV3Info.minPrice = null;
      addLiquidityV3Info.maxPrice = null;
      addLiquidityV3Info.rate = null;
      addLiquidityV3Info.tickData = null;
    };
    if (account) {
      const balanceAndAllowances = await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
        account,
        this.baseApi.address().nonfungiblePositionManager,
        [token0, token1]
      );
      addLiquidityV3Info.token0Balance = balanceAndAllowances[token0.address];
      addLiquidityV3Info.token1Balance = balanceAndAllowances[token1.address];
    }
    const [poolDatas, feeTierDistribution] = await Promise.all([
      this.getPool(
        feeAmounts.map((feeAmount) => {
          return {
            token0,
            token1,
            feeAmount
          };
        })
      ),
      this.feeTierDistribution(token0, token1)
    ]);
    addLiquidityV3Info.poolState = feeAmounts.map((feeAmount, index) => {
      return {
        feeAmount,
        pick: feeTierDistribution[feeAmount] || 0,
        state: poolDatas[index] ? "create" : "no create"
      };
    });
    addLiquidityV3Info.checkFirstPrice = (inputFirstPrice) => {
      if (!addLiquidityV3Info.first || !isNumber(inputFirstPrice))
        return false;
      const price = this.parsePrice(token0, token1, inputFirstPrice);
      Trace.print("price", price.toFixed(), price.invert().toFixed());
      const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);
      return price && sqrtRatioX96 && (BigInt(sqrtRatioX96) >= TickMath.MIN_SQRT_RATIO && BigInt(sqrtRatioX96) < TickMath.MAX_SQRT_RATIO);
    };
    addLiquidityV3Info.updateFirstPrice = async (inputFirstPrice) => {
      if (addLiquidityV3Info.first) {
        if (addLiquidityV3Info.checkFirstPrice(inputFirstPrice)) {
          addLiquidityV3Info.firstPrice = new BigNumber(inputFirstPrice).toFixed(token0.decimals, BigNumber.ROUND_DOWN);
          const currentTick = priceToClosestTick(this.parsePrice(token0, token1, inputFirstPrice));
          const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick);
          addLiquidityV3Info.pool = new Pool(addLiquidityV3Info.token0, addLiquidityV3Info.token1, addLiquidityV3Info.feeAmount, currentSqrt, 0n, currentTick, []);
        }
      }
    };
    addLiquidityV3Info.updateToken0 = (amount) => {
      const tokenAmount = this.outputTokenAmount(addLiquidityV3Info.pool, token0, amount, addLiquidityV3Info.tickLower, addLiquidityV3Info.tickUpper);
      addLiquidityV3Info.token0Amount = amount;
      addLiquidityV3Info.token1Amount = tokenAmount;
      return tokenAmount;
    };
    addLiquidityV3Info.updateToken1 = (amount) => {
      const tokenAmount = this.outputTokenAmount(addLiquidityV3Info.pool, token1, amount, addLiquidityV3Info.tickLower, addLiquidityV3Info.tickUpper);
      addLiquidityV3Info.token1Amount = amount;
      addLiquidityV3Info.token0Amount = tokenAmount;
      return tokenAmount;
    };
    addLiquidityV3Info.updateFeeAmount = (feeAmount) => {
      reset();
      addLiquidityV3Info.feeAmount = feeAmount;
      const pool = poolDatas[feeAmounts.indexOf(feeAmount)];
      if (!pool) {
        addLiquidityV3Info.first = true;
      } else {
        addLiquidityV3Info.first = false;
        addLiquidityV3Info.firstPrice = pool.priceOf(addLiquidityV3Info.token0).toFixed();
        addLiquidityV3Info.pool = pool;
      }
    };
    const updateToken = () => {
      if (isNumber(addLiquidityV3Info.token0Amount) && new BigNumber(addLiquidityV3Info.token0Amount).comparedTo("0") > 0) {
        addLiquidityV3Info.updateToken0(addLiquidityV3Info.token0Amount);
        return;
      }
      if (isNumber(addLiquidityV3Info.token1Amount) && new BigNumber(addLiquidityV3Info.token1Amount).comparedTo("0") > 0)
        addLiquidityV3Info.updateToken1(addLiquidityV3Info.token1Amount);
    };
    addLiquidityV3Info.setPriceRange = (leftRangeTypedValue, rightRangeTypedValue) => {
      const [tokenA, tokenB] = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0];
      const invertPrice = Boolean(!tokenA.equals(token0));
      const lower = invertPrice && typeof rightRangeTypedValue === "boolean" || !invertPrice && typeof leftRangeTypedValue === "boolean" ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[addLiquidityV3Info.feeAmount]) : invertPrice ? tryParseTick(tokenB, tokenA, addLiquidityV3Info.feeAmount, rightRangeTypedValue.toString()) : tryParseTick(tokenA, tokenB, addLiquidityV3Info.feeAmount, leftRangeTypedValue.toString());
      const upper = !invertPrice && typeof rightRangeTypedValue === "boolean" || invertPrice && typeof leftRangeTypedValue === "boolean" ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[addLiquidityV3Info.feeAmount]) : invertPrice ? tryParseTick(tokenB, tokenA, addLiquidityV3Info.feeAmount, leftRangeTypedValue.toString()) : tryParseTick(tokenA, tokenB, addLiquidityV3Info.feeAmount, rightRangeTypedValue.toString());
      addLiquidityV3Info.tickLower = lower;
      addLiquidityV3Info.tickUpper = upper;
      addLiquidityV3Info.minPrice = tickToPriceString(token0, token1, addLiquidityV3Info.feeAmount, invertPrice ? upper : lower);
      addLiquidityV3Info.maxPrice = tickToPriceString(token0, token1, addLiquidityV3Info.feeAmount, invertPrice ? lower : upper);
      if (new BigNumber(addLiquidityV3Info.minPrice).comparedTo(addLiquidityV3Info.firstPrice) > 0)
        addLiquidityV3Info.token1Amount = "0";
      if (addLiquidityV3Info.maxPrice !== "\u221E" && new BigNumber(addLiquidityV3Info.maxPrice).comparedTo(addLiquidityV3Info.firstPrice) < 0)
        addLiquidityV3Info.token0Amount = "0";
      updateToken();
      return {
        minPrice: addLiquidityV3Info.minPrice,
        maxPrice: addLiquidityV3Info.maxPrice
      };
    };
    addLiquidityV3Info.setRate = (rate) => {
      if (addLiquidityV3Info.firstPrice) {
        let minPrice = true;
        let maxPrice = true;
        if (rate !== "full") {
          minPrice = new BigNumber(addLiquidityV3Info.firstPrice).multipliedBy(1 - Number(rate) / 100).toFixed();
          maxPrice = new BigNumber(addLiquidityV3Info.firstPrice).multipliedBy(1 + Number(rate) / 100).toFixed();
        }
        const priceRange = addLiquidityV3Info.setPriceRange(minPrice, maxPrice);
        addLiquidityV3Info.rate = rate;
        return priceRange;
      } else {
        return {
          minPrice: addLiquidityV3Info.minPrice,
          maxPrice: addLiquidityV3Info.maxPrice
        };
      }
    };
    addLiquidityV3Info.addLiquidity = async (connect, allowedSlippage, deadline) => {
      const nonfungiblePositionManager = connect.create(NonfungiblePositionManager);
      if (!addLiquidityV3Info.pool || !addLiquidityV3Info.token0Amount || !addLiquidityV3Info.token1Amount || typeof addLiquidityV3Info.tickLower !== "number" || typeof addLiquidityV3Info.tickUpper !== "number" || addLiquidityV3Info.tickLower >= addLiquidityV3Info.tickUpper)
        throw new Error("invalid input");
      const realToken0Amount = new BigNumber(addLiquidityV3Info.token0Amount).multipliedBy(10 ** addLiquidityV3Info.token0.decimals).toFixed(0, BigNumber.ROUND_DOWN);
      const realToken1Amount = new BigNumber(addLiquidityV3Info.token1Amount).multipliedBy(10 ** addLiquidityV3Info.token1.decimals).toFixed(0, BigNumber.ROUND_DOWN);
      const amount0 = addLiquidityV3Info.pool.tickCurrent <= addLiquidityV3Info.tickUpper ? addLiquidityV3Info.pool.token0.equals(addLiquidityV3Info.token0) ? realToken0Amount : realToken1Amount : 0n;
      const amount1 = addLiquidityV3Info.pool.tickCurrent >= addLiquidityV3Info.tickLower ? addLiquidityV3Info.pool.token0.equals(addLiquidityV3Info.token0) ? realToken1Amount : realToken0Amount : 0n;
      const position = Position.fromAmounts({
        pool: addLiquidityV3Info.pool,
        tickLower: addLiquidityV3Info.tickLower,
        tickUpper: addLiquidityV3Info.tickUpper,
        amount0,
        amount1,
        useFullPrecision: true
      });
      const slippageTolerance = new Percent(BigInt(new BigNumber(allowedSlippage).multipliedBy(1e4).toFixed(0, BigNumber.ROUND_DOWN)), 10000n);
      const deadlineReal = Number.parseInt(String((/* @__PURE__ */ new Date()).getTime() / 1e3)) + Number.parseInt(deadline.toString());
      const transactionEvent = await nonfungiblePositionManager.addLiquidity(position, null, addLiquidityV3Info.first, slippageTolerance, deadlineReal);
      transactionHistory.saveHistory(
        connect,
        transactionEvent,
        {
          token0,
          token1,
          token0Amount: realToken0Amount,
          token1Amount: realToken1Amount,
          type: "add",
          to: null
        }
      );
      return transactionEvent;
    };
    addLiquidityV3Info.updateAllTickInfo = async () => {
      if (addLiquidityV3Info.tickData)
        return addLiquidityV3Info.tickData;
      while (true) {
        const feeAmount = addLiquidityV3Info.feeAmount;
        const result = await this.allTickInfo(token0, token1, feeAmount);
        if (feeAmount === addLiquidityV3Info.feeAmount) {
          addLiquidityV3Info.tickData = result;
          return result;
        }
      }
    };
    addLiquidityV3Info.updateFeeAmount(addLiquidityV3Info.feeAmount);
    if (!addLiquidityV3Info.first)
      addLiquidityV3Info.setRate("50");
    await addLiquidityV3Info.updateAllTickInfo();
    return addLiquidityV3Info;
  }
};
PoolV3Api = __decorateClass$7([
  CacheKey("PoolV3Api")
], PoolV3Api);

function getOutputCurrency(pool, currencyIn) {
  const tokenIn = currencyIn.wrapped;
  const { token0, token1 } = pool;
  return token0.equals(tokenIn) ? token1 : token0;
}

function getPairCombinations(currencyA, currencyB) {
  const currentAddressInfo = getCurrentAddressInfo();
  const [tokenA, tokenB] = [currencyA, currencyB].sort((a, b) => a.sortsBefore(b) ? -1 : 1);
  const bases = currentAddressInfo.getApi().tokenMangerApi().tradeTokens();
  const basePairs = flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]));
  const keySet = /* @__PURE__ */ new Set();
  const result = [];
  [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base) => [tokenA, base]),
    // token B against all bases
    ...bases.map((base) => [tokenB, base]),
    // each base against all bases
    ...basePairs
  ].filter((tokens) => Boolean(tokens[0] && tokens[1])).filter(([t0, t1]) => !eqAddress(t0.erc20Address(), t1.erc20Address())).forEach((it) => {
    const [t0, t1] = it.sort((a, b) => a.sortsBefore(b) ? -1 : 1);
    const key = `${t0.erc20Address()}-${t1.erc20Address()}`;
    if (!keySet.has(key)) {
      keySet.add(key);
      result.push(it);
    }
  });
  return result;
}
function encodeMixedRouteToPath(route, exactOutput) {
  const firstInputToken = route.input.wrapped;
  const { path, types } = route.pools.reduce(
    ({ inputToken, path: path2, types: types2 }, pool, index) => {
      const outputToken = getOutputCurrency(pool, inputToken).wrapped;
      const fee = pool.fee;
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ["address", "uint24", "address"],
          path: [inputToken.address, fee, outputToken.address]
        };
      }
      return {
        inputToken: outputToken,
        types: [...types2, "uint24", "address"],
        path: [...path2, fee, outputToken.address]
      };
    },
    { inputToken: firstInputToken, path: [], types: [] }
  );
  return exactOutput ? ethers.solidityPacked(types.reverse(), path.reverse()) : ethers.solidityPacked(types, path);
}

const DEFAULT_POOL_SELECTOR_CONFIG = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3
};
({
  [ChainId.MANTLE]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4
  },
  [ChainId.MANTLE_TESTNET]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4
  }
});
({
  [ChainId.MANTLE]: {},
  [ChainId.MANTLE_TESTNET]: {}
});
const sortByTvl = (a, b) => a.tvlUSD >= b.tvlUSD ? -1 : 1;
function poolSelectorFactory({
  getPoolSelectorConfig,
  getToken0,
  getToken1,
  getPoolAddress
}) {
  return function tvlSelector(currencyA, currencyB, unorderedPoolsWithTvl) {
    const POOL_SELECTION_CONFIG = getPoolSelectorConfig(currencyA, currencyB);
    if (!currencyA || !currencyB || !unorderedPoolsWithTvl.length)
      return [];
    const poolsFromSubgraph = unorderedPoolsWithTvl.sort(sortByTvl);
    getToken0(poolsFromSubgraph[0]);
    const baseTokens = getCurrentAddressInfo().getApi().tokenMangerApi().tradeTokens();
    const poolSet = /* @__PURE__ */ new Set();
    const addToPoolSet = (pools2) => {
      for (const pool of pools2)
        poolSet.add(getPoolAddress(pool));
    };
    const topByBaseWithTokenIn = baseTokens.map((token) => {
      return poolsFromSubgraph.filter((subgraphPool) => {
        return getToken0(subgraphPool).wrapped.equals(token) && getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(token) && getToken0(subgraphPool).wrapped.equals(currencyA.wrapped);
      }).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken);
    addToPoolSet(topByBaseWithTokenIn);
    const topByBaseWithTokenOut = baseTokens.map((token) => {
      return poolsFromSubgraph.filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress(subgraphPool)))
          return false;
        return getToken0(subgraphPool).wrapped.equals(token) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(token) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
      }).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken);
    addToPoolSet(topByBaseWithTokenOut);
    const top2DirectPools = poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress(subgraphPool)))
        return false;
      return getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNDirectSwaps);
    addToPoolSet(top2DirectPools);
    const nativeToken = getCurrentAddressInfo().getApi().tokenMangerApi().WNATIVE();
    const top2EthBaseTokenPool = nativeToken ? poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress(subgraphPool)))
        return false;
      return getToken0(subgraphPool).wrapped.equals(nativeToken) && getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(nativeToken) && getToken0(subgraphPool).wrapped.equals(currencyA.wrapped);
    }).slice(0, 1) : [];
    addToPoolSet(top2EthBaseTokenPool);
    const top2EthQuoteTokenPool = nativeToken ? poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress(subgraphPool)))
        return false;
      return getToken0(subgraphPool).wrapped.equals(nativeToken) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(nativeToken) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, 1) : [];
    addToPoolSet(top2EthQuoteTokenPool);
    const topByTVL = poolsFromSubgraph.slice(0, POOL_SELECTION_CONFIG.topN).filter((pool) => !poolSet.has(getPoolAddress(pool)));
    addToPoolSet(topByTVL);
    const topByTVLUsingTokenBase = poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress(subgraphPool)))
        return false;
      return getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyA.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNTokenInOut);
    addToPoolSet(topByTVLUsingTokenBase);
    const topByTVLUsingTokenQuote = poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress(subgraphPool)))
        return false;
      return getToken0(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNTokenInOut);
    addToPoolSet(topByTVLUsingTokenQuote);
    const getTopByTVLUsingTokenSecondHops = (base, tokenToCompare) => base.map((subgraphPool) => {
      return getToken0(subgraphPool).wrapped.equals(tokenToCompare.wrapped) ? getToken1(subgraphPool) : getToken0(subgraphPool);
    }).map((secondHopToken) => {
      return poolsFromSubgraph.filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress(subgraphPool)))
          return false;
        return getToken0(subgraphPool).wrapped.equals(secondHopToken.wrapped) || getToken1(subgraphPool).wrapped.equals(secondHopToken.wrapped);
      }).slice(0, POOL_SELECTION_CONFIG.topNSecondHop);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNSecondHop);
    const topByTVLUsingTokenInSecondHops = getTopByTVLUsingTokenSecondHops(
      [...topByTVLUsingTokenBase, ...topByBaseWithTokenIn],
      currencyA
    );
    addToPoolSet(topByTVLUsingTokenInSecondHops);
    const topByTVLUsingTokenOutSecondHops = getTopByTVLUsingTokenSecondHops(
      [...topByTVLUsingTokenQuote, ...topByBaseWithTokenOut],
      currencyB
    );
    addToPoolSet(topByTVLUsingTokenOutSecondHops);
    const pools = [
      ...topByBaseWithTokenIn,
      ...topByBaseWithTokenOut,
      ...top2DirectPools,
      ...top2EthBaseTokenPool,
      ...top2EthQuoteTokenPool,
      ...topByTVL,
      ...topByTVLUsingTokenBase,
      ...topByTVLUsingTokenQuote,
      ...topByTVLUsingTokenInSecondHops,
      ...topByTVLUsingTokenOutSecondHops
    ];
    return pools.map(({ tvlUSD, ...rest }) => rest);
  };
}
const v3PoolTvlSelector = poolSelectorFactory({
  getPoolSelectorConfig: (currencyA, currencyB) => DEFAULT_POOL_SELECTOR_CONFIG,
  getToken0: (p) => p.token0,
  getToken1: (p) => p.token1,
  getPoolAddress: (p) => p.address
});

const SwapQueryV3Pools = gql`
    query getPools($pageSize: Int!, $poolAddrs: [String]) {
        pools(first: $pageSize, where: { id_in: $poolAddrs }) {
            id
            tick
            sqrtPrice
            feeTier
            liquidity
            feeProtocol
            totalValueLockedUSD
        }
    }
`;

var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$6(target, key, result);
  return result;
};
let SwapV3Api = class {
  constructor() {
    this.baseApi = BASE_API;
  }
  getPoolMetaData(tokenA, tokenB) {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((it) => {
      const address = PoolV3Api.computePoolAddress(token0, token1, it);
      return {
        address,
        token0,
        token1,
        fee: it
      };
    });
  }
  async getCandidatePoolsOnGraphNode(tokenA, tokenB, mataData) {
    const metaDataGroup = groupBy(mataData, (it) => it.address.toLowerCase());
    const swapQueryV3PoolsResult = await this.baseApi.exchangeGraph(SwapQueryV3Pools, {
      pageSize: 1e3,
      poolAddrs: mataData.map((it) => it.address.toLowerCase())
    });
    const pools = swapQueryV3PoolsResult.pools.map((it) => {
      const metaDataGroupElement = metaDataGroup[it.id];
      if (!metaDataGroupElement && metaDataGroupElement.length === 0)
        return null;
      const metaData = metaDataGroupElement[0];
      const { fee, token0, token1, address } = metaData;
      const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(it.feeProtocol);
      return {
        fee,
        token0,
        token1,
        liquidity: BigInt(it.liquidity),
        sqrtRatioX96: BigInt(it.sqrtPrice),
        tick: Number(it.tick),
        address,
        tvlUSD: BigInt(Number.parseInt(it.totalValueLockedUSD)),
        token0ProtocolFee,
        token1ProtocolFee,
        ticks: null
      };
    }).filter((it) => it !== null);
    return v3PoolTvlSelector(tokenA, tokenB, pools);
  }
  async getCandidatePoolsByToken(tokenA, tokenB) {
    const poolMetaData = getPairCombinations(tokenA, tokenB).flatMap((it) => this.getPoolMetaData(it[0], it[1]));
    return this.getCandidatePoolsOnGraphNode(tokenA, tokenB, poolMetaData);
  }
  async getCandidatePoolsByPair(tokenA, tokenB) {
    const poolMetaData = this.getPoolMetaData(tokenA, tokenB);
    return this.getCandidatePoolsOnGraphNode(tokenA, tokenB, poolMetaData);
  }
  test() {
    const gasMultiCallContract = this.baseApi.connectInfo().create(GasMultiCallContract);
    const quoterV2 = this.baseApi.connectInfo().create(IQuoterV2Abi);
    const getRouteWithQuotes = async (routes, gasModel, isExactIn) => {
      const funcName = isExactIn ? "quoteExactInput" : "quoteExactOutput";
      const callInputs = routes.map((route) => {
        const path = encodeMixedRouteToPath(route, !isExactIn);
        return {
          target: this.baseApi.address().quoterV2,
          callData: quoterV2.contract.interface.encodeFunctionData(funcName, [path, route.amount.quotient.toString()]),
          gasLimit: QUOTER_TRADE_GAS
        };
      });
      const gasCallResponses = await gasMultiCallContract.multicall(callInputs);
      const routesWithQuote = [];
      for (let i = 0; i < gasCallResponses.length; i++) {
        const gasCallResponse = gasCallResponses[i];
        if (!gasCallResponse.success) {
          continue;
        }
      }
      gasCallResponses.forEach((it) => {
        if (it.success) ;
      });
      return routesWithQuote;
    };
    return {
      getRouteWithQuotesExactIn: async (routes, options) => getRouteWithQuotes(routes, options.gasModel, true),
      getRouteWithQuotesExactOut: async (routes, options) => getRouteWithQuotes(routes, options.gasModel, false)
    };
  }
};
SwapV3Api = __decorateClass$6([
  CacheKey("SwapV3Api")
], SwapV3Api);

var tokens = [
	{
		chainId: 5000,
		address: "MNT",
		symbol: "MNT",
		name: "MNT",
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/11221.png"
	},
	{
		chainId: 5001,
		address: "MNT",
		symbol: "MNT",
		name: "MNT",
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/11221.png"
	},
	{
		chainId: 5001,
		address: "0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A",
		symbol: "WMNT",
		name: "Wrapped MNT",
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/11221.png"
	},
	{
		chainId: 5000,
		address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
		symbol: "WMNT",
		name: "Wrapped MNT",
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/11221.png"
	},
	{
		chainId: 5001,
		address: "0x3e163f861826c3f7878bd8fa8117a179d80731ab",
		symbol: "USDT",
		name: "USDT",
		decimals: 6,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
	},
	{
		chainId: 5001,
		address: "0x82a2eb46a64e4908bbc403854bc8aa699bf058e9",
		symbol: "USDC",
		name: "USDC",
		decimals: 6,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
	},
	{
		chainId: 5001,
		address: "0x74a0e7118480bdff5f812c7a879a41db09ac2c39",
		symbol: "MAMA",
		name: "MAMA",
		decimals: 18,
		logoURI: "https://apex.mypinata.cloud/ipfs/QmSXMbsfA3G2CcDv5RHnqukGrMrRJYvtJY98UF55tp1qQL"
	},
	{
		chainId: 5001,
		address: "0xd0c049ee0b0832e5678d837c1519e1b2380e32e4",
		symbol: "DOGE",
		name: "DOGE",
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png"
	},
	{
		chainId: 5000,
		address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
		symbol: "USDC",
		name: "USDC",
		decimals: 6,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
	},
	{
		chainId: 5000,
		address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
		symbol: "USDT",
		name: "USDT",
		decimals: 6,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
	},
	{
		chainId: 5000,
		address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
		symbol: "WETH",
		name: "WETH",
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
	}
];

const tokens$1 = /*@__PURE__*/getDefaultExportFromCjs(tokens);

var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$5(target, key, result);
  return result;
};
let TokenMangerApi = class {
  constructor() {
    this.defaultTokenListUrl = "https://raw.githubusercontent.com/magma-protocol/tokenList/main/magma.json";
    this.baseApi = BASE_API;
  }
  async batchGetTokens(addresses) {
    const tokenAddressMap = groupBy(await this.getTokenByTokenList(), (it) => it.address);
    const tokens2 = await this.getTokenByContract(addresses);
    const tokenMap = {};
    addresses.forEach((it, index) => {
      const tokenListToken = tokenAddressMap[it.toLowerCase()] || [];
      tokenMap[it] = tokenListToken.length > 0 ? tokenListToken[0] : tokens2[index];
    });
    return tokenMap;
  }
  async tokenPrice(...tokens2) {
    const addresses = tokens2.map((it) => it.erc20Address().toLowerCase());
    const {
      bundles,
      tokens: tokenPrices
    } = await this.baseApi.exchangeGraph(TokenPriceGQL, { addresses });
    const _groupBy = groupBy(tokenPrices, (it) => it.id.toLowerCase());
    return tokens2.map((token) => {
      const mntPrice = get(bundles, "0.ethPriceUSD", "0");
      const groupByElementElement = _groupBy[token.erc20Address().toLowerCase()][0];
      if (groupByElementElement) {
        const price = groupByElementElement.derivedETH;
        const priceUSD = new BigNumber(price).times(mntPrice).toFixed();
        const priceMNT = new BigNumber(price).toFixed();
        return new TokenPrice(token, priceUSD, priceMNT);
      } else {
        return new TokenPrice(token, "0", "0");
      }
    });
  }
  async tokenList(url = "") {
    if (url === "") {
      const storageTokenListInfos = this.storageTokenListUrls();
      const tokenListInfos = [];
      for (const info of storageTokenListInfos) {
        const urls = this.uriToHttp(info.url);
        try {
          const tokenList = await this.searchTokenList(urls);
          const tokenListInfo = this.mapToTokenList(info, tokenList, true);
          tokenListInfos.push(tokenListInfo);
        } catch (e) {
          Trace.debug("showList error ignore", e);
        }
      }
      return tokenListInfos;
    } else {
      const urls = this.uriToHttp(url);
      if (urls.length === 0)
        throw new BasicException(`Unrecognized list URL protocol.`);
      const storageTokenListInfos = this.storageTokenListUrls();
      const tokenList = await this.searchTokenList(urls);
      const storageTokenListInfo = storageTokenListInfos.find((it) => it.url === url);
      return [
        this.mapToTokenList({
          url,
          enable: get(storageTokenListInfo, "enable", false)
        }, tokenList, !!storageTokenListInfo)
      ];
    }
  }
  async tokenSelectList(account, searchStr = "") {
    const search = searchStr.toLowerCase();
    let storageToken = this.storageToken();
    if (search !== "") {
      storageToken = storageToken.filter((it) => {
        return it.address.toLowerCase().includes(search) || it.symbol.toLowerCase().includes(search) || it.name.toLowerCase().includes(search);
      });
    }
    let balance = {};
    if (account !== "") {
      balance = await this.baseApi.address().readonlyConnectInfo().erc20().batchGetBalance(
        account,
        storageToken.map((it) => it.address)
      );
    }
    const mapToTokenManager = (token, tokenBalances) => {
      const tokenSelectInfo = new TokenSelectInfo();
      tokenSelectInfo.token = token;
      tokenSelectInfo.balance = tokenBalances[token.address]?.amount ?? "0";
      return tokenSelectInfo;
    };
    if (search === "") {
      return {
        searchTokens: [],
        customTokens: storageToken.map((it) => mapToTokenManager(it, balance))
      };
    } else {
      const tokenManager = await this.tokenManager(searchStr);
      return {
        searchTokens: tokenManager.searchTokens,
        customTokens: storageToken.map((it) => mapToTokenManager(it, balance))
      };
    }
  }
  async getTokenByTokenList() {
    try {
      return Array.from(await this.tokenList()).flatMap((it) => it.tokenList.tokens.map((it2) => Token.fromSerialized(it2))).filter((it) => it.chainId === this.baseApi.address().chainId);
    } catch (e) {
      Trace.error("getTokenByTokenList error ignore", e);
      return [];
    }
  }
  async getTokenByContract(addresses) {
    try {
      const addressInfo = this.baseApi.address();
      const tokenInfos = await addressInfo.readonlyConnectInfo().erc20().batchGetTokenInfo(...addresses);
      return tokenInfos.filter((it) => !isNullOrBlank(it.name) && !isNullOrBlank(it.symbol) && it.decimals > 0).map((it) => {
        return new Token(addressInfo.chainId, it.address, it.decimals, it.symbol, it.name, `https://agni.finance/static/${it.symbol}.png`);
      });
    } catch (e) {
      Trace.error("getTokenByContract error ignore", e);
      return [];
    }
  }
  async tokenManager(searchStr = "") {
    const search = searchStr.toLowerCase();
    const storageToken = this.storageToken();
    const mapToTokenManager = (token) => {
      const tokenManagerInfo = new TokenManagerInfo();
      tokenManagerInfo.token = token;
      tokenManagerInfo.remove = () => {
        this.storageTokenRemove(tokenManagerInfo.token);
      };
      return tokenManagerInfo;
    };
    if (search === "") {
      return {
        searchTokens: [],
        customTokens: storageToken.map((it) => mapToTokenManager(it))
      };
    } else {
      const searchTokens = [];
      const tokensByTokenList = Array.from(await this.getTokenByTokenList()).filter((it) => {
        return it.address.toLowerCase().includes(search) || it.symbol.toLowerCase().includes(search) || it.name.toLowerCase().includes(search);
      }).map((it) => this.mapToTokenAdd(it, storageToken));
      searchTokens.push(...tokensByTokenList);
      if (isAddress(search)) {
        const searchRpcTokens = (await this.getTokenByContract([search])).map((it) => this.mapToTokenAdd(it, storageToken));
        searchTokens.push(...searchRpcTokens);
      }
      const searchResult = [];
      const searchTokensSet = /* @__PURE__ */ new Set();
      for (const searchToken of searchTokens) {
        if (searchTokensSet.has(searchToken.token.address)) {
          searchResult.push(searchToken);
          searchTokensSet.add(searchToken.token.address);
        }
      }
      return {
        searchTokens: searchResult,
        customTokens: storageToken.filter((it) => {
          return it.address.toLowerCase().includes(search) || it.symbol.toLowerCase().includes(search) || it.name.toLowerCase().includes(search);
        }).map((it) => mapToTokenManager(it))
      };
    }
  }
  systemTokens() {
    return tokens$1.filter((t) => t.chainId === this.baseApi.address().chainId).map((it) => {
      return new Token(this.baseApi.address().chainId, it.address, it.decimals, it.symbol, it.name, it.logoURI);
    });
  }
  tradeTokens() {
    const addressInfo = this.baseApi.address();
    const systemTokens = this.systemTokens();
    return systemTokens.filter((it) => addressInfo.baseTradeToken.find((add) => eqAddress(it.address, add)));
  }
  WNATIVE() {
    const addressInfo = this.baseApi.address();
    const systemTokens = this.systemTokens();
    return systemTokens.find((it) => eqAddress(it.address, addressInfo.WMNT));
  }
  NATIVE() {
    const systemTokens = this.systemTokens();
    return systemTokens.find((it) => eqAddress(it.address, ETH_ADDRESS));
  }
  async searchTokenList(urls) {
    for (let i = 0; i < urls.length; i++) {
      const isLast = i === urls.length - 1;
      let json;
      try {
        json = await this.baseApi.request(urls[i], "get", {}, {});
      } catch (e) {
        if (isLast)
          throw new Error(`Failed to download list ${urls[i]}`);
        continue;
      }
      if (json.tokens) {
        remove(json.tokens, (token) => {
          return token.symbol ? token.symbol.length === 0 : true;
        });
      }
      const tokenListValidator = new Ajv({ allErrors: true }).compile(AgniTokenListSchema);
      if (!tokenListValidator(json)) {
        const validationErrors = tokenListValidator.errors?.reduce((memo, error) => {
          const add = `${error.dataPath} ${error.message ?? ""}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, "") ?? "unknown error";
        if (isLast)
          throw new Error(`Token list failed validation: ${validationErrors}`);
        continue;
      }
      return json;
    }
    throw new Error("Unrecognized list URL protocol.");
  }
  mapToTokenAdd(token, storageToken) {
    const tokenManagerAddInfo = new TokenManagerAddInfo();
    tokenManagerAddInfo.active = !!storageToken.find((it) => eqAddress(it.address, token.address));
    tokenManagerAddInfo.token = token;
    tokenManagerAddInfo.import = () => {
      tokenManagerAddInfo.active = true;
      this.storageTokenAdd(tokenManagerAddInfo.token);
    };
    return tokenManagerAddInfo;
  }
  mapToTokenList(info, tokenList, showRemove) {
    const tokenListInfo = new TokenListInfo();
    tokenListInfo.storageTokenListInfo = info;
    tokenListInfo.tokenList = tokenList;
    tokenListInfo.showRemove = showRemove;
    tokenListInfo.remove = () => {
      this.storageTokenListUrlsRemove(tokenListInfo.storageTokenListInfo);
    };
    tokenListInfo.updateEnable = (bool) => {
      tokenListInfo.storageTokenListInfo.enable = bool;
      this.storageTokenListUrlsUpdate(tokenListInfo.storageTokenListInfo);
    };
    return tokenListInfo;
  }
  storageToken() {
    let tokens2 = this.baseApi.address().storage.getArray(STORAGE_KEY_TOKENS);
    if (!tokens2) {
      tokens2 = this.systemTokens();
      this.baseApi.address().storage.setJson(STORAGE_KEY_TOKENS, tokens2);
    }
    return tokens2;
  }
  storageTokenAdd(token) {
    const tokens2 = this.storageToken();
    if (tokens2.find((it) => eqAddress(it.address, token.address)))
      return;
    tokens2.push(token);
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKENS, tokens2);
  }
  storageTokenRemove(token) {
    const tokens2 = this.storageToken().filter((it) => !eqAddress(it.address, token.address));
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKENS, tokens2);
  }
  storageTokenListUrls() {
    let storageTokenListInfos = this.baseApi.address().storage.getArray(STORAGE_KEY_TOKEN_LIST);
    if (!storageTokenListInfos) {
      storageTokenListInfos = [{
        url: this.defaultTokenListUrl,
        enable: true
      }];
      this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
    }
    return storageTokenListInfos;
  }
  storageTokenListUrlsAdd(storageTokenListInfo) {
    const storageTokenListInfos = this.storageTokenListUrls();
    if (storageTokenListInfos.find((it) => it.url === storageTokenListInfo.url))
      return;
    storageTokenListInfos.push(storageTokenListInfo);
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
  }
  storageTokenListUrlsUpdate(storageTokenListInfo) {
    const storageTokenListInfos = this.storageTokenListUrls();
    const find = storageTokenListInfos.find((it) => it.url === storageTokenListInfo.url);
    if (!find) {
      this.storageTokenListUrlsAdd(storageTokenListInfo);
    } else {
      find.enable = storageTokenListInfo.enable;
      this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, storageTokenListInfos);
    }
  }
  storageTokenListUrlsRemove(storageTokenListInfo) {
    const strings = this.storageTokenListUrls().filter((it) => it.url !== storageTokenListInfo.url);
    this.baseApi.address().storage.setJson(STORAGE_KEY_TOKEN_LIST, strings);
  }
  uriToHttp(uri) {
    const protocol = uri.split(":")[0].toLowerCase();
    switch (protocol) {
      case "https":
        return [uri];
      case "http":
        return [`https${uri.substring(4)}`, uri];
      case "ipfs": {
        const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
        return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
      }
      case "ipns": {
        const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
        return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
      }
      default:
        return [];
    }
  }
};
TokenMangerApi = __decorateClass$5([
  CacheKey("TokenMangerApi")
], TokenMangerApi);

var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$4(target, key, result);
  return result;
};
const PriceCache = /* @__PURE__ */ new Map();
const TokenLogoCache = /* @__PURE__ */ new Map();
let LaunchpadApi = class {
  constructor() {
    this.baseApi = BASE_API;
  }
  async getUserStakeInfoByGql(user, token) {
    const res = await this.baseApi.launchpadGraph(
      UserStakeInfosGQL,
      {
        user: user.toLowerCase(),
        token: token.toLowerCase()
      }
    );
    return res.stakeInfos;
  }
  async staking(account = "") {
    const userAddress = account || INVALID_ADDRESS;
    const tokenAddress = this.baseApi.address().launchpadStakeToken;
    const launchpadStakePoolAddress = this.baseApi.address().launchpadStakePool;
    const stakingPoolAbi = this.baseApi.connectInfo().create(StakingPoolAbi);
    const [
      stakeInfos,
      batchGetTokens,
      [
        {
          getScoreByTier,
          getUserScore
        }
      ]
    ] = await Promise.all([
      this.getUserStakeInfoByGql(userAddress, tokenAddress),
      this.baseApi.address().getApi().tokenMangerApi().batchGetTokens([tokenAddress]),
      this.baseApi.connectInfo().multiCall().call(
        {
          getScoreByTier: stakingPoolAbi.mulContract.getScoreByTier("1"),
          getUserScore: stakingPoolAbi.mulContract.getUserScore(userAddress)
        }
      )
    ]);
    const stakeTokenInfo = batchGetTokens[tokenAddress];
    const { [stakeTokenInfo.address]: balanceAndAllowances } = await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
      userAddress,
      launchpadStakePoolAddress,
      [stakeTokenInfo]
    );
    const unixDate = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    const stakeDetail = new LaunchpadStakeDetail();
    stakeDetail.token = stakeTokenInfo;
    stakeDetail.balance = balanceAndAllowances;
    stakeDetail.minInputAmount = BigNumber.max(new BigNumber(getScoreByTier).minus(getUserScore).dividedBy(1e8), new BigNumber(1).div(1e8)).toFixed();
    const unStakeInfo = stakeInfos.filter((it) => new BigNumber(it.unlockTime).comparedTo(unixDate) <= 0);
    const lockStakeInfo = stakeInfos.filter((it) => new BigNumber(it.unlockTime).comparedTo(unixDate) > 0);
    stakeDetail.unStakeAmount = unStakeInfo.map((it) => new BigNumber(it.tokenIdOrAmount).div(10 ** stakeTokenInfo.decimals).toFixed()).reduce((pre, cur) => new BigNumber(pre).plus(cur).toFixed(), "0");
    stakeDetail.lockAmount = lockStakeInfo.map((it) => new BigNumber(it.tokenIdOrAmount).div(10 ** stakeTokenInfo.decimals).toFixed()).reduce((pre, cur) => new BigNumber(pre).plus(cur).toFixed(), "0");
    stakeDetail.stake = async (connect, amount) => {
      const realAmount = new BigNumber(amount).multipliedBy(10 ** stakeDetail.token.decimals).toFixed(0, BigNumber.ROUND_DOWN);
      return connect.create(StakingPoolAbi).stake(stakeDetail.token.address, realAmount);
    };
    stakeDetail.unStake = async (connect) => {
      const ids = unStakeInfo.map((it) => it.id).slice(0, 10);
      if (ids.length === 0)
        throw new BasicException("No unstake tokenAddress");
      return connect.create(StakingPoolAbi).unstake(ids);
    };
    return stakeDetail;
  }
  async getTokenPriceHistory(token) {
    const priceCache = PriceCache.get(token.toLowerCase());
    if (priceCache && Date.now() - priceCache.time < 1e3 * 60 * 5)
      return priceCache.price;
    const { tokenDayDatas } = await this.baseApi.exchangeGraph(
      QueryTokenATHPriceHistory,
      {
        token: token.toLowerCase()
      }
    );
    const tokenPrice = {
      ath: "0",
      last: "0"
    };
    tokenPrice.ath = tokenDayDatas.map((it) => it.high).reduce((a, b) => new BigNumber(a).gt(b) ? a : b, "0");
    tokenPrice.last = get(tokenDayDatas, "[0].priceUSD", "0");
    PriceCache.set(token.toLowerCase(), {
      time: Date.now(),
      price: tokenPrice
    });
    return tokenPrice;
  }
  async fetchPools() {
    const { lauchpad_infos: lauchpadInfos } = await this.baseApi.request(
      `${this.baseApi.address().baseApiUrl}/lauchpad/api/listalllauchpad?page=0&size=1000`,
      "get",
      {}
    );
    lauchpadInfos.forEach((it) => {
      if (it.raising_token && it.raising_token_icon)
        TokenLogoCache.set(it.raising_token.toLowerCase(), it.raising_token_icon);
      if (it.selling_token && it.selling_token_icon)
        TokenLogoCache.set(it.selling_token.toLowerCase(), it.selling_token_icon);
    });
    return lauchpadInfos;
  }
  async getTokenPrice(address) {
    return (await this.getTokenPriceHistory(address)).last;
  }
  async getAllTimeHighPrice(address) {
    return (await this.getTokenPriceHistory(address)).ath;
  }
  async getPools() {
    const [res, launchpadInfos] = await Promise.all([
      this.baseApi.launchpadGraph(QueryIdoPoolInfosGQL, {}),
      this.fetchPools()
    ]);
    const allProject = res.idoPools.map((item) => {
      const idoPool = new IDOPool();
      idoPool.id = item.id;
      idoPool.raisingTokenPrice = "0";
      idoPool.sellingTokenATHPrice = "0";
      idoPool.raisingTokenATHPrice = "0";
      idoPool.raisingAmount = new BigNumber(item.totalRaised).plus(item.totalExtraDeposit).toFixed();
      idoPool.expectedRaisingAmount = "0";
      idoPool.publicSalePrice = item.publicSalePrice;
      idoPool.presalePrice = item.presalePrice;
      idoPool.raisingTokenInfo = item.raisingTokenInfo;
      idoPool.sellingTokenInfo = item.sellingTokenInfo;
      idoPool.raisingTokenLogo = TokenLogoCache.get(idoPool.raisingTokenInfo.id.toLowerCase());
      idoPool.sellingTokenLogo = TokenLogoCache.get(idoPool.sellingTokenInfo.id.toLowerCase());
      idoPool.roi = "0";
      idoPool.presaleAndEnrollStartTime = Number.parseInt(item.presaleAndEnrollStartTime, 10);
      idoPool.soldOut = Number.parseInt(item.claimStartTime, 10) * 1e3 < Date.now();
      return idoPool;
    });
    const idoPoolStatistics = new IdoPoolStatistic();
    idoPoolStatistics.fundedProjects = new BigNumber(allProject.length).toFixed();
    idoPoolStatistics.totalParticipants = get(res, "idoPoolStatistics.totalParticipants", "0");
    idoPoolStatistics.raisedCapital = "0";
    await Promise.all(
      Array.from(/* @__PURE__ */ new Set([...allProject.map((p) => p.raisingTokenInfo.id), ...allProject.map((p) => p.raisingTokenInfo.id)])).map((it) => this.getTokenPrice(it))
    );
    const tokenPrices = await Promise.all(allProject.map((it) => this.getTokenPrice(it.raisingTokenInfo.id)));
    const athTokenPrices = await Promise.all(allProject.map((it) => this.getAllTimeHighPrice(it.sellingTokenInfo.id)));
    const athRaisingTokenPrices = await Promise.all(allProject.map((it) => this.getAllTimeHighPrice(it.raisingTokenInfo.id)));
    for (let i = 0; i < allProject.length; i++) {
      const it = allProject[i];
      const price = tokenPrices[i];
      const athPrice = athTokenPrices[i];
      const athRaisingTokenPrice = athRaisingTokenPrices[i];
      it.raisingTokenPrice = price;
      it.sellingTokenATHPrice = athPrice;
      it.raisingTokenATHPrice = athRaisingTokenPrice;
      const idoPrice = BigNumber.min(it.publicSalePrice, it.presalePrice).multipliedBy(it.raisingTokenPrice);
      if (idoPrice.comparedTo(0) === 0)
        it.roi = "0";
      else
        it.roi = new BigNumber(athPrice).div(idoPrice).toFixed(2, BigNumber.ROUND_DOWN);
      if (it.presaleAndEnrollStartTime < Date.now() / 1e3) {
        idoPoolStatistics.raisedCapital = new BigNumber(idoPoolStatistics.raisedCapital).plus(new BigNumber(it.raisingAmount).multipliedBy(new BigNumber(it.raisingTokenATHPrice))).toFixed();
      } else {
        const launchpadInfo = launchpadInfos.find((info) => info.selling_token.toLowerCase() === it.sellingTokenInfo.id.toLowerCase());
        if (launchpadInfo)
          it.expectedRaisingAmount = launchpadInfo.total_raise;
      }
    }
    const poolInfo = {
      idoPoolStatistics,
      allProject,
      upcomingProjects: Array.from(allProject).filter((it) => it.presaleAndEnrollStartTime > Date.now() / 1e3),
      comingProjects: Array.from(allProject).filter((it) => it.presaleAndEnrollStartTime < Date.now() / 1e3).sort((a, b) => {
        const comparedTo = new BigNumber(a.soldOut ? 1 : 0).comparedTo(new BigNumber(b.soldOut ? 1 : 0));
        if (comparedTo !== 0)
          return comparedTo;
        return b.presaleAndEnrollStartTime - a.presaleAndEnrollStartTime;
      })
    };
    Trace.debug("poolInfo", poolInfo);
    return poolInfo;
  }
  async getUserDepositedLogsByPool(user, pool) {
    const res = await this.baseApi.launchpadGraph(
      QueryIDOUserDepositedLogsByPool,
      {
        user: user.toLowerCase(),
        pool: pool.toLowerCase()
      }
    );
    const userDepositInfo = new IDOUserDepositInfo();
    userDepositInfo.refund = res.idoPoolClaimedLogs.map((it) => it.refund).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.extraDeposit = res.idoPoolPublicSaleDepositedLogs.map((it) => it.extraDeposit).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.presaleQuote = res.idoPoolPresaleDepositedLogs.map((it) => it.buyQuota).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.presaleBuyInsurance = res.idoPoolPresaleDepositedLogs.map((it) => it.buyInsurance)[0] || false;
    userDepositInfo.publicSaleQuota = res.idoPoolPublicSaleDepositedLogs.map((it) => it.buyQuota).reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
    userDepositInfo.publicSaleBuyInsurance = res.idoPoolPublicSaleDepositedLogs.map((it) => it.buyInsurance)[0] || false;
    return userDepositInfo;
  }
  async getPoolInfoByGql(id) {
    const [res, launchpadInfos] = await Promise.all([
      this.baseApi.launchpadGraph(QueryIDOPoolInfo, {
        id
      }),
      this.fetchPools()
    ]);
    const poolInfo = res.idoPool;
    poolInfo.raisingTokenLogo = TokenLogoCache.get(poolInfo.raisingTokenInfo.id.toLowerCase());
    poolInfo.sellingTokenLogo = TokenLogoCache.get(poolInfo.sellingTokenInfo.id.toLowerCase());
    const launchpadInfo = launchpadInfos.find((info) => info.selling_token.toLowerCase() === poolInfo.sellingTokenInfo.id.toLowerCase());
    return {
      poolInfo,
      launchpadInfo
    };
  }
  async poolDetail(pool, account = "") {
    const userAddress = account || INVALID_ADDRESS;
    const [{
      poolInfo,
      launchpadInfo
    }, userDepositInfo] = await Promise.all([
      this.getPoolInfoByGql(pool.toLowerCase()),
      this.getUserDepositedLogsByPool(userAddress.toLowerCase(), pool.toLowerCase())
    ]);
    const insurancePool = this.baseApi.connectInfo().create(InsurancePoolAbi);
    const idoPool = this.baseApi.connectInfo().create(IdoPoolAbi, pool);
    const stakingPool = this.baseApi.connectInfo().create(StakingPoolAbi);
    const multiCall = this.baseApi.connectInfo().multiCall();
    const tokenIns = this.baseApi.connectInfo().create(ERC20, poolInfo.sellingTokenInfo.id);
    const [
      insurancePoolData,
      idoPoolData,
      { getCurrentBlockTimestamp },
      { getUserTier },
      { totalSupply }
    ] = await multiCall.call({
      isRegisteredPool: insurancePool.mulContract.isRegisteredPool(pool),
      getIdoPoolInfo: insurancePool.mulContract.getIdoPoolInfo(pool)
    }, {
      getUserIDO: idoPool.mulContract.getUserIDO(pool),
      totalRaised: idoPool.mulContract.totalRaised(),
      getPresaleQuota: idoPool.mulContract.getPresaleQuota(userAddress),
      totalBuyedByUsers: idoPool.mulContract.totalBuyedByUsers(),
      totalSupply: idoPool.mulContract.totalSupply(),
      insuranceFeeRate: idoPool.mulContract.insuranceFeeRate(),
      getPublicSaleQuota: idoPool.mulContract.getPublicSaleQuota(userAddress),
      isEnrolled: idoPool.mulContract.isEnrolled(userAddress),
      presaleDeposited: idoPool.mulContract.presaleDeposited(userAddress),
      publicSaleDeposited: idoPool.mulContract.publicSaleDeposited(userAddress),
      totalExtraDeposit: idoPool.mulContract.totalExtraDeposit(),
      claimable: idoPool.mulContract.claimable(userAddress),
      refundable: idoPool.mulContract.refundable(userAddress)
    }, {
      getCurrentBlockTimestamp: multiCall.mulContract.getCurrentBlockTimestamp()
    }, {
      getUserTier: stakingPool.mulContract.getUserTier(userAddress)
    }, {
      totalSupply: tokenIns.mulContract.totalSupply()
    });
    const unixTime = Number.parseInt(getCurrentBlockTimestamp);
    const depositInfo = new IDODepositInfo();
    const raisingTokenDiv = 10 ** Number.parseInt(poolInfo.raisingTokenInfo.decimals, 10);
    const sellingTokenDiv = 10 ** Number.parseInt(poolInfo.sellingTokenInfo.decimals, 10);
    const { [poolInfo.raisingTokenInfo.id]: token } = await this.baseApi.address().getApi().tokenMangerApi().batchGetTokens([poolInfo.raisingTokenInfo.id]);
    depositInfo.raisingBalance = (await this.baseApi.connectInfo().erc20().batchGetBalanceAndAllowance(
      userAddress,
      pool,
      [token]
    ))[token.address];
    depositInfo.whiteList = {
      type: "whiteList",
      canDeposit: Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) <= unixTime && Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) >= unixTime && !idoPoolData.presaleDeposited,
      // 是否质押
      deposited: idoPoolData.presaleDeposited,
      // 白名单可用额度
      quota: new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).toFixed(),
      raising: new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed(),
      price: poolInfo.presalePrice,
      depositAmount: new BigNumber(userDepositInfo.presaleQuote).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed(),
      maxDepositAmount: new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed(),
      insurance: userDepositInfo.presaleBuyInsurance,
      countdownEndTime: 0,
      depositStatus: "disabled",
      payCompensation: "0",
      payCompensationState: "hidden",
      payCompensationDate: 0,
      insuranceId: ""
    };
    depositInfo.publicSale = {
      type: "publicSale",
      canDeposit: Number.parseInt(poolInfo.publicSaleDepositStartTime, 10) <= unixTime && Number.parseInt(poolInfo.publicSaleDepositEndTime, 10) >= unixTime && !idoPoolData.publicSaleDeposited,
      deposited: idoPoolData.publicSaleDeposited,
      quota: new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).toFixed(),
      raising: new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(),
      price: poolInfo.publicSalePrice,
      depositAmount: new BigNumber(userDepositInfo.publicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(),
      maxDepositAmount: new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(),
      extraDepositAmount: new BigNumber(userDepositInfo.extraDeposit).dividedBy(raisingTokenDiv).toFixed(),
      insurance: userDepositInfo.publicSaleBuyInsurance,
      countdownEndTime: 0,
      depositStatus: "disabled",
      payCompensation: "0",
      payCompensationState: "hidden",
      payCompensationDate: 0,
      insuranceId: ""
    };
    depositInfo.totalRaised = new BigNumber(poolInfo.totalRaised).toFixed();
    depositInfo.maxRaisingAmount = new BigNumber(poolInfo.publicQuota).multipliedBy(poolInfo.publicSalePrice).plus(
      new BigNumber(poolInfo.whiteListQuota).multipliedBy(poolInfo.presalePrice)
    ).toFixed();
    depositInfo.totalBuyByUsers = new BigNumber(idoPoolData.totalBuyedByUsers).dividedBy(sellingTokenDiv).toFixed();
    depositInfo.totalExtraDeposit = new BigNumber(idoPoolData.totalExtraDeposit).dividedBy(raisingTokenDiv).toFixed();
    depositInfo.totalSupply = new BigNumber(totalSupply).dividedBy(sellingTokenDiv).toFixed();
    depositInfo.avgPrice = new BigNumber(insurancePoolData.getIdoPoolInfo.avgPrice).dividedBy(raisingTokenDiv).toFixed();
    depositInfo.needToPay = new BigNumber(insurancePoolData.getIdoPoolInfo.needToPay).toFixed();
    depositInfo.insuranceFeeRate = new BigNumber(idoPoolData.insuranceFeeRate).dividedBy(100).toFixed();
    depositInfo.userTier = new BigNumber(getUserTier).toNumber();
    depositInfo.needUserTier = 1;
    depositInfo.checkUserTier = depositInfo.userTier >= depositInfo.needUserTier;
    depositInfo.canEnroll = !idoPoolData.isEnrolled && depositInfo.checkUserTier && Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) <= unixTime && Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) >= unixTime;
    depositInfo.isEnroll = idoPoolData.isEnrolled;
    depositInfo.claimableAmount = new BigNumber(idoPoolData.claimable).dividedBy(sellingTokenDiv).toFixed();
    depositInfo.extraDepositRefund = new BigNumber(idoPoolData.refundable[0]).dividedBy(raisingTokenDiv).toFixed();
    if (new BigNumber(idoPoolData.refundable[1]).comparedTo("0") > 0) {
      depositInfo.publicSale.extraDepositAmount = new BigNumber(idoPoolData.refundable[1]).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed();
    } else if (new BigNumber(userDepositInfo.refund).comparedTo("0") > 0) {
      const extraDepositAmount = new BigNumber(userDepositInfo.extraDeposit).minus(userDepositInfo.refund).div(raisingTokenDiv).toFixed();
      depositInfo.publicSale.extraDepositAmount = extraDepositAmount;
    }
    if (depositInfo.whiteList.canDeposit) {
      depositInfo.currentDeposit = depositInfo.whiteList;
      depositInfo.depositMaxInput = new BigNumber(idoPoolData.getPresaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.presalePrice).toFixed();
      depositInfo.maxExtraDeposit = "0";
      depositInfo.triggerExtraDeposit = "0";
    }
    if (depositInfo.publicSale.canDeposit) {
      depositInfo.currentDeposit = depositInfo.publicSale;
      depositInfo.depositMaxInput = new BigNumber(idoPoolData.getPublicSaleQuota).dividedBy(sellingTokenDiv).multipliedBy(poolInfo.publicSalePrice).toFixed(Number.parseInt(poolInfo.raisingTokenInfo.decimals, 10), BigNumber.ROUND_DOWN);
      depositInfo.maxExtraDeposit = new BigNumber(depositInfo.depositMaxInput).multipliedBy(3).toFixed(Number.parseInt(poolInfo.raisingTokenInfo.decimals, 10), BigNumber.ROUND_DOWN);
      depositInfo.triggerExtraDeposit = depositInfo.depositMaxInput;
    }
    depositInfo.claimLoss = (connect, insuranceId) => {
      return connect.create(InsurancePoolAbi).claimLoss(insuranceId);
    };
    depositInfo.enroll = async (connect) => {
      return connect.create(IdoPoolAbi, pool).enroll();
    };
    depositInfo.claim = async (connect) => {
      return connect.create(IdoPoolAbi, pool).claim();
    };
    depositInfo.calculateInsuranceFee = (depositAmount) => {
      return new BigNumber(depositAmount).multipliedBy(depositInfo.insuranceFeeRate).toFixed(0, BigNumber.ROUND_DOWN);
    };
    depositInfo.calculateQuote = (depositAmount) => {
      let depositAmountBN = new BigNumber(depositAmount);
      if (!isNumber(depositAmount))
        depositAmountBN = new BigNumber("0");
      if (!depositInfo.currentDeposit || !depositInfo.currentDeposit.canDeposit)
        return "0";
      if (depositInfo.currentDeposit.type === "whiteList")
        return depositAmountBN.dividedBy(poolInfo.presalePrice).toFixed(Number.parseInt(poolInfo.sellingTokenInfo.decimals), BigNumber.ROUND_DOWN);
      return depositAmountBN.dividedBy(poolInfo.publicSalePrice).toFixed(Number.parseInt(poolInfo.sellingTokenInfo.decimals), BigNumber.ROUND_DOWN);
    };
    depositInfo.deposit = async (connect, buyInsurance, depositAmount, extraDeposit) => {
      if (!depositInfo.currentDeposit.canDeposit)
        throw new Error("not in deposit time");
      const eqMax = new BigNumber(depositAmount).comparedTo(depositInfo.depositMaxInput) === 0;
      if (depositInfo.currentDeposit.type === "whiteList") {
        let buyQuota2 = new BigNumber(depositAmount).dividedBy(poolInfo.presalePrice).multipliedBy(sellingTokenDiv).toFixed(0, BigNumber.ROUND_DOWN);
        if (eqMax)
          buyQuota2 = new BigNumber(idoPoolData.getPresaleQuota.toString()).toFixed(0, BigNumber.ROUND_DOWN);
        return connect.create(IdoPoolAbi, pool).presaleDeposit(buyQuota2, buyInsurance);
      }
      let buyQuota = new BigNumber(depositAmount).dividedBy(poolInfo.publicSalePrice).multipliedBy(sellingTokenDiv).toFixed(0, BigNumber.ROUND_DOWN);
      if (eqMax)
        buyQuota = new BigNumber(idoPoolData.getPublicSaleQuota.toString()).toFixed(0, BigNumber.ROUND_DOWN);
      const extraDepositReal = new BigNumber(extraDeposit || "0").multipliedBy(raisingTokenDiv).toFixed(0, BigNumber.ROUND_DOWN);
      return connect.create(IdoPoolAbi, pool).publicSaleDeposit(buyInsurance, buyQuota, extraDepositReal);
    };
    if (new BigNumber(poolInfo.claimStartTime).comparedTo(unixTime) < 0) {
      if (depositInfo.whiteList.depositAmount === "0" && depositInfo.publicSale.depositAmount === "0")
        depositInfo.timeState = "Finished";
      else
        depositInfo.timeState = "Claiming";
      depositInfo.claimStatus = "enable";
      depositInfo.whiteList.countdownEndTime = 0;
      depositInfo.publicSale.countdownEndTime = 0;
    } else {
      depositInfo.timeState = "Deposit";
      depositInfo.whiteList.depositStatus = "disabled";
      depositInfo.publicSale.depositStatus = "disabled";
      depositInfo.whiteList.countdownEndTime = 0;
      depositInfo.publicSale.countdownEndTime = 0;
      if (Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) <= unixTime && Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) >= unixTime) {
        if (!idoPoolData.presaleDeposited && Number.parseFloat(depositInfo.whiteList.maxDepositAmount) > 0)
          depositInfo.whiteList.depositStatus = "enable";
      } else if (Number.parseInt(poolInfo.publicSaleDepositStartTime, 10) <= unixTime && Number.parseInt(poolInfo.publicSaleDepositEndTime, 10) >= unixTime) {
        if (Number.parseFloat(depositInfo.publicSale.depositAmount) > 0 || Number.parseFloat(depositInfo.whiteList.depositAmount) > 0 || Number.parseFloat(depositInfo.publicSale.maxDepositAmount) > Number.parseFloat(depositInfo.publicSale.depositAmount)) {
          if (!idoPoolData.publicSaleDeposited && idoPoolData.isEnrolled && Number.parseFloat(depositInfo.publicSale.maxDepositAmount) > Number.parseFloat(depositInfo.publicSale.depositAmount))
            depositInfo.publicSale.depositStatus = "enable";
        } else {
          depositInfo.timeState = "Finished";
        }
      }
      if (Number.parseInt(poolInfo.claimStartTime, 10) > unixTime) {
        depositInfo.whiteList.countdownEndTime = Number.parseInt(poolInfo.claimStartTime, 10);
        depositInfo.publicSale.countdownEndTime = Number.parseInt(poolInfo.claimStartTime, 10);
      }
      if (Number.parseInt(poolInfo.publicSaleDepositEndTime, 10) > unixTime)
        depositInfo.publicSale.countdownEndTime = Number.parseInt(poolInfo.publicSaleDepositEndTime, 10);
      if (Number.parseInt(poolInfo.publicSaleDepositStartTime, 10) > unixTime)
        depositInfo.publicSale.countdownEndTime = Number.parseInt(poolInfo.publicSaleDepositStartTime, 10);
      if (Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10) > unixTime)
        depositInfo.whiteList.countdownEndTime = Number.parseInt(poolInfo.presaleAndEnrollEndTime, 10);
      if (Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10) > unixTime)
        depositInfo.whiteList.countdownEndTime = Number.parseInt(poolInfo.presaleAndEnrollStartTime, 10);
    }
    const idoByUser = idoPoolData.getUserIDO;
    if (depositInfo.claimStatus === "enable") {
      if (new BigNumber(depositInfo.avgPrice).comparedTo("0") > 0 && new BigNumber(depositInfo.needToPay).comparedTo("0") > 0) {
        const insuranceDetails = await multiCall.call(
          idoByUser.insuranceIds.map((it) => {
            return {
              getInsuranceDetail: insurancePool.mulContract.getInsuranceDetail(it)
            };
          })
        );
        const handleInsuranceDetails = (depositData, insuranceDetail, insuranceId) => {
          const result = insuranceDetail.getInsuranceDetail;
          const payAmount = new BigNumber(result.buyQuota.toString()).div(sellingTokenDiv).multipliedBy(
            new BigNumber(result.price.toString()).div(raisingTokenDiv).minus(depositInfo.avgPrice)
          ).toFixed();
          depositData.insuranceId = new BigNumber(insuranceId).toFixed();
          if (new BigNumber(payAmount).comparedTo("0") <= 0) {
            depositData.payCompensationState = "noClaim";
          } else {
            depositData.payCompensation = payAmount;
            depositData.payCompensationState = result.lossClaimed ? "received" : "claim";
          }
        };
        if (depositInfo.whiteList.insurance && depositInfo.publicSale.insurance) {
          handleInsuranceDetails(depositInfo.whiteList, insuranceDetails[0], idoByUser.insuranceIds[0]);
          handleInsuranceDetails(depositInfo.publicSale, insuranceDetails[1], idoByUser.insuranceIds[1]);
        } else if (depositInfo.whiteList.insurance) {
          handleInsuranceDetails(depositInfo.whiteList, insuranceDetails[0], idoByUser.insuranceIds[0]);
        } else if (depositInfo.publicSale.insurance) {
          handleInsuranceDetails(depositInfo.publicSale, insuranceDetails[0], idoByUser.insuranceIds[0]);
        }
      } else {
        const time = get(launchpadInfo, "redemption_time", "0");
        let state = "disabled";
        const payCompensationDate = +time + 60 * 60 * 24 * 7;
        if (new BigNumber(time).comparedTo("0") > 0)
          state = "wait";
        if (depositInfo.whiteList.insurance) {
          depositInfo.whiteList.payCompensationState = state;
          depositInfo.whiteList.payCompensationDate = payCompensationDate;
        }
        if (depositInfo.publicSale.insurance) {
          depositInfo.publicSale.payCompensationState = state;
          depositInfo.publicSale.payCompensationDate = payCompensationDate;
        }
      }
    }
    const raisingTokenPrice = await this.getTokenPrice(poolInfo.raisingTokenInfo.id);
    const poolDetail = new IDOPoolDetail();
    poolDetail.tier = depositInfo.userTier;
    poolDetail.depositInfo = depositInfo;
    poolDetail.pool = poolInfo;
    poolDetail.insurance = insurancePoolData.isRegisteredPool;
    poolDetail.whitelistSaleQuota = new BigNumber(idoPoolData.getPresaleQuota.toString()).dividedBy(sellingTokenDiv).toFixed();
    poolDetail.whitelistAllocationTokenAmount = poolInfo.whiteListQuota;
    poolDetail.publicAllocation = BigNumber.max(new BigNumber(get(launchpadInfo, "pool_size", "0")).minus(poolInfo.whiteListQuota), "0").toFixed();
    poolDetail.launchpadTotalRaise = new BigNumber(idoPoolData.totalRaised.toString()).dividedBy(raisingTokenDiv).multipliedBy(raisingTokenPrice).toFixed();
    poolDetail.tokenTotalSupply = new BigNumber(idoPoolData.totalSupply.toString()).dividedBy(sellingTokenDiv).toFixed();
    if (launchpadInfo) {
      poolDetail.poolSize = get(launchpadInfo, "pool_size", "");
      poolDetail.initialMarketCap = get(launchpadInfo, "initial_market_cap", "");
      poolDetail.FDV = get(launchpadInfo, "fdv", "");
      poolDetail.tags = get(launchpadInfo, "selling_token_tag", "");
      poolDetail.whitelistStakingTierRequired = get(launchpadInfo, "whitelist_staking_tier_required", "");
      poolDetail.whitelistRegistrationRequired = get(launchpadInfo, "whitelist_registration_required", "");
      poolDetail.whitelistDistribution = get(launchpadInfo, "whitelist_distribution", "");
      poolDetail.publicStakingTierRequired = get(launchpadInfo, "public_registration_required", "");
      poolDetail.publicRegistrationRequired = get(launchpadInfo, "public_registration_required", "");
      poolDetail.publicDistribution = get(launchpadInfo, "public_distribution", "");
      poolDetail.introduction = get(launchpadInfo, "introduction", "");
      poolDetail.shares = get(launchpadInfo, "shares", []).filter((it) => it.icon);
    } else {
      poolDetail.poolSize = "";
      poolDetail.initialMarketCap = "";
      poolDetail.FDV = "";
      poolDetail.whitelistStakingTierRequired = "No";
      poolDetail.whitelistRegistrationRequired = "No";
      poolDetail.whitelistDistribution = "";
      poolDetail.publicStakingTierRequired = "Yes";
      poolDetail.publicRegistrationRequired = "Yes";
      poolDetail.publicDistribution = "";
      poolDetail.introduction = "";
      poolDetail.shares = [];
    }
    return poolDetail;
  }
};
LaunchpadApi = __decorateClass$4([
  CacheKey("LaunchpadApi")
], LaunchpadApi);

class DashboardMath {
}
DashboardMath.get2DayChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  const currentChange = new BigNumber(valueNow).minus(value24HoursAgo).toNumber();
  const previousChange = new BigNumber(value24HoursAgo).minus(value48HoursAgo).toNumber();
  const adjustedPercentChange = new BigNumber(currentChange).minus(previousChange).multipliedBy("100").div(previousChange).toNumber();
  if (new BigNumber(adjustedPercentChange).isNaN() || !new BigNumber(adjustedPercentChange).isFinite())
    return [currentChange, 0];
  return [currentChange, adjustedPercentChange];
};
/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
DashboardMath.getPercentChange = (valueNow, value24HoursAgo) => {
  if (valueNow && value24HoursAgo) {
    const change = (Number.parseFloat(valueNow.toString()) - Number.parseFloat(value24HoursAgo.toString())) / Number.parseFloat(value24HoursAgo.toString()) * 100;
    if (Number.isFinite(change))
      return change;
  }
  return 0;
};

var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
let DashboardApi = class {
  constructor() {
    this.baseApi = BASE_API;
  }
  async getBlocksFromTimestamps(timestamps) {
    if (timestamps?.length === 0)
      return [];
    const timestampsResult = await this.baseApi.blockGraph(
      QueryBlockTimeGQL(timestamps),
      {}
    );
    const blocks = [];
    for (const timestamp of timestamps) {
      if (timestampsResult[`t${timestamp}`].length > 0) {
        blocks.push({
          timestamp: timestamp.toString(),
          number: Number.parseInt(timestampsResult[`t${timestamp}`][0].number, 10)
        });
      } else {
        blocks.push({
          timestamp: timestamp.toString(),
          number: void 0
        });
      }
    }
    return blocks;
  }
  async protocolData() {
    const deltaTimestamps = TimeUtils.getDeltaTimestamps();
    const [block24, block48] = await this.getBlocksFromTimestamps(
      [deltaTimestamps.t24h, deltaTimestamps.t48h]
    );
    const blockNumbers = Array.from(/* @__PURE__ */ new Set([void 0, block24.number, block48.number]));
    const globalResponses = await Promise.all(
      blockNumbers.map((it) => this.baseApi.exchangeGraph(globalDataGQL(it), {}))
    );
    const data = globalResponses[blockNumbers.indexOf(void 0)];
    const data24 = globalResponses[blockNumbers.indexOf(block24.number)];
    const data48 = globalResponses[blockNumbers.indexOf(block48.number)];
    const parsed = data?.factories?.[0];
    const parsed24 = data24?.factories?.[0];
    const parsed48 = data48?.factories?.[0];
    const volumeUSD = parsed && parsed24 ? Number.parseFloat(parsed.totalVolumeUSD) - Number.parseFloat(parsed24.totalVolumeUSD) : Number.parseFloat(parsed.totalVolumeUSD);
    const volumeOneWindowAgo = Number.parseFloat(get(parsed24, "totalVolumeUSD", "0")) - Number.parseFloat(get(parsed48, "totalVolumeUSD", "0"));
    const volumeUSDChange = volumeUSD && volumeOneWindowAgo ? (volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo * 100 : 0;
    const tvlUSDChange = DashboardMath.getPercentChange(parsed?.totalValueLockedUSD, parsed24?.totalValueLockedUSD);
    const txCount = parsed && parsed24 ? Number.parseFloat(parsed.txCount) - Number.parseFloat(parsed24.txCount) : Number.parseFloat(parsed.txCount);
    const txCountOneWindowAgo = Number.parseFloat(get(parsed24, "txCount", "0")) - Number.parseFloat(get(parsed48, "txCount", "0"));
    const txCountChange = txCount && txCountOneWindowAgo ? DashboardMath.getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0;
    const feesOneWindowAgo = new BigNumber(get(parsed24, "totalFeesUSD", "0")).minus(get(parsed24, "totalProtocolFeesUSD", "0")).minus(new BigNumber(get(parsed48, "totalFeesUSD", "0")).minus(get(parsed48, "totalProtocolFeesUSD", "0")));
    const feesUSD = parsed && parsed24 ? new BigNumber(parsed.totalFeesUSD).minus(parsed.totalProtocolFeesUSD).minus(new BigNumber(parsed24.totalFeesUSD).minus(parsed24.totalProtocolFeesUSD)) : new BigNumber(parsed.totalFeesUSD).minus(parsed.totalProtocolFeesUSD);
    const feeChange = feesUSD && feesOneWindowAgo ? DashboardMath.getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString()) : 0;
    const formattedData = {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === "number" ? volumeUSDChange : 0,
      totalVolumeUSD: Number.parseFloat(parsed?.totalVolumeUSD),
      tvlUSD: Number.parseFloat(parsed?.totalValueLockedUSD),
      tvlUSDChange,
      feesUSD: feesUSD.toNumber(),
      feeChange,
      txCount,
      txCountChange
    };
    return formattedData;
  }
  async chartData() {
    let data = [];
    const ONE_DAY_UNIX = 24 * 60 * 60;
    const startTimestamp = 1619170975;
    const endTimestamp = Number.parseInt(Number((/* @__PURE__ */ new Date()).getTime() / 1e3).toString());
    const skip = 0;
    const chartData = await this.baseApi.exchangeGraph(globalChartGQL, {
      startTime: startTimestamp,
      skip
    });
    data = chartData.pancakeDayDatas;
    const formattedExisting = data.reduce((accum, dayData) => {
      const roundedDate = Number.parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0));
      accum[roundedDate] = {
        date: dayData.date,
        volumeUSD: Number.parseFloat(dayData.volumeUSD),
        tvlUSD: Number.parseFloat(dayData.tvlUSD)
      };
      return accum;
    }, {});
    const firstEntry = formattedExisting[Number.parseInt(Object.keys(formattedExisting)[0])];
    let timestamp = firstEntry?.date ?? startTimestamp;
    let latestTvl = firstEntry?.tvlUSD ?? 0;
    while (timestamp < endTimestamp - ONE_DAY_UNIX) {
      const nextDay = timestamp + ONE_DAY_UNIX;
      const currentDayIndex = Number.parseInt((nextDay / ONE_DAY_UNIX).toFixed(0));
      if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
        formattedExisting[currentDayIndex] = {
          date: nextDay,
          volumeUSD: 0,
          tvlUSD: latestTvl
        };
      } else {
        latestTvl = formattedExisting[currentDayIndex].tvlUSD;
      }
      timestamp = nextDay;
    }
    return Object.values(formattedExisting);
  }
  async topPool() {
    const deltaTimestamps = TimeUtils.getDeltaTimestamps();
    const [block24, block48, block7d] = await this.getBlocksFromTimestamps(
      [deltaTimestamps.t24h, deltaTimestamps.t48h, deltaTimestamps.t7d]
    );
    const poolAddresses = (await this.baseApi.exchangeGraph(topPoolsGQL, {})).pools.map((it) => it.id);
    return await this.poolDatas(poolAddresses, block24, block48, block7d);
  }
  async ethPriceDatas() {
    const deltaTimestamps = TimeUtils.getDeltaTimestamps();
    const [block24, block48, block7d] = await this.getBlocksFromTimestamps(
      [deltaTimestamps.t24h, deltaTimestamps.t48h, deltaTimestamps.t7d]
    );
    const pricesResponse = await this.baseApi.exchangeGraph(ethPricesGQL(
      block24.number,
      block48.number,
      block7d.number
    ), {});
    return {
      current: Number.parseFloat(get(pricesResponse, "current[0].ethPriceUSD", "0")),
      oneDay: Number.parseFloat(get(pricesResponse, "oneDay[0].ethPriceUSD", "0")),
      twoDay: Number.parseFloat(get(pricesResponse, "twoDay[0].ethPriceUSD", "0")),
      week: Number.parseFloat(get(pricesResponse, "oneWeek[0].ethPriceUSD", "0"))
    };
  }
  async topToken() {
    const deltaTimestamps = TimeUtils.getDeltaTimestamps();
    const [block24, block48, block7d] = await this.getBlocksFromTimestamps(
      [deltaTimestamps.t24h, deltaTimestamps.t48h, deltaTimestamps.t7d]
    );
    const tokenAddresses = (await this.baseApi.exchangeGraph(topTokensGQL, {})).tokens.map((it) => it.id);
    if (tokenAddresses.length === 0)
      return {};
    const blockNumbers = Array.from(/* @__PURE__ */ new Set([void 0, block24.number, block48.number, block7d.number]));
    const tokenDataResponses = await Promise.all(
      blockNumbers.map((it) => this.baseApi.exchangeGraph(tokensBulkGQL(it, tokenAddresses), {}))
    );
    const ethPrices = await this.ethPriceDatas();
    const data = tokenDataResponses[blockNumbers.indexOf(void 0)];
    const data24 = tokenDataResponses[blockNumbers.indexOf(block24.number)];
    const data48 = tokenDataResponses[blockNumbers.indexOf(block48.number)];
    const dataWeek = tokenDataResponses[blockNumbers.indexOf(block7d.number)];
    const parsed = data?.tokens ? data.tokens.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const parsed24 = data24?.tokens ? data24.tokens.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const parsed48 = data48?.tokens ? data48.tokens.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const parsedWeek = dataWeek?.tokens ? dataWeek.tokens.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const formatted = tokenAddresses.reduce((accum, address) => {
      const current = parsed[address];
      const oneDay = parsed24[address];
      const twoDay = parsed48[address];
      const week = parsedWeek[address];
      const [volumeUSD, volumeUSDChange] = current && oneDay && twoDay ? DashboardMath.get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD) : current ? [Number.parseFloat(current.volumeUSD), 0] : [0, 0];
      const volumeUSDWeek = current && week ? Number.parseFloat(current.volumeUSD) - Number.parseFloat(week.volumeUSD) : current ? Number.parseFloat(current.volumeUSD) : 0;
      const tvlUSD = current ? Number.parseFloat(current.totalValueLockedUSD) : 0;
      const tvlUSDChange = DashboardMath.getPercentChange(
        Number.parseFloat(current?.totalValueLockedUSD).toFixed(),
        Number.parseFloat(oneDay?.totalValueLockedUSD).toFixed()
      );
      const tvlToken = current ? Number.parseFloat(current.totalValueLocked) : 0;
      const priceUSD = current ? Number.parseFloat(current.derivedETH) * ethPrices.current : 0;
      const priceUSDOneDay = oneDay ? Number.parseFloat(oneDay.derivedETH) * ethPrices.oneDay : 0;
      const priceUSDWeek = week ? Number.parseFloat(week.derivedETH) * ethPrices.week : 0;
      const priceUSDChange = priceUSD && priceUSDOneDay ? DashboardMath.getPercentChange(priceUSD, priceUSDOneDay) : 0;
      const priceUSDChangeWeek = priceUSD && priceUSDWeek ? DashboardMath.getPercentChange(priceUSD, priceUSDWeek) : 0;
      const txCount = current && oneDay ? Number.parseFloat(current.txCount) - Number.parseFloat(oneDay.txCount) : current ? Number.parseFloat(current.txCount) : 0;
      const feesUSD = current && oneDay ? Number.parseFloat(current.feesUSD) - Number.parseFloat(oneDay.feesUSD) : current ? Number.parseFloat(current.feesUSD) : 0;
      accum[address] = {
        exists: !!current,
        address,
        name: current?.name ?? "",
        symbol: current?.symbol ?? "",
        volumeUSD,
        volumeUSDChange,
        volumeUSDWeek,
        txCount,
        tvlUSD,
        feesUSD,
        tvlUSDChange,
        tvlToken,
        priceUSD,
        priceUSDChange,
        priceUSDChangeWeek
      };
      return accum;
    }, {});
    return formatted;
  }
  async poolDatas(poolAddresses, block24, block48, block7d) {
    if (poolAddresses.length === 0)
      return {};
    const blockNumbers = Array.from(/* @__PURE__ */ new Set([void 0, block24.number, block48.number, block7d.number]));
    const poolDataResponses = await Promise.all(
      blockNumbers.map((it) => this.baseApi.exchangeGraph(poolsBulkGQL(it, poolAddresses), {}))
    );
    const data = poolDataResponses[blockNumbers.indexOf(void 0)];
    const data24 = poolDataResponses[blockNumbers.indexOf(block24.number)];
    const data48 = poolDataResponses[blockNumbers.indexOf(block48.number)];
    const dataWeek = poolDataResponses[blockNumbers.indexOf(block7d.number)];
    const ethPriceUSD = data.bundles?.[0]?.ethPriceUSD ? Number.parseFloat(data.bundles[0].ethPriceUSD) : 0;
    const parsed = data.pools ? data.pools.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const parsed24 = data24?.pools ? data24.pools.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const parsed48 = data48?.pools ? data48.pools.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const parsedWeek = dataWeek?.pools ? dataWeek.pools.reduce((accum, poolData) => {
      accum[poolData.id] = poolData;
      return accum;
    }, {}) : {};
    const formatted = poolAddresses.reduce((accum, address) => {
      const current = parsed[address];
      const oneDay = parsed24[address];
      const twoDay = parsed48[address];
      const week = parsedWeek[address];
      const [volumeUSD, volumeUSDChange] = current && oneDay && twoDay ? DashboardMath.get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD) : current ? [new BigNumber(current.volumeUSD).toFixed(), "0"] : ["0", "0"];
      const volumeUSDWeek = current && week ? Number.parseFloat(current.volumeUSD) - Number.parseFloat(week.volumeUSD) : current ? Number.parseFloat(current.volumeUSD) : 0;
      const feeUSD = current && oneDay ? new BigNumber(current?.feesUSD).minus(current?.protocolFeesUSD).minus(new BigNumber(oneDay?.feesUSD).minus(oneDay?.protocolFeesUSD)) : new BigNumber(current?.feesUSD).minus(current?.protocolFeesUSD);
      const feePercent = current ? new BigNumber(current.feeTier).div(1e4).div(100).toFixed() : 0;
      const tvlAdjust0 = current?.volumeToken0 ? new BigNumber(current.volumeToken0).multipliedBy(feePercent).div(2).toFixed() : "0";
      const tvlAdjust1 = current?.volumeToken1 ? new BigNumber(current.volumeToken1).multipliedBy(feePercent).div(2).toFixed() : "0";
      const tvlToken0 = current ? BigNumber.max(new BigNumber(current.totalValueLockedToken0).minus(tvlAdjust0), "0").toFixed() : "0";
      const tvlToken1 = current ? BigNumber.max(new BigNumber(current.totalValueLockedToken1).minus(tvlAdjust1), "0").toFixed() : "0";
      let tvlUSD = current ? new BigNumber(current.totalValueLockedUSD).toFixed() : "0";
      const tvlUSDChange = current && oneDay ? (Number.parseFloat(current.totalValueLockedUSD) - Number.parseFloat(oneDay.totalValueLockedUSD)) / Number.parseFloat(oneDay.totalValueLockedUSD === "0" ? "1" : oneDay.totalValueLockedUSD) * 100 : 0;
      const tvlUpdated = current ? new BigNumber(tvlToken0).multipliedBy(current.token0.derivedETH).multipliedBy(ethPriceUSD).plus(
        new BigNumber(tvlToken1).multipliedBy(current.token1.derivedETH).multipliedBy(ethPriceUSD)
      ).toFixed() : void 0;
      if (tvlUpdated)
        tvlUSD = tvlUpdated;
      const feeTier = current ? Number.parseInt(current.feeTier) : 0;
      if (current) {
        accum[address] = {
          address,
          feeTier,
          liquidity: Number.parseFloat(current.liquidity),
          sqrtPrice: Number.parseFloat(current.sqrtPrice),
          tick: Number.parseFloat(current.tick),
          token0: {
            address: current.token0.id,
            name: current.token0.name,
            symbol: current.token0.symbol,
            decimals: Number.parseInt(current.token0.decimals),
            derivedETH: Number.parseFloat(current.token0.derivedETH)
          },
          token1: {
            address: current.token1.id,
            name: current.token1.name,
            symbol: current.token1.symbol,
            decimals: Number.parseInt(current.token1.decimals),
            derivedETH: Number.parseFloat(current.token1.derivedETH)
          },
          token0Price: Number.parseFloat(current.token0Price),
          token1Price: Number.parseFloat(current.token1Price),
          volumeUSD: new BigNumber(volumeUSD).toNumber(),
          volumeUSDChange: new BigNumber(volumeUSDChange).toNumber(),
          volumeUSDWeek: new BigNumber(volumeUSDWeek).toNumber(),
          tvlUSD: new BigNumber(tvlUSD).toNumber(),
          tvlUSDChange,
          tvlToken0: new BigNumber(tvlToken0).toNumber(),
          tvlToken1: new BigNumber(tvlToken1).toNumber(),
          feeUSD: feeUSD.toNumber()
        };
      }
      return accum;
    }, {});
    return formatted;
  }
  async topTransactions() {
    const data = await this.baseApi.exchangeGraph(globalTransactionsGQL, {});
    const transactions = [
      {
        type: DashboardTransactionType.MINT,
        txs: data.mints
      },
      {
        type: DashboardTransactionType.SWAP,
        txs: data.swaps
      },
      {
        type: DashboardTransactionType.BURN,
        txs: data.burns
      }
    ].flatMap(({ type, txs }) => {
      return txs.map((m) => {
        return {
          type,
          hash: m.id.split("-")[0].split("#")[0],
          timestamp: m.timestamp,
          sender: m.origin,
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id,
          token1Address: m.token1.id,
          amountUSD: Number.parseFloat(m.amountUSD),
          amountToken0: Number.parseFloat(m.amount0),
          amountToken1: Number.parseFloat(m.amount1)
        };
      });
    });
    return transactions.sort((a, b) => {
      return Number.parseInt(b.timestamp, 10) - Number.parseInt(a.timestamp, 10);
    });
  }
};
DashboardApi = __decorateClass$3([
  CacheKey("DashboardApi")
], DashboardApi);

var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let ApiProvider = class {
  constructor() {
    this.baseApi = BASE_API;
  }
  poolV3Api() {
    return createProxy(new PoolV3Api());
  }
  swapV3Api() {
    return createProxy(new SwapV3Api());
  }
  tokenMangerApi() {
    return createProxy(new TokenMangerApi());
  }
  dashboard() {
    return createProxy(new DashboardApi());
  }
  transactionHistory() {
    return transactionHistory;
  }
  launchpad() {
    return createProxy(new LaunchpadApi());
  }
};
ApiProvider = __decorateClass$2([
  CacheKey("ApiProvider")
], ApiProvider);

class AddressInfo {
  getApi() {
    if (typeof this.api === "undefined")
      this.api = createProxy(new ApiProvider());
    return this.api;
  }
  readonlyConnectInfo() {
    const currentConnect = getCurrentConnect();
    if (currentConnect !== null)
      return currentConnect;
    if (typeof this.readonlyConnectInfoInstance === "undefined") {
      const provider = new JsonRpcProvider(this.rpc, this.chainId);
      const connectInfo = new ConnectInfo();
      connectInfo.provider = provider;
      connectInfo.wallet = void 0;
      connectInfo.status = true;
      connectInfo.addressInfo = this;
      this.readonlyConnectInfoInstance = connectInfo;
    }
    return this.readonlyConnectInfoInstance;
  }
  getEtherscanAddress(address) {
    return `${this.scan}/address/${address}`;
  }
  getEtherscanTx(tx) {
    return `${this.scan}/tx/${tx}`;
  }
}

const ETH_ADDRESS = "MNT";
const DEFAULT_ICON = "data:image/svg+xml;base64,IDxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbFJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcFJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxMkMwIDE4LjYyNzQgNS4zNzI1OCAyNCAxMiAyNFpNMTEuODY4NSAxOC4yNDAxQzEyLjE5ODIgMTguMjQyMyAxMi41MTYgMTguMTE3MyAxMi43NTU4IDE3Ljg5MVYxNy45MDU1QzEyLjg3NzYgMTcuNzg5MyAxMi45NzQgMTcuNjQ5MyAxMy4wMzkxIDE3LjQ5NDFDMTMuMTA0MSAxNy4zMzg5IDEzLjEzNjUgMTcuMTcyIDEzLjEzNCAxNy4wMDM3QzEzLjE0MDcgMTYuODQwNSAxMy4xMTE2IDE2LjY3NzggMTMuMDQ4OCAxNi41MjcxQzEyLjk4NiAxNi4zNzYzIDEyLjg5MDkgMTYuMjQxMSAxMi43NzA0IDE2LjEzMUMxMi42NTE3IDE2LjAxNDUgMTIuNTEwNSAxNS45MjM0IDEyLjM1NTUgMTUuODYzNEMxMi4yMDA0IDE1LjgwMzQgMTIuMDM0NyAxNS43NzU2IDExLjg2ODUgMTUuNzgxOUMxMS43MDQ3IDE1Ljc3NjggMTEuNTQxNSAxNS44MDUxIDExLjM4OSAxNS44NjUxQzExLjIzNjQgMTUuOTI1MSAxMS4wOTc3IDE2LjAxNTYgMTAuOTgxMyAxNi4xMzFDMTAuODYwNyAxNi4yNDExIDEwLjc2NTcgMTYuMzc2MyAxMC43MDI4IDE2LjUyNzFDMTAuNjQgMTYuNjc3OCAxMC42MTA5IDE2Ljg0MDUgMTAuNjE3NiAxNy4wMDM3QzEwLjYxNTYgMTcuMTY2MyAxMC42NDY3IDE3LjMyNzYgMTAuNzA5MyAxNy40Nzc2QzEwLjc3MTggMTcuNjI3NyAxMC44NjQ0IDE3Ljc2MzQgMTAuOTgxMyAxNy44NzY0QzExLjA5NjUgMTcuOTk0NCAxMS4yMzQ2IDE4LjA4NzYgMTEuMzg3MyAxOC4xNTAxQzExLjUzOTkgMTguMjEyNyAxMS43MDM2IDE4LjI0MzMgMTEuODY4NSAxOC4yNDAxWk0xMy43NzQgMTIuNTM4MkMxNC4yODM2IDEyLjExOTkgMTQuNzY5MiAxMS42NzMxIDE1LjIyODUgMTEuMjAwMVYxMS4yMTQ2QzE1LjY5NTcgMTAuNjIyNSAxNS45NDcxIDkuODg4ODIgMTUuOTQxMyA5LjEzNDYxQzE1Ljk2NTEgOC42NzM1OCAxNS44ODQ2IDguMjEzMTIgMTUuNzA1OCA3Ljc4NzUxQzE1LjUyNyA3LjM2MTkgMTUuMjU0NSA2Ljk4MjEyIDE0LjkwODUgNi42NzY0M0MxNC4xMzY5IDYuMDU5OTMgMTMuMTU4MSA1Ljc2MzE1IDEyLjE3NCA1Ljg0NzM0QzExLjYyODggNS44MTYwMSAxMS4wODMgNS44OTY2NCAxMC41NzAyIDYuMDg0MjZDMTAuMDU3NCA2LjI3MTg4IDkuNTg4NDEgNi41NjI1MSA5LjE5MjE3IDYuOTM4MjVDOC44Mjc0MyA3LjMyNjU4IDguNTQ0MjQgNy43ODQxMSA4LjM1OTM3IDguMjgzNzhDOC4xNzQ0OSA4Ljc4MzQ1IDguMDkxNjcgOS4zMTUxMSA4LjExNTgxIDkuODQ3MzRIOS44NjEyN0M5LjgyNzI2IDkuMjMwODcgOS45OTAyOCA4LjYxOTU3IDEwLjMyNjcgOC4xMDE4OEMxMC41MjA5IDcuODQ3OCAxMC43NzU5IDcuNjQ2NjggMTEuMDY4MiA3LjUxNzA0QzExLjM2MDUgNy4zODc0IDExLjY4MDggNy4zMzM0MiAxMS45OTk0IDcuMzYwMDZDMTIuMjYzNiA3LjM0MzI4IDEyLjUyODUgNy4zNzk3IDEyLjc3ODMgNy40NjcxNEMxMy4wMjgyIDcuNTU0NTkgMTMuMjU3OSA3LjY5MTI5IDEzLjQ1NCA3Ljg2OTE1QzEzLjgwMDcgOC4yMjkzNCAxMy45OTgyIDguNzA3NDYgMTQuMDA2NyA5LjIwNzM0QzEzLjk5MzUgOS42NjY3NCAxMy44MjQyIDEwLjEwOCAxMy41MjY3IDEwLjQ1ODJMMTMuMjM1OCAxMC43NzgyQzEyLjQ4MjMgMTEuMzg1OSAxMS44MzM3IDEyLjExMzIgMTEuMzE1OCAxMi45MzFDMTEuMDY2MyAxMy40MzY3IDEwLjk0NjMgMTMuOTk2NSAxMC45NjY3IDE0LjU2MDFWMTQuODUxSDEyLjc4NDlWMTQuNTYwMUMxMi43Nzc4IDE0LjE2NDQgMTIuODczIDEzLjc3MzYgMTMuMDYxMyAxMy40MjU1QzEzLjIzMTcgMTMuMDgxNiAxMy40NzQ5IDEyLjc3ODggMTMuNzc0IDEyLjUzODJaIgogICAgICAgIGZpbGw9IiNCRUMzQ0IiCiAgICAgIC8+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbFJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcFJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgZD0iTTEyIDIzQzE4LjA3NTEgMjMgMjMgMTguMDc1MSAyMyAxMkMyMyA1LjkyNDg3IDE4LjA3NTEgMSAxMiAxQzUuOTI0ODcgMSAxIDUuOTI0ODcgMSAxMkMxIDE4LjA3NTEgNS45MjQ4NyAyMyAxMiAyM1pNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIKICAgICAgICBmaWxsPSIjRTJFOEYwIgogICAgICAvPgogICAgPC9zdmc+";
class Balance {
  constructor(token, user, balance) {
    this.token = token;
    this.user = user;
    this.balance = balance;
  }
  select(rate) {
    let selectRate = rate;
    if (rate === "max")
      selectRate = "100";
    return new BigNumber(this.balance).multipliedBy(selectRate).div("100").toFixed();
  }
}
class BalanceAndAllowance extends Balance {
  constructor(token, user, balance, allowance, spender) {
    super(token, user, balance);
    this.allowance = allowance;
    this.spender = spender;
  }
  showApprove(inputAmount) {
    if (this.token.address === ETH_ADDRESS || this.spender === "")
      return false;
    return new BigNumber(inputAmount).comparedTo(this.allowance) > 0;
  }
  approve(connectInfo) {
    return connectInfo.erc20().approve(this.spender, this.token.erc20Address());
  }
  // 生成一个不可用的余额是0的
  static unavailable(token) {
    return new BalanceAndAllowance(token, "", "0", "0", "");
  }
}

class TransactionEvent {
  constructor(connectInfo, hash) {
    this.provider = connectInfo.provider;
    this.connectInfo = connectInfo;
    this._hash = hash;
  }
  /**
   * 获取交易HASH
   */
  hash() {
    return this._hash;
  }
  scan() {
    return `${this.connectInfo.getScan()}/tx/${this._hash}`;
  }
  /**
   * 等待交易上链,如果有错误则会直接抛出 BasicException
   */
  async confirm() {
    const transactionReceipt = await this.connectInfo.tx().checkTransactionError(this._hash);
    return transactionReceipt;
  }
}

var FeeAmount = /* @__PURE__ */ ((FeeAmount2) => {
  FeeAmount2[FeeAmount2["LOWEST"] = 100] = "LOWEST";
  FeeAmount2[FeeAmount2["LOW"] = 500] = "LOW";
  FeeAmount2[FeeAmount2["MEDIUM"] = 2500] = "MEDIUM";
  FeeAmount2[FeeAmount2["HIGH"] = 1e4] = "HIGH";
  return FeeAmount2;
})(FeeAmount || {});
const TICK_SPACINGS = {
  [100 /* LOWEST */]: 1,
  [500 /* LOW */]: 10,
  [2500 /* MEDIUM */]: 50,
  [1e4 /* HIGH */]: 200
};
class AddLiquidityV3Info {
  constructor() {
    this.token0Amount = "";
    this.token1Amount = "";
    // Set Starting Price
    this.first = null;
    this.firstPrice = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.pool = null;
    this.rate = null;
    // 无需关心的数据
    this.tickLower = null;
    this.tickUpper = null;
    this.tickData = null;
  }
}
class LiquidityListData {
}
class LiquidityInfo extends LiquidityListData {
}

const $schema = "http://json-schema.org/draft-07/schema#";
const $id = "pancakeswap";
const title = "PancakeSwap Token List";
const description = "Schema for lists of tokens compatible with the PancakeSwap Interface, including Uniswap standard and PancakeSwap Aptos";
const definitions = {
	Version: {
		type: "object",
		description: "The version of the list, used in change detection",
		examples: [
			{
				major: 1,
				minor: 0,
				patch: 0
			}
		],
		additionalProperties: false,
		properties: {
			major: {
				type: "integer",
				description: "The major version of the list. Must be incremented when tokens are removed from the list or token addresses are changed.",
				minimum: 0,
				examples: [
					1,
					2
				]
			},
			minor: {
				type: "integer",
				description: "The minor version of the list. Must be incremented when tokens are added to the list.",
				minimum: 0,
				examples: [
					0,
					1
				]
			},
			patch: {
				type: "integer",
				description: "The patch version of the list. Must be incremented for any changes to the list.",
				minimum: 0,
				examples: [
					0,
					1
				]
			}
		},
		required: [
			"major",
			"minor",
			"patch"
		]
	},
	TagIdentifier: {
		type: "string",
		description: "The unique identifier of a tag",
		minLength: 1,
		maxLength: 10,
		pattern: "^[\\w]+$",
		examples: [
			"compound",
			"stablecoin"
		]
	},
	ExtensionIdentifier: {
		type: "string",
		description: "The name of a token extension property",
		minLength: 1,
		maxLength: 40,
		pattern: "^[\\w]+$",
		examples: [
			"color",
			"is_fee_on_transfer",
			"aliases"
		]
	},
	ExtensionMap: {
		type: "object",
		description: "An object containing any arbitrary or vendor-specific token metadata",
		maxProperties: 10,
		propertyNames: {
			$ref: "#/definitions/ExtensionIdentifier"
		},
		additionalProperties: {
			$ref: "#/definitions/ExtensionValue"
		},
		examples: [
			{
				color: "#000000",
				is_verified_by_me: true
			},
			{
				"x-bridged-addresses-by-chain": {
					"1": {
						bridgeAddress: "0x4200000000000000000000000000000000000010",
						tokenAddress: "0x4200000000000000000000000000000000000010"
					}
				}
			}
		]
	},
	ExtensionPrimitiveValue: {
		anyOf: [
			{
				type: "string",
				minLength: 1,
				maxLength: 42,
				examples: [
					"#00000"
				]
			},
			{
				type: "boolean",
				examples: [
					true
				]
			},
			{
				type: "number",
				examples: [
					15
				]
			},
			{
				type: "null"
			}
		]
	},
	ExtensionValue: {
		anyOf: [
			{
				$ref: "#/definitions/ExtensionPrimitiveValue"
			},
			{
				type: "object",
				maxProperties: 10,
				propertyNames: {
					$ref: "#/definitions/ExtensionIdentifier"
				},
				additionalProperties: {
					$ref: "#/definitions/ExtensionValueInner0"
				}
			}
		]
	},
	ExtensionValueInner0: {
		anyOf: [
			{
				$ref: "#/definitions/ExtensionPrimitiveValue"
			},
			{
				type: "object",
				maxProperties: 10,
				propertyNames: {
					$ref: "#/definitions/ExtensionIdentifier"
				},
				additionalProperties: {
					$ref: "#/definitions/ExtensionValueInner1"
				}
			}
		]
	},
	ExtensionValueInner1: {
		anyOf: [
			{
				$ref: "#/definitions/ExtensionPrimitiveValue"
			}
		]
	},
	TagDefinition: {
		type: "object",
		description: "Definition of a tag that can be associated with a token via its identifier",
		additionalProperties: false,
		properties: {
			name: {
				type: "string",
				description: "The name of the tag",
				pattern: "^[ \\w]+$",
				minLength: 1,
				maxLength: 20
			},
			description: {
				type: "string",
				description: "A user-friendly description of the tag",
				pattern: "^[ \\w\\.,:]+$",
				minLength: 1,
				maxLength: 200
			}
		},
		required: [
			"name",
			"description"
		],
		examples: [
			{
				name: "Stablecoin",
				description: "A token with value pegged to another asset"
			}
		]
	},
	TokenInfo: {
		type: "object",
		description: "Metadata for a single token in a token list",
		additionalProperties: false,
		properties: {
			chainId: {
				type: "integer",
				description: "The chain ID of the Ethereum network where this token is deployed",
				minimum: 1,
				examples: [
					1,
					42
				]
			},
			address: {
				type: "string",
				description: "The checksummed address of the token on the specified chain ID",
				pattern: "^0x[a-fA-F0-9]{40}$",
				examples: [
					"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
				]
			},
			decimals: {
				type: "integer",
				description: "The number of decimals for the token balance",
				minimum: 0,
				maximum: 255,
				examples: [
					18
				]
			},
			name: {
				type: "string",
				description: "The name of the token",
				minLength: 1,
				maxLength: 40,
				pattern: "^[ \\w.'+\\-%/À-ÖØ-öø-ÿ:&\\[\\]\\(\\)]+$",
				examples: [
					"USD Coin"
				]
			},
			symbol: {
				type: "string",
				description: "The symbol for the token; must be alphanumeric",
				pattern: "^[a-zA-Z0-9+\\-%/$.]+$",
				minLength: 1,
				maxLength: 20,
				examples: [
					"USDC"
				]
			},
			logoURI: {
				type: "string",
				description: "A URI to the token logo asset; if not set, interface will attempt to find a logo based on the token address; suggest SVG or PNG of size 64x64",
				format: "uri",
				examples: [
					"ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM"
				]
			},
			tags: {
				type: "array",
				description: "An array of tag identifiers associated with the token; tags are defined at the list level",
				items: {
					$ref: "#/definitions/TagIdentifier"
				},
				maxItems: 10,
				examples: [
					"stablecoin",
					"compound"
				]
			},
			extensions: {
				$ref: "#/definitions/ExtensionMap"
			}
		},
		required: [
			"chainId",
			"address",
			"decimals",
			"name",
			"symbol"
		]
	},
	AptosTokenInfo: {
		type: "object",
		description: "Metadata for a single token in a token list",
		additionalProperties: false,
		properties: {
			chainId: {
				type: "integer",
				description: "The chain ID of the Aptos network where this token is deployed, 0 is devent",
				minimum: 0,
				examples: [
					1,
					42
				]
			},
			address: {
				type: "string",
				description: "The address of the coin on the specified chain ID",
				examples: [
					"0x1::aptos_coin::AptosCoin"
				]
			},
			decimals: {
				type: "integer",
				description: "The number of decimals for the token balance",
				minimum: 0,
				maximum: 255,
				examples: [
					18
				]
			},
			name: {
				type: "string",
				description: "The name of the token",
				minLength: 1,
				maxLength: 40,
				pattern: "^[ \\w.'+\\-%/À-ÖØ-öø-ÿ:&\\[\\]\\(\\)]+$",
				examples: [
					"USD Coin"
				]
			},
			symbol: {
				type: "string",
				description: "The symbol for the token; must be alphanumeric",
				pattern: "^[a-zA-Z0-9+\\-%/$.]+$",
				minLength: 1,
				maxLength: 20,
				examples: [
					"USDC"
				]
			},
			logoURI: {
				type: "string",
				description: "A URI to the token logo asset; if not set, interface will attempt to find a logo based on the token address; suggest SVG or PNG of size 64x64",
				format: "uri",
				examples: [
					"ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM"
				]
			},
			tags: {
				type: "array",
				description: "An array of tag identifiers associated with the token; tags are defined at the list level",
				items: {
					$ref: "#/definitions/TagIdentifier"
				},
				maxItems: 10,
				examples: [
					"stablecoin",
					"compound"
				]
			},
			extensions: {
				$ref: "#/definitions/ExtensionMap"
			}
		},
		required: [
			"chainId",
			"address",
			"decimals",
			"name",
			"symbol"
		]
	}
};
const type = "object";
const additionalProperties = false;
const properties = {
	name: {
		type: "string",
		description: "The name of the token list",
		minLength: 1,
		maxLength: 30,
		pattern: "^[\\w ]+$",
		examples: [
			"My Token List"
		]
	},
	timestamp: {
		type: "string",
		format: "date-time",
		description: "The timestamp of this list version; i.e. when this immutable version of the list was created"
	},
	schema: {
		type: "string"
	},
	version: {
		$ref: "#/definitions/Version"
	},
	tokens: {
		type: "array",
		description: "The list of tokens included in the list",
		minItems: 1,
		maxItems: 10000
	},
	keywords: {
		type: "array",
		description: "Keywords associated with the contents of the list; may be used in list discoverability",
		items: {
			type: "string",
			description: "A keyword to describe the contents of the list",
			minLength: 1,
			maxLength: 20,
			pattern: "^[\\w ]+$",
			examples: [
				"compound",
				"lending",
				"personal tokens"
			]
		},
		maxItems: 20,
		uniqueItems: true
	},
	tags: {
		type: "object",
		description: "A mapping of tag identifiers to their name and description",
		propertyNames: {
			$ref: "#/definitions/TagIdentifier"
		},
		additionalProperties: {
			$ref: "#/definitions/TagDefinition"
		},
		maxProperties: 20,
		examples: [
			{
				stablecoin: {
					name: "Stablecoin",
					description: "A token with value pegged to another asset"
				}
			}
		]
	},
	logoURI: {
		type: "string",
		description: "A URI for the logo of the token list; prefer SVG or PNG of size 256x256",
		format: "uri",
		examples: [
			"ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM"
		]
	}
};
const then = {
	properties: {
		tokens: {
			items: {
				$ref: "#/definitions/AptosTokenInfo"
			},
			type: "array",
			description: "The list of tokens included in the list",
			minItems: 1,
			maxItems: 10000
		}
	}
};
const required = [
	"name",
	"timestamp",
	"version",
	"tokens"
];
const AgniTokenListSchema = {
	$schema: $schema,
	$id: $id,
	title: title,
	description: description,
	definitions: definitions,
	type: type,
	additionalProperties: additionalProperties,
	properties: properties,
	"if": {
	properties: {
		schema: {
			"const": "aptos"
		}
	},
	required: [
		"name",
		"timestamp",
		"version",
		"tokens",
		"schema"
	]
},
	then: then,
	"else": {
	properties: {
		tokens: {
			items: {
				$ref: "#/definitions/TokenInfo"
			},
			type: "array",
			description: "The list of tokens included in the list",
			minItems: 1,
			maxItems: 10000
		}
	}
},
	required: required
};

class StorageTokenListInfo {
}
class TokenManagerAddInfo {
  constructor() {
    this.import = () => {
    };
  }
}
class TokenManagerInfo {
  constructor() {
    this.remove = () => {
    };
  }
}
class TokenSelectInfo {
}
class TokenPrice {
  constructor(token, priceUSD, priceMNT) {
    this.token = token;
    this.priceUSD = priceUSD;
    this.priceMNT = priceMNT;
  }
}
class TokenListInfo {
  constructor() {
    this.remove = () => {
    };
    this.updateEnable = () => {
    };
    this.tokenListUrl = () => {
      return `https://tokenlists.org/token-list?url=${this.storageTokenListInfo.url}`;
    };
    this.version = () => {
      return `${this.tokenList.version.major}.${this.tokenList.version.minor}.${this.tokenList.version.patch}`;
    };
  }
}

class LaunchpadStakeDetail {
}
class IdoPoolStatistic {
}
class IDOPool {
}
class IDOPoolInfo {
}
class ShareInfo {
}
class IDODepositInfo {
}
class IDOUserDepositInfo {
}
class IDOPoolDetail {
  constructor() {
    this.updateId = Date.now();
  }
}

var DashboardTransactionType = /* @__PURE__ */ ((DashboardTransactionType2) => {
  DashboardTransactionType2[DashboardTransactionType2["SWAP"] = 0] = "SWAP";
  DashboardTransactionType2[DashboardTransactionType2["MINT"] = 1] = "MINT";
  DashboardTransactionType2[DashboardTransactionType2["BURN"] = 2] = "BURN";
  return DashboardTransactionType2;
})(DashboardTransactionType || {});

class BaseService {
  constructor(connectInfo) {
    this.provider = connectInfo.provider;
    this.connectInfo = connectInfo;
    this.addressInfo = connectInfo.addressInfo;
  }
}

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let Erc20Service = class extends BaseService {
  constructor(connectInfo) {
    super(connectInfo);
  }
  /**
   * 获取 ETH/ERC20的余额
   * @param address
   * @param user
   */
  async getBalance(address, user) {
    if (address === ETH_ADDRESS)
      return await this.getEthBalance(user);
    const tokenIns = this.connectInfo.create(ERC20, address);
    const result = await this.connectInfo.multiCall().singleCall({
      balance: tokenIns.mulContract.balanceOf(user),
      decimals: tokenIns.mulContract.decimals()
    });
    const decimal = Number(result.decimals);
    const amount = new BigNumber(result.balance).dividedBy(new BigNumber(10).pow(decimal)).toFixed();
    Trace.debug("Get ERC20 balance", user, result);
    return {
      amount,
      value: result.balance,
      decimal
    };
  }
  /**
   * 获取 ETH的余额
   * @param user
   */
  async getEthBalance(user) {
    const balance = await this.connectInfo.provider.getBalance(user);
    const decimal = 18;
    const amount = new BigNumber(balance.toString()).dividedBy(new BigNumber(10).pow(decimal)).toFixed();
    Trace.debug("Get ETH balance", user, balance);
    return {
      amount,
      value: balance.toString(),
      decimal
    };
  }
  /**
   * 获取Token的信息
   * @param address
   */
  async getTokenInfo(address) {
    const tokenIns = this.connectInfo.create(ERC20, address);
    const result = await this.connectInfo.multiCall().singleCall({
      name: tokenIns.mulContract.name(),
      symbol: tokenIns.mulContract.symbol(),
      decimal: tokenIns.mulContract.decimals(),
      address: address.toLowerCase()
    });
    return {
      name: result.name,
      symbol: result.symbol,
      decimal: Number.parseInt(result.decimal, 10),
      address: result.address
    };
  }
  /**
   * 获取ERC20的信息
   * @param addresses
   */
  async batchGetTokenInfo(...addresses) {
    const [...resultList] = await this.connectInfo.multiCall().call(
      ...addresses.map((erc20Address) => {
        if (erc20Address === ETH_ADDRESS) {
          return {
            name: ETH_ADDRESS,
            symbol: ETH_ADDRESS,
            decimals: "18",
            address: ETH_ADDRESS
          };
        }
        const tokenIns = this.connectInfo.create(ERC20, erc20Address);
        return {
          name: tokenIns.mulContract.name(),
          symbol: tokenIns.mulContract.symbol(),
          decimals: tokenIns.mulContract.decimals(),
          address: erc20Address.toLowerCase()
        };
      })
    );
    return resultList.map((result) => {
      const data = {
        name: result.name,
        symbol: result.symbol,
        decimal: Number(result.decimals),
        decimals: Number(result.decimals),
        address: result.address,
        id: result.address
      };
      Trace.debug("Get currency information", data);
      return data;
    });
  }
  /**
   * 获取合约币允许操作的金额
   * @param exchangeAddress 交易地址
   * @param tokenAddress 币地址
   * @param userAddress  用户地址
   */
  async getAllowance(exchangeAddress, tokenAddress, userAddress) {
    if (tokenAddress === ETH_ADDRESS) {
      return {
        amount: MAXIMUM_U256,
        value: MAXIMUM_U256,
        decimal: 18,
        showApprove: false
      };
    }
    const tokenIns = this.connectInfo.create(ERC20, tokenAddress);
    const result = await this.connectInfo.multiCall().singleCall({
      allowance: tokenIns.mulContract.allowance(userAddress, exchangeAddress),
      decimals: tokenIns.mulContract.decimals()
    });
    const allowanceBalance = result.allowance;
    const decimal = Number(result.decimals);
    const amount = new BigNumber(allowanceBalance).div(10 ** decimal);
    Trace.debug("Get Allowance Amount", exchangeAddress, tokenAddress, userAddress, result, decimal, amount.toFixed());
    return {
      amount: amount.toFixed(),
      value: allowanceBalance,
      decimal,
      showApprove: new BigNumber(amount).comparedTo("100000000") <= 0
    };
  }
  /**
   * totalSupply
   * @param tokenAddress 币地址
   */
  async totalSupply(tokenAddress) {
    const tokenIns = this.connectInfo.create(ERC20, tokenAddress);
    const value = await tokenIns.totalSupply();
    Trace.debug("Get totalSupply Amount", value);
    return {
      amount: value.toString()
    };
  }
  /**
   * 添加允许合约操作的金额
   * @param exchangeAddress
   * @param tokenAddress
   * @return 交易hash
   */
  async approve(exchangeAddress, tokenAddress) {
    const tokenIns = this.connectInfo.create(ERC20, tokenAddress);
    return await tokenIns.approve(exchangeAddress, MAXIMUM_U256);
  }
  /**
   * 根据地址批量获取余额
   * @param user
   * @param tokens
   */
  async batchGetBalance(user, tokens) {
    const multiCall = this.connectInfo.create(MultiCallContract);
    const result = await this.connectInfo.multiCall().call(
      ...tokens.map((it) => {
        if (it === ETH_ADDRESS) {
          return {
            address: ETH_ADDRESS,
            balance: multiCall.mulContract.getEthBalance(user),
            decimals: "18"
          };
        }
        const tokenIns = this.connectInfo.create(ERC20, it);
        return {
          address: it,
          balance: tokenIns.mulContract.balanceOf(user),
          decimals: tokenIns.mulContract.decimals()
        };
      })
    );
    const data = {};
    result.forEach((it) => {
      data[it.address] = {
        address: it.address,
        amount: new BigNumber(it.balance || "0").div(10 ** Number.parseInt(it.decimals || "0", 10)).toFixed(),
        value: it.balance || "0",
        decimal: Number.parseInt(it.decimals || "0", 10)
      };
    });
    return data;
  }
  /**
   * ERC20转账
   * @param tokenAddress
   * @param to
   * @param amount
   * @return 交易hash
   */
  async transfer(tokenAddress, to, amount) {
    const tokenIns = this.connectInfo.create(ERC20, tokenAddress);
    const decimal = await tokenIns.decimals();
    const value = new BigNumber(amount).multipliedBy(10 ** decimal).toFixed(0, BigNumber.ROUND_DOWN);
    return await tokenIns.transfer(to, value);
  }
  /**
   * 根据Token对象批量获取余额
   * @param user
   * @param tokens
   */
  async batchGetBalanceInfo(user, tokens) {
    const multiCall = this.connectInfo.create(MultiCallContract);
    const result = await this.connectInfo.multiCall().call(
      ...tokens.map((it) => {
        if (it.address === ETH_ADDRESS) {
          return {
            address: ETH_ADDRESS,
            balance: multiCall.mulContract.getEthBalance(user),
            decimals: Number(it.decimals).toFixed()
          };
        }
        const tokenIns = this.connectInfo.create(ERC20, it);
        return {
          address: it.address,
          balance: tokenIns.mulContract.balanceOf(user),
          decimals: Number(it.decimals).toFixed()
        };
      })
    );
    const data = {};
    result.forEach((it, index) => {
      data[it.address] = new Balance(tokens[index], user, new BigNumber(it.balance).div(10 ** it.decimals).toFixed());
    });
    return data;
  }
  /**
   * 批量获取余额和授权
   * @param user    用户
   * @param spender 授权的地址
   * @param tokens
   */
  async batchGetBalanceAndAllowance(user, spender, tokens) {
    const multiCall = this.connectInfo.create(MultiCallContract);
    const result = await this.connectInfo.multiCall().call(
      ...tokens.map((it) => {
        if (it.address === ETH_ADDRESS) {
          return {
            address: ETH_ADDRESS,
            balance: multiCall.mulContract.getEthBalance(user),
            allowance: "0",
            decimals: Number(it.decimals).toFixed()
          };
        }
        const tokenIns = this.connectInfo.create(ERC20, it.address);
        return {
          address: it.address,
          balance: tokenIns.mulContract.balanceOf(user),
          allowance: tokenIns.mulContract.allowance(user, spender),
          decimals: Number(it.decimals).toFixed()
        };
      })
    );
    const data = {};
    result.forEach((it, index) => {
      data[it.address] = new BalanceAndAllowance(tokens[index], user, new BigNumber(it.balance).div(10 ** it.decimals).toFixed(), new BigNumber(it.allowance).div(10 ** it.decimals).toFixed(), spender);
    });
    return data;
  }
};
Erc20Service = __decorateClass$1([
  CacheKey("Erc20Service")
], Erc20Service);

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
let TransactionService = class extends BaseService {
  constructor(connectInfo) {
    super(connectInfo);
    this.defaultErrorMsg = "Please try again. Confirm the transaction and make sure you are paying enough gas!";
  }
  async checkTransactionError(txId) {
    let count = 1e3;
    while (count >= 0) {
      const res = await retry(async () => {
        return await this.provider.getTransactionReceipt(txId);
      });
      Trace.print("checkTransactionError", res);
      if (res && res.status !== null && res.hash.toLowerCase() === txId.toLowerCase()) {
        if (res.status) {
          return res;
        } else {
          const errorRes = await this.transactionErrorHandler(txId);
          throw new BasicException(errorRes.message, errorRes.error);
        }
      }
      await sleep(SLEEP_MS);
      count--;
    }
    throw new BasicException("Transaction timeout");
  }
  async sendContractTransaction(contract, method, args = [], config = {}) {
    const currentChain = getCurrentAddressInfo().chainId;
    const chainId = Number.parseInt((await this.connectInfo.provider.getNetwork()).chainId.toString());
    if (chainId !== currentChain)
      throw new BasicException(`Check your wallet network chain id = ${currentChain}!`);
    return await this.sendRpcTransaction(contract, method, args, config);
  }
  async sendRpcTransaction(contract, method, args, config) {
    try {
      const estimatedGasLimit = await contract[method].estimateGas(...args, config);
      config.gasLimit = calculateGasMargin(estimatedGasLimit.toString());
      const awaitTransactionResponse = contract[method];
      const response = await awaitTransactionResponse(...args, config);
      return new TransactionEvent(this.connectInfo, response.hash);
    } catch (e) {
      throw new BasicException(this.convertErrorMsg(e), e);
    }
  }
  convertErrorMsg(e) {
    Trace.error("ERROR", e);
    let recursiveErr = e;
    let reason;
    if (get(recursiveErr, "data.message")) {
      reason = get(recursiveErr, "data.message");
    } else {
      while (recursiveErr) {
        reason = get(recursiveErr, "reason") || get(recursiveErr, "data.message") || get(recursiveErr, "message") || get(recursiveErr, "info.error.message") || reason;
        recursiveErr = get(recursiveErr, "error") || get(recursiveErr, "data.originalError") || get(recursiveErr, "info");
      }
    }
    reason = reason || this.defaultErrorMsg;
    const REVERT_STR = "execution reverted: ";
    const indexInfo = reason.indexOf(REVERT_STR);
    const isRevertedError = indexInfo >= 0;
    if (isRevertedError)
      reason = reason.substring(indexInfo + REVERT_STR.length);
    let msg = reason;
    if (!/[A-Za-z0-9\. _\:：%]+/.test(msg))
      msg = this.defaultErrorMsg;
    return msg;
  }
  /**
   *
   * @param txId
   * @param message
   */
  async transactionErrorHandler(txId, message = this.defaultErrorMsg) {
    let error = null;
    let errorCode = "";
    try {
      const txData = await this.provider.getTransaction(txId);
      try {
        const s = await this.provider.call(txData);
        Trace.debug(s);
      } catch (e) {
        errorCode = this.convertErrorMsg(e);
        error = e;
        Trace.debug("TransactionService.transactionErrorHandler error ", txId, e);
      }
    } catch (e) {
      error = e;
      Trace.debug("TransactionService.transactionErrorHandler error ", txId, e);
    }
    if (errorCode !== "")
      message = errorCode;
    return {
      error,
      message
    };
  }
  /**
   * 等待几个区块
   * @param web3
   * @param count
   */
  async sleepBlock(count = 1) {
    const fistBlock = await retry(async () => {
      return await this.provider.getBlockNumber();
    });
    while (true) {
      const lastBlock = await retry(async () => {
        return await this.provider.getBlockNumber();
      });
      if (lastBlock - fistBlock >= count)
        return;
      await sleep(SLEEP_MS);
    }
  }
};
__decorateClass([
  EnableProxy()
], TransactionService.prototype, "checkTransactionError", 1);
__decorateClass([
  EnableProxy()
], TransactionService.prototype, "sendContractTransaction", 1);
TransactionService = __decorateClass([
  CacheKey("TransactionService")
], TransactionService);

const TESTNET_ADDRESSES = {
  AgniPoolDeployer: "0x0B7e80F0e664ae80bbE0c56f7908ef14f5898b1d",
  AgniFactory: "0x503Ca2ad7C9C70F4157d14CF94D3ef5Fa96D7032",
  InitCodeHashAddress: "0xECeFAd547Dd6E5556065dF7797D9fC892B5EA864",
  InitCodeHash: "0xaf9bd540c3449b723624376f906d8d3a0e6441ff18b847f05f4f85789ab64d9a",
  WMNT: "0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A",
  SwapRouter: "0xe2DB835566F8677d6889ffFC4F3304e8Df5Fc1df",
  QuoterV2: "0x49C8bb51C6bb791e8D6C31310cE0C14f68492991",
  TickLens: "0x0DC832e8cA4a7E1CE073096709474A5422029DB3",
  NFTDescriptor: "0x8002eb63E37728ddf15bd42Bf2607CBbBa714b3f",
  NonfungibleTokenPositionDescriptor: "0xDc7E9B3E927f2880CEa359e659321F9d232aCb2c",
  NonfungiblePositionManager: "0xb04a19EF7853c52EDe6FBb28F8FfBecb73329eD7",
  AgniInterfaceMulticall: "0xF9Ae3Cc6D6483722b94d7075C9B366bcbbbab9d3",
  MasterChef: "0x0BC31D78e06ef928658e0B6AB50460552f3D91c4",
  MasterChefV3Receiver: "0x882a2c07Bf04DEcCA36Be060B07d8BC0EE50D2Ff",
  AgniLmPoolDeployer: "0x8e8a453Bc0d968bBb284766aa4fE018a367E3106",
  ScoreCalculator: {
    Proxy: "0x9Cecf546DC36A2DaA5eC7375C3cF35FEd1ADD7a2",
    Admin: "0x077e4C7F653FFe83cb560d994aDFF5685b3F0e6B",
    Implementation: "0xF3FaF04d1FeF0bce0a3cCD7a817810B9071fDa36"
  },
  StakingPool: "0x31Fa04284049BD9C3Aff46503482270f0Be4BC5E",
  IdoPoolTemplate: "0xae411e11D9fA2773CEaC200cC2C73F17324Fc93B",
  IdoPoolFactory: "0xBfdb61b73Ad4647f3EcBeeeE5e875F081C486d53",
  InsurancePool: "0xccc6A1C40BCFd5458CE3ebB731644fc62E3041e9",
  Multicall3: "0x70f0c400171158c29B61a3E79C92c72e95679541",
  tokens: [
    "0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A",
    "0x3e163F861826C3f7878bD8fa8117A179d80731Ab",
    "0x82a2eb46a64e4908bbc403854bc8aa699bf058e9",
    "0x74a0e7118480bdff5f812c7a879a41db09ac2c39",
    "0xd0c049ee0b0832e5678d837c1519e1b2380e32e4",
    "0x113667C49c053230D3232AC7d74F471Dcd42f11E"
  ]
};
const MAINNET_ADDRESSES = {
  AgniPoolDeployer: "0xe9827B4EBeB9AE41FC57efDdDd79EDddC2EA4d03",
  AgniFactory: "0x25780dc8Fc3cfBD75F33bFDAB65e969b603b2035",
  InitCodeHashAddress: "0x5cfa0f1c4067C90a50B973e5F98CD265de5Df724",
  InitCodeHash: "0xaf9bd540c3449b723624376f906d8d3a0e6441ff18b847f05f4f85789ab64d9a",
  WMNT: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
  SwapRouter: "0x319B69888b0d11cEC22caA5034e25FfFBDc88421",
  Quoter: "0x9488C05a7b75a6FefdcAE4f11a33467bcBA60177",
  QuoterV2: "0xc4aaDc921E1cdb66c5300Bc158a313292923C0cb",
  TickLens: "0xEcDbA665AA209247CD334d0D037B913528a7bf67",
  NFTDescriptor: "0x70153a35c3005385b45c47cDcfc7197c1a22477a",
  NonfungibleTokenPositionDescriptor: "0xcb814b767D41b4BD94dA6Abb860D25b607ad5764",
  NonfungiblePositionManager: "0x218bf598D1453383e2F4AA7b14fFB9BfB102D637",
  AgniInterfaceMulticall: "0xBE592EFcF174b3E0E4208DC8c1658822d017568f",
  Multicall3: "0x05f3105fc9FC531712b2570f1C6E11dD4bCf7B3c",
  tokens: [
    "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
    "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
    "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
    "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
  ]
};
function initAddress(ENV) {
  if (ENV === "dev" || ENV === "test") {
    const addressInfo = new AddressInfo();
    addressInfo.chainId = 5001;
    addressInfo.chainName = "Mantle Testnet";
    addressInfo.scan = "https://explorer.testnet.mantle.xyz";
    addressInfo.rpc = "https://rpc.testnet.mantle.xyz";
    addressInfo.gasMulticall = "0x3D266aD43828A3e09B8B0BFbb0048A1080B389cb";
    addressInfo.multicall = TESTNET_ADDRESSES.Multicall3;
    addressInfo.initCodeHashAddress = TESTNET_ADDRESSES.InitCodeHashAddress;
    addressInfo.initCodeHash = TESTNET_ADDRESSES.InitCodeHash;
    addressInfo.swapRouter = TESTNET_ADDRESSES.SwapRouter;
    addressInfo.quoterV2 = TESTNET_ADDRESSES.QuoterV2;
    addressInfo.tickLens = TESTNET_ADDRESSES.TickLens;
    addressInfo.nftDescriptor = TESTNET_ADDRESSES.NFTDescriptor;
    addressInfo.nonfungibleTokenPositionDescriptor = TESTNET_ADDRESSES.NonfungibleTokenPositionDescriptor;
    addressInfo.nonfungiblePositionManager = TESTNET_ADDRESSES.NonfungiblePositionManager;
    addressInfo.agniPoolDeployer = TESTNET_ADDRESSES.AgniPoolDeployer;
    addressInfo.WMNT = TESTNET_ADDRESSES.WMNT;
    addressInfo.exchangeGraphApi = "https://testnet.agni.finance/graph/subgraphs/name/agni/exchange-v3";
    addressInfo.blockGraphApi = "https://testnet.agni.finance/graph/subgraphs/name/agni/blocks";
    addressInfo.launchpadGraphApi = "https://testnet.agni.finance/graph/subgraphs/name/agni/launchpad";
    addressInfo.launchpadStakePool = TESTNET_ADDRESSES.StakingPool;
    addressInfo.launchpadInsurancePool = TESTNET_ADDRESSES.InsurancePool;
    addressInfo.launchpadStakeToken = "0x113667C49c053230D3232AC7d74F471Dcd42f11E";
    addressInfo.baseApiUrl = "https://testnet.agni.finance";
    addressInfo.baseTradeToken = [
      "0xEa12Be2389c2254bAaD383c6eD1fa1e15202b52A",
      "0x3e163f861826c3f7878bd8fa8117a179d80731ab",
      "0x82a2eb46a64e4908bbc403854bc8aa699bf058e9",
      "0x74a0e7118480bdff5f812c7a879a41db09ac2c39"
    ];
    if (ENV === "dev")
      addressInfo.storage = new StorageProvider("node");
    if (ENV === "test")
      addressInfo.storage = new StorageProvider("web");
    updateCurrentAddressInfo(addressInfo);
  } else if (ENV === "prod" || ENV === "prod_node") {
    const addressInfo = new AddressInfo();
    addressInfo.chainId = 5e3;
    addressInfo.chainName = "Mantle";
    addressInfo.scan = "https://explorer.mantle.xyz";
    addressInfo.rpc = "https://rpc.mantle.xyz";
    addressInfo.gasMulticall = "0x0B0BDCFB1Cc30C80A8fE507516943557766fEC0c";
    addressInfo.multicall = MAINNET_ADDRESSES.Multicall3;
    addressInfo.initCodeHashAddress = MAINNET_ADDRESSES.InitCodeHashAddress;
    addressInfo.initCodeHash = MAINNET_ADDRESSES.InitCodeHash;
    addressInfo.swapRouter = MAINNET_ADDRESSES.SwapRouter;
    addressInfo.quoterV2 = MAINNET_ADDRESSES.QuoterV2;
    addressInfo.tickLens = MAINNET_ADDRESSES.TickLens;
    addressInfo.nftDescriptor = MAINNET_ADDRESSES.NFTDescriptor;
    addressInfo.nonfungibleTokenPositionDescriptor = MAINNET_ADDRESSES.NonfungibleTokenPositionDescriptor;
    addressInfo.nonfungiblePositionManager = MAINNET_ADDRESSES.NonfungiblePositionManager;
    addressInfo.agniPoolDeployer = MAINNET_ADDRESSES.AgniPoolDeployer;
    addressInfo.WMNT = MAINNET_ADDRESSES.WMNT;
    addressInfo.baseTradeToken = [
      "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
      "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
      "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
      "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
    ];
    addressInfo.exchangeGraphApi = "https://agni.finance/graph/subgraphs/name/agni/exchange-v3";
    addressInfo.launchpadGraphApi = "https://agni.finance/graph/subgraphs/name/agni/launchpad";
    addressInfo.blockGraphApi = "https://agni.finance/graph/subgraphs/name/agni/blocks";
    addressInfo.launchpadStakePool = "";
    addressInfo.launchpadStakeToken = "";
    addressInfo.launchpadInsurancePool = "";
    addressInfo.baseApiUrl = "https://agni.finance";
    if (ENV === "prod")
      addressInfo.storage = new StorageProvider("web");
    if (ENV === "prod_node")
      addressInfo.storage = new StorageProvider("node");
    updateCurrentAddressInfo(addressInfo);
  } else {
    throw new Error(`${ENV} is not support`);
  }
  Trace.debug("address config init", ENV);
  ConnectManager.chainMap["Mantle Testnet"] = [
    {
      chainId: "0x1389",
      chainName: "Mantle Testnet",
      nativeCurrency: {
        name: "MNT",
        symbol: "MNT",
        decimals: 18
      },
      rpcUrls: ["https://rpc.testnet.mantle.xyz"],
      blockExplorerUrls: ["https://explorer.testnet.mantle.xyz/"]
    }
  ];
  ConnectManager.chainMap.Mantle = [
    {
      chainId: "0x1388",
      chainName: "Mantle",
      nativeCurrency: {
        name: "MNT",
        symbol: "MNT",
        decimals: 18
      },
      rpcUrls: ["https://rpc.mantle.xyz"],
      blockExplorerUrls: ["https://explorer.mantle.xyz/"]
    }
  ];
  ConnectManager.chainMap.Goerli = "0x5";
  ConnectManager.chainMap.sepolia = "0xaa36a7";
}

export { AddLiquidityV3Info, AddressInfo, AgniTokenListSchema, ApiProvider, BASE_API, Balance, BalanceAndAllowance, BaseAbi, BaseApi, BaseCurrency, BaseService, BasicException, Cache, CacheKey, ChainId, ConnectInfo, ConnectManager, CurrencyAmount, DEFAULT_ICON, DashboardApi, DashboardTransactionType, ERC20, ETH_ADDRESS, EnableLogs, EnableProxy, Erc20Service, ErrorInfo, FIVE, FeeAmount, Fraction, GasLimitMulticall, GasMultiCallContract, IAgniPool, IDODepositInfo, IDOPool, IDOPoolDetail, IDOPoolInfo, IDOUserDepositInfo, IERC20, INVALID_ADDRESS, INonfungiblePositionManager, IQuoterV2, IQuoterV2Abi, IStakingPool, IdoPool, IdoPoolAbi, IdoPoolStatistic, InsufficientInputAmountError, InsufficientReservesError, InsurancePool, InsurancePoolAbi, LaunchpadStakeDetail, LiquidityInfo, LiquidityListData, MAINNET_ADDRESSES, MAXIMUM_U256, MINIMUM_LIQUIDITY, MaxUint256, MethodCache, MultiCallContract, Multicall2, NativeCurrency, NonfungiblePositionManager, ONE$1 as ONE, Percent, PoolV3, PoolV3Api, Price, PrivateWallet, Rounding, SLEEP_MS, STORAGE_KEY_TOKENS, STORAGE_KEY_TOKEN_LIST, ShareInfo, StakingPoolAbi, StorageProvider, StorageTokenListInfo, SwapV3Api, TEN, TESTNET_ADDRESSES, THREE, TICK_SPACINGS, TWO$1 as TWO, TimeUtils, Token, TokenListInfo, TokenManagerAddInfo, TokenManagerInfo, TokenMangerApi, TokenPrice, TokenSelectInfo, Trace, TraceTool, TradeType, TransactionEvent, TransactionHistory, TransactionService, VMType, VM_TYPE_MAXIMA, WalletConnect, ZERO$1 as ZERO, ZERO_ADDRESS, _100, _10000, _9975, calculateGasMargin, clearCache, computePriceImpact, convertAmount, convertAmount1, convertBigNumber, convertBigNumber1, createProxy, eqAddress, errorHandlerController, getCurrentAddressInfo, getCurrentConnect, getTokenComparator, getValue, initAddress, isNullOrBlank, isNumber, registerTransactionErrorHandler, retry, showApprove, sleep, sortedInsert, sqrt, transactionHistory, updateCurrentAddressInfo, validateVMTypeInstance };
