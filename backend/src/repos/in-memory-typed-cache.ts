import { TypedKeyValueRepo } from "../interfaces/i-typed-key-value-repo";

export class InMemoryTypedCache<T> implements TypedKeyValueRepo<T> {

    private readonly cache: Map<string, T> = new Map<string, T>();

    public async get(key: string): Promise<T | undefined> {
        return this.cache.get(key);
    }

    public async set(key: string, value: T): Promise<void> {
        this.cache.set(key, value);
    }
}