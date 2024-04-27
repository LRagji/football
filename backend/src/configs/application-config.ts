import { IEnvConfig } from "../interfaces/i-env-config";

export class ApplicationConfig implements IEnvConfig {

    public get ApplicationPort(): number {
        return Number(process.env.PORT || 3000);
    }

    public get CacheDuration(): number {
        return Number(process.env.CACHEDURATION || 86400 * 1000);
    }

    public get UpstreamAPI(): string {
        return process.env.UPSTREAMAPI || "https://apiv3.apifootball.com/";
    }

    public get UpstreamAPIKey(): string {
        return process.env.UPSTREAMAPIKEY || "";
    }
}