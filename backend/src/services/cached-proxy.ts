import { IEnvConfig } from "../interfaces/i-env-config";
import { ILogger } from "../interfaces/i-logger";
import { PerishableData } from "../interfaces/i-perishable-data";
import { TypedKeyValueRepo } from "../interfaces/i-typed-key-value-repo";

export class CachedProxy {

    private activeCallWatchdog: Promise<object[]> | undefined;

    constructor(
        private readonly logger: ILogger,
        private readonly appConfig: IEnvConfig,
        private readonly cache: TypedKeyValueRepo<PerishableData<object[]>>) {
    }

    public async fetchStandings(cacheKey = 'standings'): Promise<object[]> {
        const cachedData = await this.cache.get(cacheKey);
        if (cachedData !== undefined && (Date.now() - cachedData.expiry) < this.appConfig.CacheDuration) {
            this.logger.debug(`Cache hit for ${cacheKey}`);
            return cachedData.data;
        }

        this.logger.debug(`Cache miss for ${cacheKey}`);

        if (this.activeCallWatchdog === undefined) {
            this.logger.debug(`Initiating a new call`);
            this.activeCallWatchdog = this.fetchData();
        }

        const data = await this.activeCallWatchdog;
        await this.cache.set(cacheKey, { data: data, expiry: Date.now() });
        this.activeCallWatchdog = undefined;
        return data;
    }

    private async fetchData(): Promise<object[]> {
        this.logger.debug('Fetching data');
        return new Promise<object[]>((resolve) => {
            setTimeout(() => {
                resolve(
                    [
                        {
                            "country_name": "England",
                            "league_id": "152",
                            "league_name": "Premier League",
                            "team_id": "141",
                            "team_name": "Arsenal",
                            "overall_promotion": "Promotion - Champions League (Group Stage: )",
                            "overall_league_position": "1",
                            "overall_league_payed": "0",
                            "overall_league_W": "0",
                            "overall_league_D": "0",
                            "overall_league_L": "0",
                            "overall_league_GF": "0",
                            "overall_league_GA": "0",
                            "overall_league_PTS": "0",
                            "home_league_position": "1",
                            "home_promotion": "",
                            "home_league_payed": "0",
                            "home_league_W": "0",
                            "home_league_D": "0",
                            "home_league_L": "0",
                            "home_league_GF": "0",
                            "home_league_GA": "0",
                            "home_league_PTS": "0",
                            "away_league_position": "1",
                            "away_promotion": "",
                            "away_league_payed": "0",
                            "away_league_W": "0",
                            "away_league_D": "0",
                            "away_league_L": "0",
                            "away_league_GF": "0",
                            "away_league_GA": "0",
                            "away_league_PTS": "0",
                            "league_round": "",
                            "team_badge": "https://apiv3.apifootball.com/badges/141_arsenal.jpg",
                            "fk_stage_key": "6",
                            "stage_name": "Current"
                        },
                        {
                            "country_name": "England",
                            "league_id": "152",
                            "league_name": "Premier League",
                            "team_id": "3088",
                            "team_name": "Aston Villa",
                            "overall_promotion": "Promotion - Champions League (Group Stage: )",
                            "overall_league_position": "2",
                            "overall_league_payed": "0",
                            "overall_league_W": "0",
                            "overall_league_D": "0",
                            "overall_league_L": "0",
                            "overall_league_GF": "0",
                            "overall_league_GA": "0",
                            "overall_league_PTS": "0",
                            "home_league_position": "2",
                            "home_promotion": "",
                            "home_league_payed": "0",
                            "home_league_W": "0",
                            "home_league_D": "0",
                            "home_league_L": "0",
                            "home_league_GF": "0",
                            "home_league_GA": "0",
                            "home_league_PTS": "0",
                            "away_league_position": "2",
                            "away_promotion": "",
                            "away_league_payed": "0",
                            "away_league_W": "0",
                            "away_league_D": "0",
                            "away_league_L": "0",
                            "away_league_GF": "0",
                            "away_league_GA": "0",
                            "away_league_PTS": "0",
                            "league_round": "",
                            "team_badge": "https://apiv3.apifootball.com/badges/3088_aston-villa.jpg",
                            "fk_stage_key": "6",
                            "stage_name": "Current"
                        }
                    ]
                );
            }, 2000);
        });
    }
}