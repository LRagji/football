export interface ILogger {
    log(msg: string): void;
    error(msg: string, error: any): void;
    debug(msg: string): void;
}