import { IEnvConfig } from "../interfaces/i-env-config";

export class ApplicationConfig implements IEnvConfig {

    constructor(private readonly env: NodeJS.ProcessEnv) { }

    public get ApplicationPort(): number {
        return Number(this.env.PORT || 3000);
    }

    public get CacheDuration(): number {
        return Number(this.env.CACHEDURATION || 86400 * 1000);
    }

    public get UpstreamAPI(): string {
        return this.env.UPSTREAMAPI || "https://apiv3.apifootball.com/";
    }

    public get UpstreamAPIKey(): string {
        return this.env.UPSTREAMAPIKEY || "";
    }
}