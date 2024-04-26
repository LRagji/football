import { StandingsService } from "../services/standings-service";
import { Request, Response } from "express";

export class StandingsController {

    constructor(private readonly service: StandingsService) { }

    public async fetchStandings(req: Request, res: Response): Promise<void> {

        const filterPrefix = `f-`;
        let data = await this.service.fetchStandings();

        const filters = Object.keys(req.query)
            .filter(p => p.startsWith(filterPrefix))
            .map(p => p.substring(filterPrefix.length));

        if (filters.length > 0) {
            data = data.filter(obj => filters.some((propKey) => obj[propKey] === req.query[filterPrefix + propKey]));
        }

        const offset = Math.round(Math.abs(Number(req.query?.offset || '0')));
        const limit = Math.round(Math.abs(Number(req.query?.limit || '100')));

        const page = data.slice(offset, offset + limit);

        res.set('Cache-Control', 'public, max-age=3600'); // 1 hour

        res.status((offset + limit) < data.length ? 206 : 200)
            .send(page);
    }
}