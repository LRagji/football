import { StandingsController } from "../src/controllers/standings-controller";
import { StandingsService } from "../src/services/standings-service";
import { IEnvConfig } from "../src/interfaces/i-env-config";
import { IStandingRecord } from "../src/interfaces/i-standing-record";
import { Request, Response } from "express";
import Sinon from "sinon";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";

describe("StandingsController", () => {
    let standingsController: StandingsController;
    let standingsService: Sinon.SinonStubbedInstance<StandingsService>;
    let appConfig: IEnvConfig;
    let req: Request;
    let res: Response;

    beforeEach(() => {
        standingsService = Sinon.createStubInstance(StandingsService);
        appConfig = {
            UpstreamAPI: "https://example.com/api",
            UpstreamAPIKey: "API_KEY",
            ApplicationPort: 3000,
            CacheDuration: 300
        };
        standingsController = new StandingsController(standingsService, appConfig);
        req = {
            query: {},
        } as Request;
        res = {
            status: Sinon.stub().returnsThis(),
            send: Sinon.stub(),
            set: Sinon.stub(),
        } as any as Response;
    });

    describe("fetchStandings", () => {
        it("should fetch all standings when no query parameters are provided", async () => {
            const expectedData: IStandingRecord[] = [
                {
                    countryID: "1",
                    countryName: "Country 1",
                    leagueID: "1",
                    leagueName: "League 1",
                    teamID: "1",
                    teamName: "Team 1",
                    overallLeaguePosition: "1"
                },
                {
                    countryID: "1",
                    countryName: "Country 1",
                    leagueID: "1",
                    leagueName: "League 1",
                    teamID: "2",
                    teamName: "Team 2",
                    overallLeaguePosition: "2"
                },
                {
                    countryID: "1",
                    countryName: "Country 1",
                    leagueID: "2",
                    leagueName: "League 2",
                    teamID: "3",
                    teamName: "Team 3",
                    overallLeaguePosition: "1"
                }
            ];
            standingsService.getAllStandings.resolves(expectedData);

            await standingsController.fetchStandings(req, res);

            assert.strictEqual(standingsService.getAllStandings.callCount, 1);
            assert.strictEqual(standingsService.getStandingsByCountryName.callCount, 0);
            assert.strictEqual(standingsService.getStandingsByLeagueName.callCount, 0);
            assert.strictEqual(standingsService.getStandingsByTeamName.callCount, 0);

            assert.strictEqual((res.status as Sinon.SinonStub).callCount, 1);
            assert.strictEqual((res.status as Sinon.SinonStub).firstCall.args[0], 200);
            assert.strictEqual((res.send as Sinon.SinonStub).callCount, 1);
            assert.deepEqual((res.send as Sinon.SinonStub).firstCall.args[0], expectedData);
            (res.set as Sinon.SinonStub).calledOnceWithExactly("Cache-Control", `public, max-age=${appConfig.CacheDuration / 1000}`);
        });

        it("should fetch standings by country name when countryName query parameter is provided", async () => {
            const countryName = "Country 1";
            const expectedData: IStandingRecord[] = [];
            req.query.countryName = countryName;

            standingsService.getStandingsByCountryName.resolves(expectedData);

            await standingsController.fetchStandings(req, res);

            assert.strictEqual(standingsService.getAllStandings.callCount, 0);
            standingsService.getStandingsByCountryName.calledOnceWithExactly(countryName);
            assert.strictEqual(standingsService.getStandingsByLeagueName.callCount, 0);
            assert.strictEqual(standingsService.getStandingsByTeamName.callCount, 0);

            assert.strictEqual((res.status as Sinon.SinonStub).callCount, 1);
            assert.strictEqual((res.status as Sinon.SinonStub).firstCall.args[0], 200);
            assert.strictEqual((res.send as Sinon.SinonStub).callCount, 1);
            assert.deepEqual((res.send as Sinon.SinonStub).firstCall.args[0], expectedData);
            (res.set as Sinon.SinonStub).calledOnceWithExactly("Cache-Control", `public, max-age=${appConfig.CacheDuration / 1000}`);
        });
    });
});