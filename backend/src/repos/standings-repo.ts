import { IEnvConfig } from "../interfaces/i-env-config";
import { ILogger } from "../interfaces/i-logger";
import { MCountry } from "../models/m-country";
import { MLeague } from "../models/m-league";
import { MStandings } from "../models/m-standings";
import { MTeam } from "../models/m-team";

export class StandingsRepo {

    private readonly apiWatchdogs = new Map<string, Promise<Response>>();

    constructor(private readonly appConfig: IEnvConfig, private readonly logger: ILogger) { }

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
        let response: Response;
        try {
            response = await apiCall;
        }
        catch (err) {
            this.logger.error(`Fetch Error`, err);
            response = new Response();
        }
        finally {
            this.apiWatchdogs.delete(action);
        }

        if (response.ok === false) {
            const msg = `Failed to fetch data from Upstream API(${action}) return status:${response.status}`;
            this.logger.debug(msg);
            //throw new Error(msg);
            response.json = () => Promise.resolve([]);
        }

        let data = await response.json() as Record<string, string>[] | Record<string, string>;
        if (!Array.isArray(data)) {
            const msg = `Failed to fetch data from Upstream API(${action}): ${data["message"]}`;
            this.logger.debug(msg);
            //throw new Error(msg);
            data = [];

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