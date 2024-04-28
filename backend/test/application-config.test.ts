import { beforeEach, describe, it } from "node:test";
import { ApplicationConfig } from "../src/configs/application-config";
import { IEnvConfig } from "../src/interfaces/i-env-config";
import assert from "node:assert";

describe("ApplicationConfig", () => {
    let applicationConfig: ApplicationConfig;
    let envConfig: NodeJS.ProcessEnv;

    beforeEach(() => {
        envConfig = {
            PORT: "4000",
            CACHEDURATION: "3600",
            UPSTREAMAPI: "https://example.com/api",
            UPSTREAMAPIKEY: "API_KEY"
        };
        applicationConfig = new ApplicationConfig(envConfig);
    });

    it("should return the correct application port", () => {
        const expectedPort = 4000;
        const actualPort = applicationConfig.ApplicationPort;
        assert.strictEqual(actualPort, expectedPort);
    });

    it("should return the correct cache duration", () => {
        const expectedCacheDuration = 3600;
        const actualCacheDuration = applicationConfig.CacheDuration;
        assert.strictEqual(actualCacheDuration, expectedCacheDuration);
    });

    it("should return the correct upstream API", () => {
        const expectedUpstreamAPI = "https://example.com/api";
        const actualUpstreamAPI = applicationConfig.UpstreamAPI;
        assert.strictEqual(actualUpstreamAPI, expectedUpstreamAPI);
    });

    it("should return the correct upstream API key", () => {
        const expectedUpstreamAPIKey = "API_KEY";
        const actualUpstreamAPIKey = applicationConfig.UpstreamAPIKey;
        assert.strictEqual(actualUpstreamAPIKey, expectedUpstreamAPIKey);
    });
});