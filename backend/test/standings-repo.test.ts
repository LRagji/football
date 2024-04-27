import { StandingsRepo } from "../src/repos/standings-repo";
import { IEnvConfig } from "../src/interfaces/i-env-config";
import { ILogger } from "../src/interfaces/i-logger";
import { MCountry } from "../src/models/m-country";
import { MLeague } from "../src/models/m-league";
import { MStandings } from "../src/models/m-standings";
import { MTeam } from "../src/models/m-team";
import { Response } from "node-fetch";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";

describe("StandingsRepo", () => {
    let standingsRepo: StandingsRepo;
    let appConfig: IEnvConfig;
    let logger: ILogger;

    beforeEach(() => {
        appConfig = {
            UpstreamAPI: "https://example.com/api",
            UpstreamAPIKey: "API_KEY",
            ApplicationPort: 3000,
            CacheDuration: 300
        };
        logger = {
            debug: jest.fn()
        };
        standingsRepo = new StandingsRepo(appConfig, logger);
    });

    describe("fetchData", () => {
        it("should fetch data from Upstream API and return an array of MCountry objects", async () => {
            const action = "get_countries";
            const expectedData: Record<string, string>[] = [
                { id: "1", name: "Country 1" },
                { id: "2", name: "Country 2" }
            ];
            const expectedResponse = new Response(JSON.stringify(expectedData), { status: 200 });

            jest.spyOn(global, "fetch").mockResolvedValueOnce(expectedResponse);

            const result = await standingsRepo.fetchData<MCountry>(action);

            expect(result).toEqual([
                MCountry.from(expectedData[0]),
                MCountry.from(expectedData[1])
            ]);
            expect(global.fetch).toHaveBeenCalledWith(expect.any(URL));
        });

        it("should handle failed API response and return an empty array", async () => {
            const action = "get_countries";
            const expectedResponse = new Response(null, { status: 500 });

            jest.spyOn(global, "fetch").mockResolvedValueOnce(expectedResponse);

            const result = await standingsRepo.fetchData<MCountry>(action);

            expect(result).toEqual([]);
            expect(logger.debug).toHaveBeenCalledWith(`Failed to fetch data from Upstream API(${action}) return status:500`);
            expect(global.fetch).toHaveBeenCalledWith(expect.any(URL));
        });

        // Add more test cases for other actions (get_leagues, get_teams, get_standings)...
    });
});