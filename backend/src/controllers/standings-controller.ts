import { CachedProxy } from "../services/cached-proxy";
import { Request, Response } from "express";

export class StandingsController {

    constructor(private readonly service: CachedProxy) { }

    public async fetchStandings(req: Request, res: Response): Promise<void> {

        const filterPrefix = `f-`;
        let data = await this.service.fetchStandings();

        const filters = Object.keys(req.query)
            .filter(p => p.startsWith(filterPrefix))
            .map(p => p.substring(filterPrefix.length));

        if (filters.length > 0) {
            data = data.filter(obj => filters.some((propKey) => obj[propKey] === req.query[propKey]) !== null);
        }

        const offset = Number(req.query?.offset || '0');
        const limit = Number(req.query?.limit || '100');

        const page = data.slice(offset, offset + limit);

        res.sendStatus((offset + limit) - 1 < data.length ? 206 : 200)
            .send(page);
    }
}