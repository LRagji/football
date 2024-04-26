import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import express from 'express';
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from './swagger.json';
import { ApplicationConfig } from './configs/application-config';
import { ConsoleLogger } from './configs/console-logger';
import { InMemoryTypedCache } from './repos/in-memory-typed-cache';
import { StandingsController } from './controllers/standings-controller';
import { StandingsService } from './services/standings-service';
import { PerishableData } from './interfaces/i-perishable-data';
import { StandingsRoute } from './routes/standings-route';
import { IStandings } from './interfaces/i-standings';

const app: express.Express = express();
const appConfig = new ApplicationConfig();
const appLogger = new ConsoleLogger();

const inMemoryRepo = new InMemoryTypedCache<PerishableData<IStandings[]>>();
const service = new StandingsService(appLogger, appConfig, inMemoryRepo);
const controller = new StandingsController(service);
const route = new StandingsRoute(app, appLogger, controller);

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

route.addRoutes();

async function appStartup() {
    try {
        await new Promise<void>((resolve) => app.listen(appConfig.ApplicationPort, resolve));
        appLogger.log(`Listening on port: ${appConfig.ApplicationPort}`)
    } catch (err) {
        appLogger.error(`Startup failed`, err);
        //Dispose objects
    }
}

appStartup()
    .catch((err) => {
        appLogger.error(`Unhandled exception in main`, err);
    });