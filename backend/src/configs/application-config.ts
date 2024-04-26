import { IEnvConfig } from "../interfaces/i-env-config";

export class ApplicationConfig implements IEnvConfig {

    public get ApplicationPort(): number {
        return Number(process.env.PORT || 3000);
    }

    public get CacheDuration(): number {
        return Number(process.env.CACHEDURATION || 86400 * 1000);
    }

    public get CacheMaxSize(): number {
        return Number(process.env.CACHEMAXSIZE || 1000);
    }

    public get CachedProperties(): string[] {
        return JSON.parse(process.env.CACHEDPROPERTIES || '[]') as string[];
    }
}