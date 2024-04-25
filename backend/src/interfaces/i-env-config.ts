export interface IEnvConfig {
    readonly ApplicationPort: number;
    readonly CacheDuration: number;
    readonly CacheMaxSize: number;
    readonly CachedProperties: string[];
}