export interface IEnvConfig {
    readonly ApplicationPort: number;
    readonly CacheDuration: number;
    readonly UpstreamAPI: string
    readonly UpstreamAPIKey: string
}