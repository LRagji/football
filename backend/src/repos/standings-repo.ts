import { IEnvConfig } from "../interfaces/i-env-config";
import { MCountry } from "../models/m-country";
import { MLeague } from "../models/m-league";
import { MStandings } from "../models/m-standings";
import { MTeam } from "../models/m-team";

export class StandingsRepo {

    private readonly apiWatchdogs = new Map<string, Promise<Response>>();

    constructor(private readonly appConfig: IEnvConfig) { }

    public async fetchData<T extends MTeam | MLeague | MCountry | MStandings>(action: string, actionParamName?: string, actionParamValue?: string): Promise<T[]> {

        const upstreamUrl = new URL(this.appConfig.UpstreamAPI);
        upstreamUrl.searchParams.append(`action`, action);
        upstreamUrl.searchParams.append(`APIkey`, this.appConfig.UpstreamAPIKey);
        if (actionParamName !== undefined && actionParamValue !== undefined) {
            upstreamUrl.searchParams.append(actionParamName, actionParamValue);
        }

        let apiCall = this.apiWatchdogs.get(action)
        if (apiCall === undefined) {
            apiCall = fetch(upstreamUrl);
            this.apiWatchdogs.set(action, apiCall);
        }

        const response = await apiCall;
        this.apiWatchdogs.delete(action);

        if (response.ok === false) {
            throw new Error(`Failed to fetch data from Upstream API(${action}) return status:${response.status}`);
        }

        const data = await response.json() as Record<string, string>[] | Record<string, string>;
        if (!Array.isArray(data)) {
            throw new Error(`Failed to fetch data from Upstream API(${action}): ${data["message"]}`);
        }

        return data.map((row) => {
            switch (action) {
                case `get_countries`:
                    return MCountry.from(row) as T;
                case `get_leagues`:
                    return MLeague.from(row) as T;
                case `get_teams`:
                    return MTeam.from(row) as T;
                case `get_standings`:
                    return MStandings.from(row) as T;
                default:
                    throw new Error(`Unknown action ${action}`);
            }
        });
    }
}