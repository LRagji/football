import { StandingsService } from "../src/services/standings-service";
import { StandingsRepo } from "../src/repos/standings-repo";
import { IEnvConfig } from "../src/interfaces/i-env-config";
import { ILogger } from "../src/interfaces/i-logger";
import { IStandingRecord } from "../src/interfaces/i-standing-record";
import { MCountry } from "../src/models/m-country";
import { MLeague } from "../src/models/m-league";
import { MStandings } from "../src/models/m-standings";
import { MTeam } from "../src/models/m-team";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import Sinon from "sinon";

describe("StandingsService", () => {
    let standingsService: StandingsService;
    let logger: ILogger;
    let appConfig: IEnvConfig;
    let standingsRepo: StandingsRepo;

    beforeEach(() => {
        Sinon.reset();
        logger = {
            debug: Sinon.stub(),
            log: Sinon.stub(),
            error: Sinon.stub()
        };
        appConfig = {
            UpstreamAPI: "https://example.com/api",
            UpstreamAPIKey: "API_KEY",
            ApplicationPort: 3000,
            CacheDuration: 300
        };
        standingsRepo = Sinon.createStubInstance(StandingsRepo);
        standingsService = new StandingsService(logger, appConfig, standingsRepo);
    });

    describe("getStandingsByCountryName", () => {
        it("should return standings records for a given country name", async () => {
            const countryName = "Country 1";
            const expectedStandings: IStandingRecord[] = [
                {
                    countryID: "1",
                    leagueID: "1",
                    teamID: "1",
                    countryName: "Country 1",
                    leagueName: "League 1",
                    teamName: "Team 1",
                    overallLeaguePosition: "1"
                },
                {
                    countryID: "1",
                    leagueID: "1",
                    teamID: "2",
                    countryName: "Country 1",
                    leagueName: "League 1",
                    teamName: "Team 2",
                    overallLeaguePosition: "2"
                },
                {
                    countryID: "1",
                    leagueID: "1",
                    teamID: "3",
                    countryName: "Country 1",
                    leagueName: "League 1",
                    teamName: "Team 3",
                    overallLeaguePosition: "3"
                }
            ];

            (standingsRepo.fetchData as Sinon.SinonStub).callsFake(async (action: string, actionParamName?: string, actionParamValue?: string) => {
                switch (action) {
                    case "get_countries":
                        return [
                            new MCountry("1", "Country 1"),
                            new MCountry("2", "Country 2"),
                            new MCountry("3", "Country 3")
                        ];
                    case "get_leagues":
                        if (actionParamName === "country_id" && actionParamValue === "1") {
                            return [
                                new MLeague("1", "League 1"),
                                new MLeague("2", "League 2"),
                                new MLeague("3", "League 3"),
                            ];
                        }
                        else {
                            return [];
                        }
                    case "get_teams":
                        if (actionParamName === "league_id" && actionParamValue === "1") {
                            return [
                                new MTeam("1", "Team 1"),
                                new MTeam("2", "Team 2"),
                                new MTeam("3", "Team 3"),
                            ];
                        }
                        else {
                            return [];
                        }
                    case "get_standings":
                        if (actionParamName === "league_id" && actionParamValue === "1") {
                            return [
                                new MStandings("1", "1"),
                                new MStandings("2", "2"),
                                new MStandings("3", "3")
                            ];
                        }
                        else {
                            return [];
                        }
                    default:
                        return [];
                }
            })

            const result = await standingsService.getStandingsByCountryName(countryName);

            assert.deepStrictEqual(result, expectedStandings);
            const expectedCalls = [
                ["get_countries"],
                ["get_leagues", "country_id", "1"],
                ["get_teams", "league_id", "1"],
                ["get_standings", "league_id", "1"],
                ["get_teams", "league_id", "2"],
                ["get_standings", "league_id", "2"],
                ["get_teams", "league_id", "3"],
                ["get_standings", "league_id", "3"],
                ["get_leagues", "country_id", "2"],
                ["get_leagues", "country_id", "3"]
            ];
            assert.deepStrictEqual(expectedCalls, (standingsRepo.fetchData as Sinon.SinonStub).getCalls().map(p => p.args))
        });
    });

    // describe("getStandingsByLeaugeName", () => {
    //     it("should return standings records for a given league name", async () => {
    //         const leagueName = "League 1";
    //         const expectedStandings: IStandingRecord[] = [
    //             {
    //                 countryID: "1",
    //                 leagueID: "1",
    //                 teamID: "1",
    //                 countryName: "Country 1",
    //                 leagueName: "League 1",
    //                 teamName: "Team 1",
    //                 overallLeaguePosition: "1"
    //             },
    //             {
    //                 countryID: "1",
    //                 leagueID: "1",
    //                 teamID: "2",
    //                 countryName: "Country 1",
    //                 leagueName: "League 1",
    //                 teamName: "Team 2",
    //                 overallLeaguePosition: "2"
    //             }
    //         ];

    //         Sinon.stub(standingsService, "queryByIndex").resolves(expectedStandings);

    //         const result = await standingsService.getStandingsByLeaugeName(leagueName);

    //         assert.deepStrictEqual(result, expectedStandings);
    //         Sinon.assert.calledOnceWithExactly(standingsService.queryByIndex, 1, leagueName);
    //     });
    // });

    // describe("getStandingsByTeamName", () => {
    //     it("should return standings records for a given team name", async () => {
    //         const teamName = "Team 1";
    //         const expectedStandings: IStandingRecord[] = [
    //             {
    //                 countryID: "1",
    //                 leagueID: "1",
    //                 teamID: "1",
    //                 countryName: "Country 1",
    //                 leagueName: "League 1",
    //                 teamName: "Team 1",
    //                 overallLeaguePosition: "1"
    //             },
    //             {
    //                 countryID: "2",
    //                 leagueID: "2",
    //                 teamID: "1",
    //                 countryName: "Country 2",
    //                 leagueName: "League 2",
    //                 teamName: "Team 1",
    //                 overallLeaguePosition: "1"
    //             }
    //         ];

    //         Sinon.stub(standingsService, "queryByIndex").resolves(expectedStandings);

    //         const result = await standingsService.getStandingsByTeamName(teamName);

    //         assert.deepStrictEqual(result, expectedStandings);
    //         Sinon.assert.calledOnceWithExactly(standingsService.queryByIndex, 2, teamName);
    //     });
    // });

    // describe("getAllStandings", () => {
    //     it("should return all standings records", async () => {
    //         const expectedStandings: IStandingRecord[] = [
    //             {
    //                 countryID: "1",
    //                 leagueID: "1",
    //                 teamID: "1",
    //                 countryName: "Country 1",
    //                 leagueName: "League 1",
    //                 teamName: "Team 1",
    //                 overallLeaguePosition: "1"
    //             },
    //             {
    //                 countryID: "1",
    //                 leagueID: "1",
    //                 teamID: "2",
    //                 countryName: "Country 1",
    //                 leagueName: "League 1",
    //                 teamName: "Team 2",
    //                 overallLeaguePosition: "2"
    //             },
    //             {
    //                 countryID: "2",
    //                 leagueID: "2",
    //                 teamID: "1",
    //                 countryName: "Country 2",
    //                 leagueName: "League 2",
    //                 teamName: "Team 1",
    //                 overallLeaguePosition: "1"
    //             }
    //         ];

    //         Sinon.stub(standingsService, "fillDataContainer");
    //         Sinon.stub(standingsService.standingsTable, "getAll").returns(new Map(Object.entries(expectedStandings)));

    //         const result = await standingsService.getAllStandings();

    //         assert.deepStrictEqual(result, expectedStandings);
    //         Sinon.assert.calledOnce(standingsService.fillDataContainer);
    //     });
    // });
});