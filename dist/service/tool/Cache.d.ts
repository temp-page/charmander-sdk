export declare class Cache {
    ttl: number;
    data: Record<string, any>;
    constructor(ttl: number);
    now(): number;
    nuke(key: string): this;
    get(key: string): any;
    del(key: string): any;
    put(key: string, val?: any, ttl?: number): any;
}
