import BigNumber from 'bignumber.js';
export { default as BigNumber } from 'bignumber.js';
import { JsonFragment, JsonRpcProvider, Wallet, BrowserProvider, JsonRpcApiProvider, Signer, Provider, TransactionReceipt, ParamType, Fragment, FunctionFragment, Contract } from 'ethers';
import { Variables } from 'graphql-request';

/**
 * ABI
 */

declare const IERC20: JsonFragment[];
declare const Multicall2: JsonFragment[];
declare const IAgniPool: JsonFragment[];
declare const INonfungiblePositionManager: JsonFragment[];
declare const IStakingPool: JsonFragment[];
declare const InsurancePool: JsonFragment[];
declare const IdoPool: JsonFragment[];
declare const IQuoterV2: JsonFragment[];
declare const GasLimitMulticall: JsonFragment[];
declare const ISwapRouter: JsonFragment[];

declare class PrivateWallet {
    provider: JsonRpcProvider;
    wallet: Wallet;
}
type WalletType = PrivateWallet | BrowserProvider | {
    provider: any;
};
declare class WalletConnect {
    wallet: WalletType;
    connectInfo: ConnectInfo;
    provider: any;
    constructor(walletName: WalletType);
    disConnect(): void;
    update(): void;
    privateWallet(): Promise<void>;
    web3Provider(): Promise<void>;
    static connectMetaMask(): Promise<WalletConnect>;
    static getEthereum(): any;
    /**
     * 链接钱包
     * @returns
     */
    connect(): Promise<ConnectInfo>;
}
declare class ConnectManager {
    private static connectInfo;
    private static walletConnect;
    static chainMap: Record<string, any>;
    /**
     * 初始化
     * @param wallet
     */
    static connect(wallet: WalletConnect): Promise<ConnectInfo>;
    /**
     * 断开连接
     */
    static disConnect(): Promise<void>;
    /**
     * 获取连接
     */
    static getConnect(): ConnectInfo;
    static addMetamaskChain(chainName: string): void;
}

type Newable<T extends object> = new (...args: any[]) => T;
declare class ConnectInfo {
    private _provider;
    private _wallet;
    private _status;
    private _msg;
    private _account;
    private _chainId;
    walletConnect: WalletConnect;
    private _addressInfo;
    private readonly _instanceCache;
    create<T extends object>(clazz: Newable<T>, ...args: any[]): T;
    clear(): void;
    /**
     * 获取 ERC20 API
     */
    erc20(): Erc20Service;
    /**
     * 获取交易API
     */
    tx(): TransactionService;
    /**
     * multiCall service
     */
    multiCall(): MultiCallContract;
    get provider(): JsonRpcApiProvider;
    set provider(value: JsonRpcApiProvider);
    /**
     * 获取连接的状态
     */
    get status(): boolean;
    set status(value: boolean);
    /**
     * 获取连接的消息
     */
    get msg(): string;
    set msg(value: string);
    /**
     * 获取连接的地址
     */
    get account(): string;
    set account(value: string);
    /**
     * 获取连接的网络ID
     */
    get chainId(): number;
    set chainId(value: number);
    /**
     * 获取连接的地址信息
     */
    get addressInfo(): AddressInfo;
    set addressInfo(value: AddressInfo);
    set wallet(value: Signer);
    getWalletOrProvider(): Signer | Provider;
    getScan(): string;
    addToken(tokenAddress: string): Promise<boolean>;
}

declare class BaseApi {
    request<T = any>(path: string, method: 'get' | 'post' | 'put' | 'delete', data: any, config?: any): Promise<T>;
    graphBase<T = any, V = Variables>(fullUrl: string, query: string, variables: V): Promise<T>;
    blockGraph<T = any, V = Variables>(query: string, variables: V): Promise<T>;
    exchangeGraph<T = any, V = Variables>(query: string, variables: V): Promise<T>;
    launchpadGraph<T = any, V = Variables>(query: string, variables: V): Promise<T>;
    connectInfo(): ConnectInfo;
    address(): AddressInfo;
}
declare const BASE_API: BaseApi;

/**
 * 增加 静态属性 方便对对象进行缓存
 * @param key
 * @constructor
 */
declare function CacheKey(key: string): (target: any) => void;
/**
 * 对方法进行标记
 * @param key
 * @constructor
 */
declare function EnableProxy(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 对方法进行标记,打印LOG
 * @param key
 * @constructor
 */
declare function EnableLogs(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 方法缓存
 * @param key 缓存Key
 * @param ttl milliseconds
 * @constructor
 */
declare function MethodCache(key: string, ttl: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

declare class ErrorInfo {
    error: Error;
    msg: string;
    method: string;
    args: any;
    target: any;
}
/**
 * 注册 交易异常处理回调
 * @param errorHandler
 */
declare function registerTransactionErrorHandler(errorHandler: (error: ErrorInfo) => void): void;
/**
 * 异常处理控制器
 * @param e
 * @param method
 * @param args
 * @param target
 */
declare function errorHandlerController(e: Error, method: string, args: any, target: any): void;
declare function clearCache(): void;
/**
 * 对象代理
 * @param obj
 */
declare function createProxy<T extends object>(obj: T): T;

/**
 * 轮询休眠时长 ms
 */
declare const SLEEP_MS: number;
/**
 * 0 地址
 */
declare const ZERO_ADDRESS: string;
declare const INVALID_ADDRESS: string;
declare const ONE_ADDRESS: string;
/**
 * uint(-1)
 */
declare const MAXIMUM_U256: string;
/**
 *  b / 1e18
 * @param bnAmount
 * @param precision
 */
declare function convertBigNumber(bnAmount: string | number, precision?: number): string;
/**
 *  b / (10 ** decimals)
 * @param bnAmount
 * @param decimals
 */
declare function convertBigNumber1(bnAmount: string | number, decimals?: string | number): string;
/**
 * b * 1e18
 * @param bnAmount
 * @param precision
 */
declare function convertAmount(bnAmount: string | number, precision?: number): string;
/**
 * amount * (10 ** decimals)
 * @param amount
 * @param decimals
 */
declare function convertAmount1(amount: string | number, decimals?: number): string;
/**
 * 休眠指定时间
 * @param ms
 */
declare function sleep(ms: number): Promise<unknown>;
/**
 * 判断未空字符串
 * @param value
 */
declare function isNullOrBlank(value: string): boolean;
/**
 * 判断Null Or Undefined
 * @param value
 */
declare function isNullOrUndefined(value: any): boolean;
/**
 * 重试
 * @param func
 * @param retryCount
 */
declare function retry(func: () => any, retryCount?: number): Promise<any>;
declare function calculateGasMargin(value: string): number;
declare function eqAddress(addr0: string, addr1: string): boolean;
declare function showApprove(balanceInfo: {
    allowance: string | number;
    decimals: string | number;
}): boolean;
declare function getValue(obj: any, path: string, defaultValue: any): any;
declare function isNumber(input: string): boolean;
/**
 * 日志工具
 */
declare class TraceTool {
    private logShow;
    private errorShow;
    private debugShow;
    setLogShow(b: boolean): void;
    setErrorShow(b: boolean): void;
    setDebugShow(b: boolean): void;
    log(...args: any): void;
    print(...args: any): void;
    error(...args: any): void;
    debug(...args: any): void;
}
declare const Trace: TraceTool;

declare class Cache {
    ttl: number;
    data: Record<string, any>;
    constructor(ttl: number);
    now(): number;
    nuke(key: string): this;
    get(key: string): any;
    del(key: string): any;
    put(key: string, val?: any, ttl?: number): any;
}

declare const STORAGE_KEY_TOKEN_LIST = "STORAGE_KEY_TOKEN_LIST";
declare const STORAGE_KEY_TOKENS = "STORAGE_KEY_TOKENS";
declare class StorageProvider {
    type: 'web' | 'node';
    constructor(type: 'web' | 'node');
    get(key: string): string;
    getArray(key: string): any[];
    getObj(key: string): any;
    set(key: string, value: string): void;
    setJson(key: string, value: any): void;
    clearKey(key: string): void;
    clear(): void;
}

type BigintIsh = bigint | number | string;
declare enum ChainId {
    MANTLE = 5000,
    MANTLE_TESTNET = 5001
}
declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
declare const MINIMUM_LIQUIDITY = 1000n;
declare const ZERO = 0n;
declare const ONE = 1n;
declare const TWO = 2n;
declare const THREE = 3n;
declare const FIVE = 5n;
declare const TEN = 10n;
declare const _100 = 100n;
declare const _9975 = 9975n;
declare const _10000 = 10000n;
declare const MaxUint256: bigint;
declare enum VMType {
    uint8 = "uint8",
    uint256 = "uint256"
}
declare const VM_TYPE_MAXIMA: {
    uint8: bigint;
    uint256: bigint;
};

interface SerializedToken {
    chainId: number;
    address: string;
    decimals: number;
    symbol: string;
    name?: string;
    logoURI?: string;
}
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
declare class Token extends BaseCurrency {
    readonly isNative: boolean;
    readonly isToken: boolean;
    /**
     * The contract address on the chain on which this token lives
     */
    readonly address: string;
    readonly logoURI?: string;
    static fromSerialized(serializedToken: SerializedToken): Token;
    constructor(chainId: number, address: string, decimals: number, symbol: string, name?: string, logoURI?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Currency): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
    get wrapped(): Token;
    get serialize(): SerializedToken;
    erc20Address(): string;
    iconUrl(): string;
    scanUrl(): string;
}

type Currency = Token;

/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
declare abstract class BaseCurrency {
    /**
     * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
     */
    abstract readonly isNative: boolean;
    /**
     * Returns whether the currency is a token that is usable in MagmaSwap without wrapping
     */
    abstract readonly isToken: boolean;
    /**
     * The chain ID on which this currency resides
     */
    readonly chainId: number;
    /**
     * The decimals used in representing currency amounts
     */
    readonly decimals: number;
    /**
     * The symbol of the currency, i.e. a short textual non-unique identifier
     */
    readonly symbol: string;
    /**
     * The name of the currency, i.e. a descriptive textual non-unique identifier
     */
    readonly name?: string;
    /**
     * Constructs an instance of the base class `BaseCurrency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    protected constructor(chainId: number, decimals: number, symbol: string, name?: string);
    /**
     * Returns whether this currency is functionally equivalent to the other currency
     * @param other the other currency
     */
    abstract equals(other: Currency): boolean;
    /**
     * Return the wrapped version of this currency that can be used with the MagmaSwap contracts. Currencies must
     * implement this to be used in MagmaSwap
     */
    abstract get wrapped(): Token;
}

declare class Fraction {
    readonly numerator: bigint;
    readonly denominator: bigint;
    constructor(numerator: BigintIsh, denominator?: BigintIsh);
    private static tryParseFraction;
    get quotient(): bigint;
    get remainder(): Fraction;
    invert(): Fraction;
    add(other: Fraction | BigintIsh): Fraction;
    subtract(other: Fraction | BigintIsh): Fraction;
    lessThan(other: Fraction | BigintIsh): boolean;
    equalTo(other: Fraction | BigintIsh): boolean;
    greaterThan(other: Fraction | BigintIsh): boolean;
    multiply(other: Fraction | BigintIsh): Fraction;
    divide(other: Fraction | BigintIsh): Fraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction(): Fraction;
}

declare class Percent extends Fraction {
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    readonly isPercent: true;
    add(other: Fraction | BigintIsh): Percent;
    subtract(other: Fraction | BigintIsh): Percent;
    multiply(other: Fraction | BigintIsh): Percent;
    divide(other: Fraction | BigintIsh): Percent;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

declare class CurrencyAmount<T extends Currency> extends Fraction {
    readonly currency: T;
    readonly decimalScale: bigint;
    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    static fromRawAmount<T extends Currency>(currency: T, rawAmount: BigintIsh): CurrencyAmount<T>;
    /**
     * Construct a currency amount with a denominator that is not equal to 1
     * @param currency the currency
     * @param numerator the numerator of the fractional token amount
     * @param denominator the denominator of the fractional token amount
     */
    static fromFractionalAmount<T extends Currency>(currency: T, numerator: BigintIsh, denominator: BigintIsh): CurrencyAmount<T>;
    protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh);
    add(other: CurrencyAmount<T>): CurrencyAmount<T>;
    subtract(other: CurrencyAmount<T>): CurrencyAmount<T>;
    multiply(other: Fraction | BigintIsh): CurrencyAmount<T>;
    divide(other: Fraction | BigintIsh): CurrencyAmount<T>;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: object): string;
    get wrapped(): CurrencyAmount<Token>;
}

declare class Price<TBase extends Currency, TQuote extends Currency> extends Fraction {
    readonly baseCurrency: TBase;
    readonly quoteCurrency: TQuote;
    readonly scalar: Fraction;
    /**
     * Construct a price, either with the base and quote currency amount, or the
     * @param args
     */
    constructor(...args: [TBase, TQuote, BigintIsh, BigintIsh] | [{
        baseAmount: CurrencyAmount<TBase>;
        quoteAmount: CurrencyAmount<TQuote>;
    }]);
    /**
     * Flip the price, switching the base and quote currency
     */
    invert(): Price<TQuote, TBase>;
    /**
     * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
     * @param other the other price
     */
    multiply<TOtherQuote extends Currency>(other: Price<TQuote, TOtherQuote>): Price<TBase, TOtherQuote>;
    /**
     * Return the amount of quote currency corresponding to a given amount of the base currency
     * @param currencyAmount the amount of base currency to quote against the price
     */
    quote(currencyAmount: CurrencyAmount<TBase>): CurrencyAmount<TQuote>;
    /**
     * Get the value scaled by decimals for formatting
     * @private
     */
    private get adjustedForDecimals();
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */
declare class InsufficientReservesError extends Error {
    readonly isInsufficientReservesError: true;
    constructor();
}
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */
declare class InsufficientInputAmountError extends Error {
    readonly isInsufficientInputAmountError: true;
    constructor();
}

declare function validateVMTypeInstance(value: bigint, vmType: VMType): void;
declare function sqrt(y: bigint): bigint;
declare function sortedInsert<T>(items: T[], add: T, maxSize: number, comparator: (a: T, b: T) => number): T | null;
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
declare function computePriceImpact<TBase extends Currency, TQuote extends Currency>(midPrice: Price<TBase, TQuote>, inputAmount: CurrencyAmount<TBase>, outputAmount: CurrencyAmount<TQuote>): Percent;
declare function getTokenComparator(balances: {
    [tokenAddress: string]: CurrencyAmount<Token> | undefined;
}): (tokenA: Token, tokenB: Token) => number;

declare class TimeUtils {
    static getDeltaTimestamps(): {
        t24h: number;
        t48h: number;
        t7d: number;
        t14d: number;
    };
}

/**
 * Provides information about ticks
 */
interface TickDataProvider {
    /**
     * Return information corresponding to a specific tick
     * @param tick the tick to load
     */
    getTick(tick: number): Promise<{
        liquidityNet: BigintIsh;
    }>;
    /**
     * Return the next tick that is initialized within a single word
     * @param tick The current tick
     * @param lte Whether the next tick should be lte the current tick
     * @param tickSpacing The tick spacing of the pool
     */
    nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]>;
}

interface TickConstructorArgs {
    index: number;
    liquidityGross: BigintIsh;
    liquidityNet: BigintIsh;
}
declare class Tick {
    readonly index: number;
    readonly liquidityGross: bigint;
    readonly liquidityNet: bigint;
    constructor({ index, liquidityGross, liquidityNet }: TickConstructorArgs);
}

/**
 * Represents a V3 pool
 */
declare class Pool {
    readonly token0: Token;
    readonly token1: Token;
    readonly fee: FeeAmount;
    readonly sqrtRatioX96: bigint;
    readonly liquidity: bigint;
    readonly tickCurrent: number;
    readonly tickDataProvider: TickDataProvider;
    feeProtocol?: number;
    private _token0Price?;
    private _token1Price?;
    static getAddress(token0: Token, token1: Token, feeAmount: FeeAmount): string;
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
    constructor(tokenA: Token, tokenB: Token, fee: FeeAmount, sqrtRatioX96: BigintIsh, liquidity: BigintIsh, tickCurrent: number, ticks?: TickDataProvider | (Tick | TickConstructorArgs)[]);
    /**
     * Returns true if the token is either token0 or token1
     * @param token The token to check
     * @returns True if token is either token0 or token
     */
    involvesToken(token: Token): boolean;
    /**
     * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
     */
    get token0Price(): Price<Token, Token>;
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */
    get token1Price(): Price<Token, Token>;
    /**
     * Return the price of the given token in terms of the other token in the pool.
     * @param token The token to return price of
     * @returns The price of the given token, in terms of the other.
     */
    priceOf(token: Token): Price<Token, Token>;
    /**
     * Returns the chain ID of the tokens in the pool.
     */
    get chainId(): number;
    /**
     * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
     * @param inputAmount The input amount for which to quote the output amount
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
     * @returns The output amount and the pool with updated state
     */
    getOutputAmount(inputAmount: CurrencyAmount<Token>, sqrtPriceLimitX96?: bigint): Promise<[CurrencyAmount<Token>, Pool]>;
    /**
     * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
     * @param outputAmount the output amount for which to quote the input amount
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
     * @returns The input amount and the pool with updated state
     */
    getInputAmount(outputAmount: CurrencyAmount<Token>, sqrtPriceLimitX96?: bigint): Promise<[CurrencyAmount<Token>, Pool]>;
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
    private swap;
    get tickSpacing(): number;
}

interface PositionConstructorArgs {
    pool: Pool;
    tickLower: number;
    tickUpper: number;
    liquidity: BigintIsh;
}
/**
 * Represents a position on a Pancake V3 Pool
 */
declare class Position {
    readonly pool: Pool;
    readonly tickLower: number;
    readonly tickUpper: number;
    readonly liquidity: bigint;
    private _token0Amount;
    private _token1Amount;
    private _mintAmounts;
    /**
     * Constructs a position for a given pool with the given liquidity
     * @param pool For which pool the liquidity is assigned
     * @param liquidity The amount of liquidity that is in the position
     * @param tickLower The lower tick of the position
     * @param tickUpper The upper tick of the position
     */
    constructor({ pool, liquidity, tickLower, tickUpper }: PositionConstructorArgs);
    /**
     * Returns the price of token0 at the lower tick
     */
    get token0PriceLower(): Price<Token, Token>;
    /**
     * Returns the price of token0 at the upper tick
     */
    get token0PriceUpper(): Price<Token, Token>;
    /**
     * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
     */
    get amount0(): CurrencyAmount<Token>;
    /**
     * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
     */
    get amount1(): CurrencyAmount<Token>;
    /**
     * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
     * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
     * @returns The sqrt ratios after slippage
     */
    private ratiosAfterSlippage;
    /**
     * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
     * with the given slippage tolerance
     * @param slippageTolerance Tolerance of unfavorable slippage from the current price
     * @returns The amounts, with slippage
     */
    mintAmountsWithSlippage(slippageTolerance: Percent): Readonly<{
        amount0: bigint;
        amount1: bigint;
    }>;
    /**
     * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
     * position with the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the current price
     * @returns The amounts, with slippage
     */
    burnAmountsWithSlippage(slippageTolerance: Percent): Readonly<{
        amount0: bigint;
        amount1: bigint;
    }>;
    /**
     * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
     * the current price for the pool
     */
    get mintAmounts(): Readonly<{
        amount0: bigint;
        amount1: bigint;
    }>;
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
    static fromAmounts({ pool, tickLower, tickUpper, amount0, amount1, useFullPrecision, }: {
        pool: Pool;
        tickLower: number;
        tickUpper: number;
        amount0: BigintIsh;
        amount1: BigintIsh;
        useFullPrecision: boolean;
    }): Position;
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
    static fromAmount0({ pool, tickLower, tickUpper, amount0, useFullPrecision, }: {
        pool: Pool;
        tickLower: number;
        tickUpper: number;
        amount0: BigintIsh;
        useFullPrecision: boolean;
    }): Position;
    /**
     * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
     * @param pool The pool for which the position is created
     * @param tickLower The lower tick
     * @param tickUpper The upper tick
     * @param amount1 The desired amount of token1
     * @returns The position
     */
    static fromAmount1({ pool, tickLower, tickUpper, amount1, }: {
        pool: Pool;
        tickLower: number;
        tickUpper: number;
        amount1: BigintIsh;
    }): Position;
}

declare class PoolV3Api {
    baseApi: BaseApi;
    constructor();
    myLiquidityList(connectInfo: ConnectInfo): Promise<{
        hideClosePosition: LiquidityListData[];
        allPosition: LiquidityListData[];
    }>;
    private initLiquidityData;
    positionHistoryByTokenId(tokenId: string): Promise<LiquidityHistory[]>;
    myLiquidityByTokenId(connectInfo: ConnectInfo, tokenId: string): Promise<LiquidityInfo>;
    collectFeeData(tokenId: string, account: string): Promise<{
        amount0: string;
        amount1: string;
    }>;
    feeTierDistribution(token0: Token, token1: Token): Promise<Record<FeeAmount, number>>;
    allTickInfo(token0: Token, token1: Token, feeAmount: FeeAmount): Promise<{
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    }>;
    static computePoolAddress(tokenA: Token, tokenB: Token, fee: FeeAmount): string;
    getPool(datas: {
        token0: Token;
        token1: Token;
        feeAmount: FeeAmount;
    }[]): Promise<(Pool | undefined)[]>;
    private parsePrice;
    private outputTokenAmount;
    addLiquidity(token0: Token, token1: Token, account: string): Promise<AddLiquidityV3Info>;
}

declare class SwapV3Api {
    baseApi: BaseApi;
    constructor();
    private getPoolMetaData;
    private getCandidatePoolsOnGraphNode;
    private getCandidatePoolsByToken;
    private getCandidatePoolsByPair;
    swapInfo(token0: Token, token1: Token, account: string): Promise<SwapInfo>;
    private getBestTrade;
}

declare class TokenMangerApi {
    baseApi: BaseApi;
    defaultTokenListUrl: string;
    constructor();
    batchGetTokens(addresses: string[]): Promise<Record<string, Token>>;
    tokenPrice(...tokens: Token[]): Promise<TokenPrice[]>;
    tokenList(url?: string): Promise<TokenListInfo[]>;
    tokenSelectList(account: string, searchStr?: string): Promise<{
        searchTokens: TokenManagerAddInfo[];
        customTokens: TokenSelectInfo[];
    }>;
    getTokenByTokenList(): Promise<Token[]>;
    getTokenByContract(addresses: string[]): Promise<Token[]>;
    tokenManager(searchStr?: string): Promise<{
        searchTokens: TokenManagerAddInfo[];
        customTokens: TokenManagerInfo[];
    }>;
    systemTokens(): Token[];
    tradeTokens(): Token[];
    WNATIVE(): Token;
    USDT(): Token;
    NATIVE(): Token;
    private searchTokenList;
    private mapToTokenAdd;
    private mapToTokenList;
    private storageToken;
    private storageTokenAdd;
    private storageTokenRemove;
    private storageTokenListUrls;
    private storageTokenListUrlsAdd;
    private storageTokenListUrlsUpdate;
    private storageTokenListUrlsRemove;
    private uriToHttp;
}

declare class TransactionHistory {
    static connect: ConnectInfo;
    static start: boolean;
    static timoutId: any;
    private baseApi;
    constructor();
    private getKey;
    initUpdateTransaction(connectInfo: ConnectInfo, start: boolean): void;
    private startUpdateTransaction;
    private updateTransaction;
    saveHistory(connectInfo: ConnectInfo, event: TransactionEvent, saveData: SaveRecentTransaction): void;
    histories(connectInfo: ConnectInfo): RecentTransactions[];
    removeByTxHash(connectInfo: ConnectInfo, txHash: string): void;
    removeByIndex(connectInfo: ConnectInfo, index: number): void;
    private update;
    removeAll(connectInfo: ConnectInfo): void;
    private storageHistories;
}
declare const transactionHistory: TransactionHistory;

declare class LaunchpadApi {
    baseApi: BaseApi;
    constructor();
    private getUserStakeInfoByGql;
    staking(account?: string): Promise<LaunchpadStakeDetail>;
    private getTokenPriceHistory;
    private fetchPools;
    getTokenPrice(address: string): Promise<string>;
    getAllTimeHighPrice(address: string): Promise<string>;
    getPools(): Promise<IdoPoolInfos>;
    private getUserDepositedLogsByPool;
    private getPoolInfoByGql;
    poolDetail(pool: string, account?: string): Promise<IDOPoolDetail>;
}

declare class DashboardApi {
    private baseApi;
    constructor();
    getBlocksFromTimestamps(timestamps: number[], type?: 'exchange-v3'): Promise<Block[]>;
    protocolData(): Promise<DashboardProtocolData>;
    chartData(): Promise<DashboardChartDayData[]>;
    topPool(): Promise<Record<string, DashboardPoolData>>;
    ethPriceDatas(): Promise<{
        current: number;
        oneDay: number;
        twoDay: number;
        week: number;
    }>;
    topToken(): Promise<Record<string, DashboardTokenData>>;
    private poolDatas;
    topTransactions(): Promise<DashboardTransaction[]>;
}

/**
 * 请求基类 详细信息查看
 */
declare class ApiProvider {
    baseApi: BaseApi;
    constructor();
    poolV3Api(): PoolV3Api;
    swapV3Api(): SwapV3Api;
    tokenMangerApi(): TokenMangerApi;
    dashboard(): DashboardApi;
    transactionHistory(): TransactionHistory;
    launchpad(): LaunchpadApi;
}

/**
 * 地址信息
 */
declare class AddressInfo {
    /**
     * chainID
     */
    chainId: number;
    /**
     * 链上区块浏览器地址
     */
    scan: string;
    rpc: string;
    multicall: string;
    gasMulticall: string;
    initCodeHashAddress: string;
    initCodeHash: string;
    swapRouter: string;
    quoterV2: string;
    tickLens: string;
    nftDescriptor: string;
    nonfungibleTokenPositionDescriptor: string;
    nonfungiblePositionManager: string;
    agniPoolDeployer: string;
    WMNT: string;
    USDT: string;
    blockGraphApi: string;
    exchangeGraphApi: string;
    launchpadStakeToken: string;
    launchpadStakePool: string;
    launchpadInsurancePool: string;
    launchpadGraphApi: string;
    baseApiUrl: string;
    baseTradeToken: string[];
    readonlyConnectInfoInstance: ConnectInfo;
    api: ApiProvider;
    chainName: string;
    storage: StorageProvider;
    getApi(): ApiProvider;
    readonlyConnectInfo(): ConnectInfo;
    getEtherscanAddress(address: string): string;
    getEtherscanTx(tx: string): string;
}

/**
 * -交易信息
 *
 * 要等待交易上链可以使用   await event.confirm()
 *
 */
declare class TransactionEvent {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected _hash: string;
    constructor(connectInfo: ConnectInfo, hash: string);
    /**
     * 获取交易HASH
     */
    hash(): string;
    scan(): string;
    /**
     * 等待交易上链,如果有错误则会直接抛出 BasicException
     */
    confirm(): Promise<TransactionReceipt>;
}

declare const ETH_ADDRESS = "MNT";
declare const DEFAULT_ICON: string;
type RecentTransactionType = 'add' | 'remove' | 'collect_fee' | 'swap';
type RecentTransactionStatus = 'success' | 'fail' | 'pending';
interface SaveRecentTransaction {
    token0: Token;
    token1: Token;
    token0Amount: string;
    token1Amount: string;
    type: RecentTransactionType;
    to: string | undefined;
}
interface StorageRecentTransaction {
    index: number;
    txHash: string;
    chainId: number;
    token0: Token;
    token1: Token;
    token0Amount: string;
    token1Amount: string;
    type: RecentTransactionType;
    time: number;
    to: string;
    status: RecentTransactionStatus;
}
interface RecentTransactions extends StorageRecentTransaction {
    chainName: string;
    title: string;
    hashUrl: string;
}
declare class Balance {
    token: Token;
    user: string;
    balance: string;
    constructor(token: Token, user: string, balance: string);
    select(rate: '25' | '50' | '75' | 'max'): string;
}
declare class BalanceAndAllowance extends Balance {
    allowance: string;
    spender: string;
    constructor(token: Token, user: string, balance: string, allowance: string, spender: string);
    showApprove(inputAmount: string): boolean;
    approve(connectInfo: ConnectInfo): Promise<TransactionEvent>;
    static unavailable(token: Token): BalanceAndAllowance;
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
var AgniTokenListSchema = {
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

declare class StorageTokenListInfo {
    url: string;
    enable: boolean;
}
declare class TokenManagerAddInfo {
    active: boolean;
    token: Token;
    import: () => void;
}
declare class TokenManagerInfo {
    token: Token;
    remove: () => void;
}
declare class TokenSelectInfo {
    token: Token;
    balance: string;
}
declare class TokenPrice {
    token: Token;
    priceUSD: string;
    priceMNT: string;
    constructor(token: Token, priceUSD: string, priceMNT: string);
}
declare class TokenListInfo {
    storageTokenListInfo: StorageTokenListInfo;
    tokenList: TokenList;
    showRemove: boolean;
    remove: () => void;
    updateEnable: (bool: boolean) => void;
    tokenListUrl: () => string;
    version: () => string;
}
interface Version {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}
interface Tags {
    readonly [tagId: string]: {
        readonly name: string;
        readonly description: string;
    };
}
interface TokenList {
    readonly name: string;
    readonly timestamp: string;
    readonly version: Version;
    readonly tokens: SerializedToken[];
    readonly keywords?: string[];
    readonly tags?: Tags;
    readonly logoURI?: string;
}

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 2500,
    HIGH = 10000
}
/**
 * The default factory tick spacings by fee amount.
 */
declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
interface PoolState {
    feeAmount: FeeAmount;
    pick: number;
    state: 'no create' | 'create';
}
interface TickData {
    tick: number;
    liquidityNet: string;
    liquidityGross: string;
}
interface TickProcessed {
    tick: number;
    liquidityActive: bigint;
    liquidityNet: bigint;
    price0: string;
}
declare class AddLiquidityV3Info {
    poolState: PoolState[];
    token0: Token;
    token1: Token;
    token0Balance: BalanceAndAllowance;
    token1Balance: BalanceAndAllowance;
    feeAmount: FeeAmount;
    token0Amount: string;
    token1Amount: string;
    first: boolean;
    firstPrice: string;
    minPrice: string;
    maxPrice: string;
    pool: Pool;
    rate: '10' | '20' | '50' | 'full';
    tickLower: number;
    tickUpper: number;
    tickData: {
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    };
    updateFeeAmount: (feeAmount: FeeAmount) => void;
    updateAllTickInfo: () => Promise<{
        tickDatas: TickData[];
        ticksProcessed: TickProcessed[];
    }>;
    updateToken0: (amount: string) => string;
    updateToken1: (amount: string) => string;
    checkFirstPrice: (inputFirstPrice: string) => (boolean);
    updateFirstPrice: (inputFirstPrice: string) => void;
    setPriceRange: (minPrice: string | boolean, maxPrice: string | boolean) => {
        minPrice: string;
        maxPrice: string;
    };
    setRate: (rate: '10' | '20' | '50' | 'full') => {
        minPrice: string;
        maxPrice: string;
    };
    addLiquidity: (connect: ConnectInfo, allowedSlippage: string, deadline: string | number) => Promise<TransactionEvent>;
}
interface PositionContractDetails {
    nonce: string;
    tokenId: string;
    operator: string;
    token0: string;
    token1: string;
    fee: string;
    tickLower: string;
    tickUpper: string;
    liquidity: string;
    feeGrowthInside0LastX128: string;
    feeGrowthInside1LastX128: string;
    tokensOwed0: string;
    tokensOwed1: string;
}
declare class LiquidityListData {
    tokenId: string;
    token0: Token;
    token1: Token;
    feeAmount: FeeAmount;
    minPrice: string;
    maxPrice: string;
    currentPrice: string;
    reverseCurrentPrice: string;
    reverseMinPrice: string;
    reverseMaxPrice: string;
    state: 'active' | 'close' | 'inactive';
    liquidity: string;
}
declare class LiquidityInfo extends LiquidityListData {
    token0Balance: BalanceAndAllowance;
    token1Balance: BalanceAndAllowance;
    token0Price: TokenPrice;
    token1Price: TokenPrice;
    token0USD: string;
    token1USD: string;
    liquidityUSD: string;
    apr: string;
    collectToken0: string;
    collectToken1: string;
    collectToken0USD: string;
    collectToken1USD: string;
    collectUSD: string;
    token0Amount: string;
    token1Amount: string;
    histories: LiquidityHistory[];
    collectFee: (connect: ConnectInfo, involvesMNT: boolean) => Promise<TransactionEvent>;
    preRemoveLiquidity: (rate: string) => {
        amount0: string;
        amount1: string;
    };
    removeLiquidity: (connect: ConnectInfo, rate: string, involvesMNT: boolean, allowedSlippage: string, deadline: number | string) => Promise<TransactionEvent>;
    preAddLiquidity: (inputToken: Token, inputAmount: string) => {
        amount0: string;
        amount1: string;
    };
    addLiquidity: (connect: ConnectInfo, amount0: string, amount1: string, allowedSlippage: string, deadline: number | string) => Promise<TransactionEvent>;
}
interface LiquidityHistory {
    time: number;
    txUrl: string;
    type: 'add' | 'remove' | 'collect_fee';
    token0Amount: string;
    token1Amount: string;
}

interface LaunchpadStakeInfo {
    id: string;
    user: string;
    token: string;
    tokenIdOrAmount: string;
    unlockTime: string;
    score: string;
    unStaked: boolean;
}
declare class LaunchpadStakeDetail {
    token: Token;
    balance: BalanceAndAllowance;
    minInputAmount: string;
    unStakeAmount: string;
    lockAmount: string;
    stake: (connect: ConnectInfo, amount: string) => Promise<TransactionEvent>;
    unStake: (connect: ConnectInfo) => Promise<TransactionEvent>;
}
declare class IdoPoolStatistic {
    /**
     * 总参与人数
     */
    totalParticipants: string;
    /**
     * 总募资项目数
     */
    fundedProjects: string;
    /**
     *  总募资金额 USD
     */
    raisedCapital: string;
}
declare class IDOPool {
    /**
     * 池子ID
     */
    id: string;
    /**
     * 募资金额
     */
    raisingAmount: string;
    expectedRaisingAmount: string;
    /**
     * 募资代币的价格
     */
    raisingTokenPrice: string;
    /**
     * 募资代币的历史最高价格
     */
    raisingTokenATHPrice: string;
    /**
     * 出售代币的历史最高价格
     */
    sellingTokenATHPrice: string;
    /**
     * 预售价格
     */
    publicSalePrice: string;
    /**
     * 白名单价格
     */
    presalePrice: string;
    /**
     * 募资代币
     */
    raisingTokenInfo: IDOToken;
    raisingTokenLogo: string;
    /**
     * 出售代币
     */
    sellingTokenInfo: IDOToken;
    sellingTokenLogo: string;
    /**
     * ROI
     */
    roi: string;
    /**
     * 募资开始时间 (秒)
     */
    presaleAndEnrollStartTime: number;
    soldOut: boolean;
}
interface IdoPoolInfos {
    idoPoolStatistics: IdoPoolStatistic;
    allProject: IDOPool[];
    upcomingProjects: IDOPool[];
    comingProjects: IDOPool[];
}
declare class IDOPoolInfo {
    id: string;
    timestamp: string;
    fundraiser: string;
    raisingToken: string;
    raisingTokenInfo: IDOToken;
    raisingTokenLogo: string;
    sellingTokenLogo: string;
    sellingTokenInfo: IDOToken;
    totalSupply: string;
    presalePrice: string;
    publicSalePrice: string;
    presaleAndEnrollStartTime: string;
    presaleAndEnrollEndTime: string;
    presaleAndEnrollPeriod: string;
    publicSaleDepositStartTime: string;
    publicSaleDepositEndTime: string;
    publicSaleDepositPeriod: string;
    claimStartTime: string;
    unlockTillTime: string;
    lockPeriod: string;
    tgeUnlockRatio: string;
    insuranceFeeRate: string;
    platformCommissionFeeRate: string;
    enrollCount: string;
    whiteListQuota: string;
    whiteListCount: string;
    publicQuota: string;
    publicCount: string;
    totalRaised: string;
    totalExtraDeposit: string;
}
declare class ShareInfo {
    id: number;
    type: string;
    url: string;
}
interface IDOToken {
    id: string;
    name: string;
    symbol: string;
    decimals: string;
}
declare class IDODepositInfo {
    timeState: 'Deposit' | 'Claiming' | 'Finished';
    claimStatus: 'enable' | 'disabled';
    insurance: boolean;
    claimableAmount: string;
    extraDepositRefund: string;
    totalExtraDeposit: string;
    whiteList: {
        type: 'publicSale' | 'whiteList';
        canDeposit: boolean;
        deposited: boolean;
        quota: string;
        raising: string;
        price: string;
        depositAmount: string;
        maxDepositAmount: string;
        insurance: boolean;
        countdownEndTime: number;
        depositStatus: 'enable' | 'disabled';
        payCompensation: string;
        payCompensationState: 'hidden' | 'disabled' | 'wait' | 'claim' | 'received' | 'noClaim';
        payCompensationDate: number;
        insuranceId: string;
    };
    publicSale: {
        type: 'publicSale' | 'whiteList';
        canDeposit: boolean;
        deposited: boolean;
        quota: string;
        raising: string;
        price: string;
        depositAmount: string;
        maxDepositAmount: string;
        extraDepositAmount: string;
        insurance: boolean;
        countdownEndTime: number;
        depositStatus: 'enable' | 'disabled';
        payCompensation: string;
        payCompensationState: 'hidden' | 'disabled' | 'wait' | 'claim' | 'received' | 'noClaim';
        payCompensationDate: number;
        insuranceId: string;
    };
    currentDeposit: {
        type: 'publicSale' | 'whiteList';
        canDeposit: boolean;
        deposited: boolean;
        quota: string;
        raising: string;
        price: string;
    };
    totalSupply: string;
    avgPrice: string;
    needToPay: string;
    maxRaisingAmount: string;
    totalRaised: string;
    insuranceFeeRate: string;
    raisingBalance: BalanceAndAllowance;
    canEnroll: boolean;
    checkUserTier: boolean;
    userTier: number;
    needUserTier: number;
    isEnroll: boolean;
    totalBuyByUsers: string;
    maxExtraDeposit: string;
    triggerExtraDeposit: string;
    depositMaxInput: string;
    claimLoss: (connect: ConnectInfo, insuranceId: string) => Promise<TransactionEvent>;
    enroll: (connect: ConnectInfo) => Promise<TransactionEvent>;
    claim: (connect: ConnectInfo) => Promise<TransactionEvent>;
    deposit: (connect: ConnectInfo, buyInsurance: boolean, depositAmount: string, extraDeposit: string) => Promise<TransactionEvent>;
    calculateInsuranceFee: (depositAmount: string) => string;
    calculateQuote: (depositAmount: string) => string;
}
declare class IDOUserDepositInfo {
    publicSaleQuota: string;
    presaleQuote: string;
    extraDeposit: string;
    refund: string;
    publicSaleBuyInsurance: boolean;
    presaleBuyInsurance: boolean;
}
declare class IDOPoolDetail {
    updateId: number;
    pool: IDOPoolInfo;
    depositInfo: IDODepositInfo;
    shares: ShareInfo[];
    insurance: boolean;
    tier: number;
    whitelistSaleQuota: string;
    whitelistAllocationTokenAmount: string;
    whitelistDistribution: string;
    whitelistStakingTierRequired: string;
    whitelistRegistrationRequired: string;
    publicAllocation: string;
    publicDistribution: string;
    publicStakingTierRequired: string;
    publicRegistrationRequired: string;
    introduction: string;
    tokenTotalSupply: string;
    launchpadTotalRaise: string;
    poolSize: string;
    initialMarketCap: string;
    FDV: string;
    tags: string;
}
interface LaunchpadInfo {
    lanchpad_id: string;
    fundraiser: string;
    raising_token: string;
    raising_token_decimal: number;
    raising_token_icon: string;
    selling_token: string;
    selling_token_decimal: number;
    selling_token_icon: string;
    selling_token_tag: string;
    total_raise: string;
    total_supply: string;
    presale_price: string;
    presale_raise: string;
    public_sale_price: string;
    public_sale_raise: string;
    presale_and_enroll_start_time: number;
    presale_and_enroll_period: number;
    presale_and_enroll_end_time: number;
    public_sale_deposit_start_time: number;
    public_sale_deposit_period: number;
    public_sale_deposit_end_time: number;
    claim_start_time: number;
    lock_period: number;
    tge_unlock_ratio: string;
    ido_pool_contract: string;
    pool_size: string;
    initial_market_cap: string;
    fdv: string;
    whitelist_staking_tier_required: string;
    whitelist_registration_required: string;
    whitelist_distribution: string;
    public_staking_tier_required: string;
    public_registration_required: string;
    public_distribution: string;
    redemption_time: string;
    shares: ShareInfo[];
    introduction: string;
}
interface TieInfo {
    'address': string;
    'score': number;
    'tie': number;
}

interface Block {
    number: number;
    timestamp: string;
}
interface DashboardPoolFields {
    id: string;
    feeTier: string;
    liquidity: string;
    sqrtPrice: string;
    tick: string;
    token0: {
        id: string;
        symbol: string;
        name: string;
        decimals: string;
        derivedETH: string;
    };
    token1: {
        id: string;
        symbol: string;
        name: string;
        decimals: string;
        derivedETH: string;
    };
    token0Price: string;
    token1Price: string;
    volumeUSD: string;
    volumeToken0: string;
    volumeToken1: string;
    txCount: string;
    totalValueLockedToken0: string;
    totalValueLockedToken1: string;
    totalValueLockedUSD: string;
    feesUSD: string;
    protocolFeesUSD: string;
}
interface DashboardPoolDataResponse {
    pools: DashboardPoolFields[];
    bundles: {
        ethPriceUSD: string;
    }[];
}
interface DashboardPoolData {
    address: string;
    feeTier: number;
    token0: {
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        derivedETH: number;
    };
    token1: {
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        derivedETH: number;
    };
    liquidity: number;
    sqrtPrice: number;
    tick: number;
    volumeUSD: number;
    volumeUSDChange: number;
    volumeUSDWeek: number;
    tvlUSD: number;
    tvlUSDChange: number;
    token0Price: number;
    token1Price: number;
    tvlToken0: number;
    tvlToken1: number;
    feeUSD: number;
}
interface DashboardTokenFields {
    id: string;
    symbol: string;
    name: string;
    derivedETH: string;
    volumeUSD: string;
    volume: string;
    feesUSD: string;
    txCount: string;
    totalValueLocked: string;
    totalValueLockedUSD: string;
}
interface DashboardTokenDataResponse {
    tokens: DashboardTokenFields[];
}
interface DashboardTokenData {
    exists: boolean;
    name: string;
    symbol: string;
    address: string;
    volumeUSD: number;
    volumeUSDChange: number;
    volumeUSDWeek: number;
    txCount: number;
    feesUSD: number;
    tvlToken: number;
    tvlUSD: number;
    tvlUSDChange: number;
    priceUSD: number;
    priceUSDChange: number;
    priceUSDChangeWeek: number;
}
interface DashboardPricesResponse {
    current: {
        ethPriceUSD: string;
    }[];
    oneDay: {
        ethPriceUSD: string;
    }[];
    twoDay: {
        ethPriceUSD: string;
    }[];
    oneWeek: {
        ethPriceUSD: string;
    }[];
}
interface DashboardGlobalResponse {
    factories: {
        txCount: string;
        totalVolumeUSD: string;
        totalFeesUSD: string;
        totalValueLockedUSD: string;
        totalProtocolFeesUSD: string;
    }[];
}
interface DashboardProtocolData {
    volumeUSD: number;
    totalVolumeUSD: number;
    volumeUSDChange: number;
    tvlUSD: number;
    tvlUSDChange: number;
    feesUSD: number;
    feeChange: number;
    txCount: number;
    txCountChange: number;
}
interface DashboardChartResults {
    pancakeDayDatas: {
        date: number;
        volumeUSD: string;
        tvlUSD: string;
    }[];
}
interface DashboardChartDayData {
    date: number;
    volumeUSD: number;
    tvlUSD: number;
}
declare enum DashboardTransactionType {
    SWAP = 0,
    MINT = 1,
    BURN = 2
}
interface DashboardTransaction {
    type: DashboardTransactionType;
    hash: string;
    timestamp: string;
    sender: string;
    token0Symbol: string;
    token1Symbol: string;
    token0Address: string;
    token1Address: string;
    amountUSD: number;
    amountToken0: number;
    amountToken1: number;
}
interface DashboardTransactionEntry {
    mints: {
        timestamp: string;
        id: string;
        token0: {
            id: string;
            symbol: string;
        };
        token1: {
            id: string;
            symbol: string;
        };
        origin: string;
        amount0: string;
        amount1: string;
        amountUSD: string;
    }[];
    swaps: {
        timestamp: string;
        id: string;
        token0: {
            id: string;
            symbol: string;
        };
        token1: {
            id: string;
            symbol: string;
        };
        origin: string;
        amount0: string;
        amount1: string;
        amountUSD: string;
    }[];
    burns: {
        timestamp: string;
        id: string;
        token0: {
            id: string;
            symbol: string;
        };
        token1: {
            id: string;
            symbol: string;
        };
        owner: string;
        origin: string;
        amount0: string;
        amount1: string;
        amountUSD: string;
    }[];
}

declare enum RouteType {
    V3 = 0
}
interface BaseRoute {
    type: RouteType;
    pools: V3Pool[];
    path: Currency[];
    input: Currency;
    output: Currency;
}
interface RouteWithoutQuote extends BaseRoute {
    percent: number;
    amount: CurrencyAmount<Currency>;
}
type RouteEssentials = Omit<RouteWithoutQuote, 'input' | 'output' | 'amount'>;
interface Route extends RouteEssentials {
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
}

interface SmartRouterTrade<TTradeType extends TradeType> {
    tradeType: TTradeType;
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
    routes: Route[];
    gasEstimate: bigint;
}

interface V3Pool {
    token0: Token;
    token1: Token;
    fee: FeeAmount;
    liquidity: bigint;
    sqrtRatioX96: bigint;
    tick: number;
    address: string;
    token0ProtocolFee: Percent;
    token1ProtocolFee: Percent;
    ticks?: Tick[];
}
interface WithTvl {
    tvlUSD: bigint;
}
type V3PoolWithTvl = V3Pool & WithTvl;
interface SwapConfig {
    gasPriceWei: string;
    allowedSlippage: string;
    allowMultiHops: boolean;
    allowSplitRouting: boolean;
}
interface SwapTokenPriceHistory {
    datas: {
        price: string;
        time: number;
    }[];
    lastPrice: string;
}
interface SwapTokenPrice {
    token0: SwapTokenPriceHistory;
    token1: SwapTokenPriceHistory;
}
type SwapTokenPriceType = 'year' | 'month' | 'week' | 'day';
declare class SwapInfo {
    token0: Token;
    token1: Token;
    isWrap: boolean;
    token0Amount: string;
    token1Amount: string;
    token0Balance: BalanceAndAllowance;
    token1Balance: BalanceAndAllowance;
    token0Price: TokenPrice;
    token1Price: TokenPrice;
    intputToken: Token;
    inputAmount: string;
    swapConfig: SwapConfig;
    token0SwapPrice: string;
    token1SwapPrice: string;
    maximumSold: string;
    minimumReceived: string;
    tradingFee: string;
    priceImpact: string;
    trade: SmartRouterTrade<TradeType>;
    canSwap: boolean;
    tokenPriceType: SwapTokenPriceType;
    tokenPrice: SwapTokenPrice;
    updateInput: (inputToken: Token, inputAmount: string, swapConfig: SwapConfig) => Promise<void>;
    swap: (connectInfo: ConnectInfo, recipientAddr: string, deadline: string | number) => Promise<TransactionEvent>;
    update: () => Promise<void>;
    getTokenPrice: (type: SwapTokenPriceType) => Promise<void>;
}

interface ContractCall {
    contract: {
        address: string;
    };
    name: string;
    inputs: ParamType[];
    outputs: ParamType[];
    params: any[];
}

declare class MulContract {
    private readonly _address;
    private readonly _abi;
    private readonly _functions;
    get address(): string;
    get abi(): Fragment[];
    get functions(): FunctionFragment[];
    constructor(address: string, abi: JsonFragment[] | string[] | Fragment[]);
    [method: string]: any;
}

declare class BaseAbi {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected addressInfo: AddressInfo;
    mulContract: MulContract;
    contract: Contract;
    constructor(connectInfo: ConnectInfo, address: string, abi: JsonFragment[] | string[] | Fragment[]);
}

declare class ERC20 extends BaseAbi {
    constructor(connectInfo: ConnectInfo, token: string);
    allowance(owner: string, sender: string): Promise<string>;
    approve(spender: string, value: string): Promise<TransactionEvent>;
    transfer(to: string, value: string): Promise<TransactionEvent>;
    transferFrom(from: string, to: string, value: string): Promise<TransactionEvent>;
    totalSupply(): Promise<string>;
    balanceOf(owner: string): Promise<string>;
    name(): Promise<string>;
    symbol(): Promise<string>;
    decimals(): Promise<number>;
}

type ShapeWithLabel = Record<string, ContractCall | string>;
declare class MultiCallContract extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    singleCall<T = any>(shapeWithLabel: ShapeWithLabel): Promise<T>;
    call<T = any[]>(...shapeWithLabels: ShapeWithLabel[]): Promise<T>;
}

declare class PoolV3 extends BaseAbi {
    constructor(connectInfo: ConnectInfo, poolAddress: string);
}

declare class NonfungiblePositionManager extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    collect(tokenId: string, token0: Token, token1: Token, fee0: string, fee1: string, involvesMNT: boolean): Promise<TransactionEvent>;
    addLiquidity(position: Position, tokenId: string | undefined, createPool: boolean, slippageTolerance: Percent, deadline: number): Promise<TransactionEvent>;
    removeLiquidity(rate: string, token0: Token, token1: Token, partialPosition: Position, tokenId: string, fee0: string, fee1: string, involvesMNT: boolean, slippageTolerance: Percent, deadline: number): Promise<TransactionEvent>;
}

declare class StakingPoolAbi extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    stake(token: string, tokenIdOrAmount: string): Promise<TransactionEvent>;
    unstake(stakeIds: string[]): Promise<TransactionEvent>;
}

declare class InsurancePoolAbi extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    claimLoss(insuranceId: string): Promise<TransactionEvent>;
}

declare class IdoPoolAbi extends BaseAbi {
    constructor(connectInfo: ConnectInfo, address: string);
    enroll(): Promise<TransactionEvent>;
    presaleDeposit(buyQuota: string, buyInsurance: boolean): Promise<TransactionEvent>;
    publicSaleDeposit(buyInsurance: boolean, buyQuota: string, extraDeposit: string): Promise<TransactionEvent>;
    claim(): Promise<TransactionEvent>;
}

declare class IQuoterV2Abi extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
}

interface GasCallRequest {
    target: string;
    callData: string;
    gasLimit: number;
}
interface GasCallResponse {
    success: boolean;
    returnData: string;
    gasUsed: bigint;
}
declare class GasMultiCallContract extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    multicall(callRequests: GasCallRequest[]): Promise<GasCallResponse[]>;
}

declare class BaseService {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected addressInfo: AddressInfo;
    constructor(connectInfo: ConnectInfo);
}

declare class Erc20Service extends BaseService {
    constructor(connectInfo: ConnectInfo);
    /**
     * 获取 ETH/ERC20的余额
     * @param address
     * @param user
     */
    getBalance(address: string, user: string): Promise<{
        amount: string;
        value: string;
        decimal: number;
    }>;
    /**
     * 获取 ETH的余额
     * @param user
     */
    getEthBalance(user: string): Promise<{
        amount: string;
        value: string;
        decimal: number;
    }>;
    /**
     * 获取Token的信息
     * @param address
     */
    getTokenInfo(address: string): Promise<{
        name: string;
        symbol: string;
        decimal: number;
        address: string;
    }>;
    /**
     * 获取ERC20的信息
     * @param addresses
     */
    batchGetTokenInfo(...addresses: string[]): Promise<Array<{
        name: string;
        symbol: string;
        decimal: number;
        decimals: number;
        address: string;
        id: string;
    }>>;
    /**
     * 获取合约币允许操作的金额
     * @param exchangeAddress 交易地址
     * @param tokenAddress 币地址
     * @param userAddress  用户地址
     */
    getAllowance(exchangeAddress: string, tokenAddress: string, userAddress: string): Promise<{
        amount: string;
        decimal: number;
        value: string;
        showApprove: boolean;
    }>;
    /**
     * totalSupply
     * @param tokenAddress 币地址
     */
    totalSupply(tokenAddress: string): Promise<{
        amount: string;
    }>;
    /**
     * 添加允许合约操作的金额
     * @param exchangeAddress
     * @param tokenAddress
     * @return 交易hash
     */
    approve(exchangeAddress: string, tokenAddress: string): Promise<TransactionEvent>;
    /**
     * 根据地址批量获取余额
     * @param user
     * @param tokens
     */
    batchGetBalance(user: string, tokens: string[]): Promise<Record<string, {
        address: string;
        amount: string;
        value: string;
        decimal: number;
    }>>;
    /**
     * ERC20转账
     * @param tokenAddress
     * @param to
     * @param amount
     * @return 交易hash
     */
    transfer(tokenAddress: string, to: string, amount: string | number | BigNumber): Promise<TransactionEvent>;
    /**
     * 根据Token对象批量获取余额
     * @param user
     * @param tokens
     */
    batchGetBalanceInfo(user: string, tokens: Token[]): Promise<Record<string, Balance>>;
    /**
     * 批量获取余额和授权
     * @param user    用户
     * @param spender 授权的地址
     * @param tokens
     */
    batchGetBalanceAndAllowance(user: string, spender: string, tokens: Token[]): Promise<Record<string, BalanceAndAllowance>>;
}

declare class TransactionService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    defaultErrorMsg: string;
    /**
     * 检查交易
     * @param txId
     */
    checkTransactionError(txId: string): Promise<TransactionReceipt>;
    /**
     * 发送交易
     * @param contract
     * @param method
     * @param args
     * @param config
     */
    sendContractTransaction(contract: Contract, method: string, args?: any[], config?: {
        gasPrice?: string;
        gasLimit?: number;
        fromAddress?: string;
        value?: number | string;
    }): Promise<TransactionEvent>;
    private sendRpcTransaction;
    convertErrorMsg(e: any): string;
    /**
     *
     * @param txId
     * @param message
     */
    transactionErrorHandler(txId: string, message?: string): Promise<{
        message: string;
        error: Error | undefined;
    }>;
    /**
     * 等待几个区块
     * @param web3
     * @param count
     */
    sleepBlock(count?: number): Promise<void>;
}

declare function updateCurrentAddressInfo(addressInfo: AddressInfo): void;
declare function getCurrentAddressInfo(): AddressInfo;

declare class BasicException extends Error {
    static CODE: number;
    static SAFE_CHECK: number;
    private readonly _code;
    private readonly _msg;
    private readonly _sourceError;
    private readonly _detail;
    /**
     * @param msg
     * @param code
     * @param sourceError
     * @param detail
     */
    constructor(msg?: string, sourceError?: Error | undefined, code?: number, detail?: any);
    get code(): number;
    /**
     * 错误信息
     */
    get msg(): string;
    /**
     * 其他数据
     */
    get detail(): any;
    get sourceError(): Error;
    toString(): string;
}

declare const TESTNET_ADDRESSES: {
    AgniPoolDeployer: string;
    AgniFactory: string;
    InitCodeHashAddress: string;
    InitCodeHash: string;
    WMNT: string;
    SwapRouter: string;
    QuoterV2: string;
    TickLens: string;
    NFTDescriptor: string;
    NonfungibleTokenPositionDescriptor: string;
    NonfungiblePositionManager: string;
    AgniInterfaceMulticall: string;
    MasterChef: string;
    MasterChefV3Receiver: string;
    AgniLmPoolDeployer: string;
    ScoreCalculator: {
        Proxy: string;
        Admin: string;
        Implementation: string;
    };
    StakingPool: string;
    IdoPoolTemplate: string;
    IdoPoolFactory: string;
    InsurancePool: string;
    Multicall3: string;
    tokens: string[];
};
declare const MAINNET_ADDRESSES: {
    AgniPoolDeployer: string;
    AgniFactory: string;
    InitCodeHashAddress: string;
    InitCodeHash: string;
    WMNT: string;
    SwapRouter: string;
    Quoter: string;
    QuoterV2: string;
    TickLens: string;
    NFTDescriptor: string;
    NonfungibleTokenPositionDescriptor: string;
    NonfungiblePositionManager: string;
    AgniInterfaceMulticall: string;
    Multicall3: string;
    tokens: string[];
};
declare function initAddress(ENV: 'dev' | 'test' | 'prod' | 'prod_node'): void;

export { AddLiquidityV3Info, AddressInfo, AgniTokenListSchema, ApiProvider, BASE_API, Balance, BalanceAndAllowance, BaseAbi, BaseApi, BaseCurrency, BaseService, BasicException, BigintIsh, Block, Cache, CacheKey, ChainId, ConnectInfo, ConnectManager, Currency, CurrencyAmount, DEFAULT_ICON, DashboardApi, DashboardChartDayData, DashboardChartResults, DashboardGlobalResponse, DashboardPoolData, DashboardPoolDataResponse, DashboardPoolFields, DashboardPricesResponse, DashboardProtocolData, DashboardTokenData, DashboardTokenDataResponse, DashboardTokenFields, DashboardTransaction, DashboardTransactionEntry, DashboardTransactionType, ERC20, ETH_ADDRESS, EnableLogs, EnableProxy, Erc20Service, ErrorInfo, FIVE, FeeAmount, Fraction, GasCallRequest, GasCallResponse, GasLimitMulticall, GasMultiCallContract, IAgniPool, IDODepositInfo, IDOPool, IDOPoolDetail, IDOPoolInfo, IDOToken, IDOUserDepositInfo, IERC20, INVALID_ADDRESS, INonfungiblePositionManager, IQuoterV2, IQuoterV2Abi, IStakingPool, ISwapRouter, IdoPool, IdoPoolAbi, IdoPoolInfos, IdoPoolStatistic, InsufficientInputAmountError, InsufficientReservesError, InsurancePool, InsurancePoolAbi, LaunchpadInfo, LaunchpadStakeDetail, LaunchpadStakeInfo, LiquidityHistory, LiquidityInfo, LiquidityListData, MAINNET_ADDRESSES, MAXIMUM_U256, MINIMUM_LIQUIDITY, MaxUint256, MethodCache, MultiCallContract, Multicall2, Newable, NonfungiblePositionManager, ONE, ONE_ADDRESS, Percent, PoolState, PoolV3, PoolV3Api, PositionContractDetails, Price, PrivateWallet, RecentTransactionStatus, RecentTransactionType, RecentTransactions, Rounding, SLEEP_MS, STORAGE_KEY_TOKENS, STORAGE_KEY_TOKEN_LIST, SaveRecentTransaction, SerializedToken, ShapeWithLabel, ShareInfo, StakingPoolAbi, StorageProvider, StorageRecentTransaction, StorageTokenListInfo, SwapConfig, SwapInfo, SwapTokenPrice, SwapTokenPriceHistory, SwapTokenPriceType, SwapV3Api, TEN, TESTNET_ADDRESSES, THREE, TICK_SPACINGS, TWO, Tags, TickData, TickProcessed, TieInfo, TimeUtils, Token, TokenList, TokenListInfo, TokenManagerAddInfo, TokenManagerInfo, TokenMangerApi, TokenPrice, TokenSelectInfo, Trace, TraceTool, TradeType, TransactionEvent, TransactionHistory, TransactionService, V3Pool, V3PoolWithTvl, VMType, VM_TYPE_MAXIMA, Version, WalletConnect, WalletType, WithTvl, ZERO, ZERO_ADDRESS, _100, _10000, _9975, calculateGasMargin, clearCache, computePriceImpact, convertAmount, convertAmount1, convertBigNumber, convertBigNumber1, createProxy, eqAddress, errorHandlerController, getCurrentAddressInfo, getTokenComparator, getValue, initAddress, isNullOrBlank, isNullOrUndefined, isNumber, registerTransactionErrorHandler, retry, showApprove, sleep, sortedInsert, sqrt, transactionHistory, updateCurrentAddressInfo, validateVMTypeInstance };
