import { Express } from "express";
import { Routes } from "./routes";
import { StandingsController } from "../controllers/standings-controller";
import { ILogger } from "../interfaces/i-logger";

export class StandingsRoute extends Routes {

    constructor(private readonly app: Express, appLogger: ILogger, private readonly standingsController: StandingsController) { super(appLogger) };

    public override addRoutes(): void {
        super.addGetRoutes(this.app, `/v1/standings`, this.standingsController.fetchStandings.bind(this.standingsController));
    }
}