import { IndexedTable } from "../ds/indexed-table";
import { ICellValue } from "../interfaces/i-cell-value";
import { IEnvConfig } from "../interfaces/i-env-config";
import { ILogger } from "../interfaces/i-logger";
import { IStandingRecord } from "../interfaces/i-standing-record";
import { MCountry } from "../models/m-country";
import { MLeague } from "../models/m-league";
import { MStandings } from "../models/m-standings";
import { MTeam } from "../models/m-team";
import { StandingsRepo } from "../repos/standings-repo";

export class StandingsService {

    private lastUpdated: number = 0;
    private readonly standingsTable = new IndexedTable([0, 1, 2]);//countryName,leagueName,teamName

    constructor(
        private readonly logger: ILogger,
        private readonly appConfig: IEnvConfig,
        private readonly repo: StandingsRepo) {
    }

    public async getStandingsByCountryName(countryName: string): Promise<IStandingRecord[]> {
        return this.queryByIndex(0, countryName);
    }
    public async getStandingsByLeaugeName(leagueName: string): Promise<IStandingRecord[]> {
        return this.queryByIndex(1, leagueName);
    }
    public async getStandingsByTeamName(teamName: string): Promise<IStandingRecord[]> {
        return this.queryByIndex(2, teamName);
    }
    public async getAllStandings(): Promise<IStandingRecord[]> {
        if ((Date.now() - this.lastUpdated) > this.appConfig.CacheDuration) await this.fillDataContainer();
        return Array.from(this.standingsTable.getAll().values())
            .map((props) => {
                return this.rowTransform(props);
            });
    }

    private async queryByIndex(indexCol: number, indexKey: string): Promise<IStandingRecord[]> {
        if ((Date.now() - this.lastUpdated) > this.appConfig.CacheDuration) await this.fillDataContainer();
        return Array.from(this.standingsTable.getByIndex(indexCol, indexKey) || [])
            .map((rowId) => {
                const props = (this.standingsTable.get(rowId) || []);
                return this.rowTransform(props);
            });
    }

    private rowTransform(props: ICellValue[]): IStandingRecord {
        return {
            countryID: props[0]?.Data.countryID || "",
            leagueID: props[1]?.Data.leagueID || "",
            teamID: props[2]?.Data.teamID || "",
            countryName: props[0]?.IndexKey || "",
            leagueName: props[1]?.IndexKey || "",
            teamName: props[2]?.IndexKey || "",
            overallLeaguePosition: props[3]?.IndexKey || ""
        }
    }

    private async fillDataContainer(): Promise<void> {
        const countries = await this.repo.fetchData<MCountry>(`get_countries`);
        for (const country of countries) {
            const leagues = await this.repo.fetchData<MLeague>(`get_leagues`, `country_id`, country.countryID);
            for (const league of leagues) {
                const teams = await this.repo.fetchData<MTeam>(`get_teams`, `league_id`, league.leagueID);
                const standings = await this.repo.fetchData<MStandings>(`get_standings`, `league_id`, league.leagueID);

                for (const standing of standings) {
                    for (const team of teams) {
                        if (team.teamID === standing.teamID) {
                            this.standingsTable.upsert([
                                { IndexKey: country.countryName, Data: country },
                                { IndexKey: league.leagueName, Data: league },
                                { IndexKey: team.teamName, Data: team },
                                { IndexKey: standing.overallLeaguePosition, Data: standing }
                            ]);
                        }
                    }
                }

            }
        }
        this.lastUpdated = Date.now();
    }
}