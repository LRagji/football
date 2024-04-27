import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import express from 'express';
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from './swagger.json';
import { ApplicationConfig } from './configs/application-config';
import { ConsoleLogger } from './configs/console-logger';
import { StandingsController } from './controllers/standings-controller';
import { StandingsService } from './services/standings-service';
import { StandingsRoute } from './routes/standings-route';
import { StandingsRepo } from './repos/standings-repo';

const app: express.Express = express();
const appConfig = new ApplicationConfig();
const appLogger = new ConsoleLogger();

const repo = new StandingsRepo(appConfig, appLogger);
const service = new StandingsService(appLogger, appConfig, repo);
const controller = new StandingsController(service, appConfig);
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