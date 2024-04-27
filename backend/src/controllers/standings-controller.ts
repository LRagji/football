import { IEnvConfig } from "../interfaces/i-env-config";
import { IStandingRecord } from "../interfaces/i-standing-record";
import { StandingsService } from "../services/standings-service";
import { Request, Response } from "express";

export class StandingsController {

    constructor(private readonly service: StandingsService, private readonly appconfig: IEnvConfig) { }

    public async fetchStandings(req: Request, res: Response): Promise<void> {

        const filterCountryName = req.query['countryName'];
        const filterLeagueName = req.query['leagueName'];
        const filterTeamName = req.query['teamName'];
        let data: IStandingRecord[];

        if (filterCountryName === undefined && filterLeagueName === undefined && filterTeamName === undefined) {
            data = await this.service.getAllStandings();
        }
        else if (filterCountryName !== undefined) {
            data = await this.service.getStandingsByCountryName(filterCountryName as string);
        } else if (filterLeagueName !== undefined) {
            data = await this.service.getStandingsByLeaugeName(filterLeagueName as string);
        } else if (filterTeamName !== undefined) {
            data = await this.service.getStandingsByTeamName(filterTeamName as string);
        }
        else {
            res.status(400).send('Invalid or missing query parameters');
            return;
        }

        const offset = Math.round(Math.abs(Number(req.query?.offset || '0')));
        const limit = Math.round(Math.abs(Number(req.query?.limit || '100')));

        const page = data.slice(offset, offset + limit);

        res.set(`Cache-Control', 'public, max-age=${this.appconfig.CacheDuration / 1000}`);

        res.status((offset + limit) < data.length ? 206 : 200)
            .send(page);
    }
}