import { StandingsRepo } from "../src/repos/standings-repo";
import { IEnvConfig } from "../src/interfaces/i-env-config";
import { ILogger } from "../src/interfaces/i-logger";
import { MCountry } from "../src/models/m-country";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import Sinon from "sinon";

describe("StandingsRepo", () => {
    let standingsRepo: StandingsRepo;
    let appConfig: IEnvConfig;
    let logger: ILogger;
    let apiFetch: typeof fetch;

    beforeEach(() => {
        Sinon.reset();
        appConfig = {
            UpstreamAPI: "https://example.com/api",
            UpstreamAPIKey: "API_KEY",
            ApplicationPort: 3000,
            CacheDuration: 300
        };
        logger = {
            debug: Sinon.stub(),
            log: Sinon.stub(),
            error: Sinon.stub()
        };
        apiFetch = Sinon.stub();
        standingsRepo = new StandingsRepo(appConfig, logger, apiFetch);
    });

    describe("fetchData", () => {
        it("should fetch data from Upstream API and return an specified response", async () => {
            const action = "get_countries";
            const expectedData: Record<string, string>[] = [
                { country_id: "1", country_name: "Country 1" },
                { country_id: "2", country_name: "Country 2" }
            ];
            const expectedURL = new URL(appConfig.UpstreamAPI);
            expectedURL.searchParams.append(`action`, action);
            expectedURL.searchParams.append(`APIkey`, appConfig.UpstreamAPIKey);
            const expectedResponse = new Response(JSON.stringify(expectedData), { status: 200 });

            (apiFetch as Sinon.SinonStub).resolves(expectedResponse);

            const result = await standingsRepo.fetchData<MCountry>(action);

            assert.strictEqual(result.length, 2);

            assert.strictEqual(result[0].countryID, MCountry.from(expectedData[0]).countryID);
            assert.strictEqual(result[0].countryName, MCountry.from(expectedData[0]).countryName);
            assert.strictEqual(result[1].countryID, MCountry.from(expectedData[1]).countryID);
            assert.strictEqual(result[1].countryName, MCountry.from(expectedData[1]).countryName);

            assert.strictEqual((logger.debug as Sinon.SinonStub).callCount, 0);
            assert.strictEqual((logger.error as Sinon.SinonStub).callCount, 0);
            assert.strictEqual((logger.log as Sinon.SinonStub).callCount, 0);
            (apiFetch as Sinon.SinonStub).calledOnceWithExactly(expectedURL);
        });

        it("should handle empty API response and return an empty array", async () => {
            const action = "get_countries";
            const expectedURL = new URL(appConfig.UpstreamAPI);
            expectedURL.searchParams.append(`action`, action);
            expectedURL.searchParams.append(`APIkey`, appConfig.UpstreamAPIKey);
            const expectedResponse = new Response(JSON.stringify([]), { status: 200 });

            (apiFetch as Sinon.SinonStub).resolves(expectedResponse);

            const result = await standingsRepo.fetchData<MCountry>(action);

            assert.strictEqual(result.length, 0);
            assert.strictEqual((logger.debug as Sinon.SinonStub).callCount, 0);
            assert.strictEqual((logger.error as Sinon.SinonStub).callCount, 0);
            assert.strictEqual((logger.log as Sinon.SinonStub).callCount, 0);
            (apiFetch as Sinon.SinonStub).calledOnceWithExactly(expectedURL);
        });

    });
});