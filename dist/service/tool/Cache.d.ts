export declare class Cache {
    ttl: number;
    data: Record<string, any>;
    constructor(ttl: number);
    now(): number;
    nuke(key: string): this;
    get(key: string): null;
    del(key: string): null;
    put(key: string, val?: any, ttl?: number): null;
}
