import { ILogger } from "../interfaces/i-logger";

export class ConsoleLogger implements ILogger {

    public log(msg: string): void {
        console.log(msg);
    }
    public error(msg: string, error: any): void {
        console.error(msg);
        console.error(error);
    }
    debug(msg: string): void {
        console.debug(msg);
    }

}