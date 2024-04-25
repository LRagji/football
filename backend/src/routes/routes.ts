import { Express, Request, RequestHandler, Response } from "express";
import { ILogger } from "../interfaces/i-logger";

export abstract class Routes {

    constructor(private readonly logger: ILogger) { };

    public abstract addRoutes(): void;

    public addGetRoutes(app: Express, path: string, controllerCallback: (expressReq: Request, expressRes: Response) => Promise<void>): void {
        app.get(path, (req, res) => this.exceptionHandler(req, res, path, controllerCallback));
    }

    private async exceptionHandler(req: Request, res: Response, path: string, controllerCallback: (expressReq: Request, expressRes: Response) => Promise<void>) {
        try {
            await controllerCallback(req, res);
        } catch (err) {
            this.logger.error(`Unhandled exception occured on ${path}`, err);
            const unhandledexception = {
                apistatus: 500,
                err: [{
                    errcode: 500,
                    errmsg: `Unhandled exception occured, please retry your request.`
                }]
            };
            res.status(500)
                .send(unhandledexception);
        }
    }
}