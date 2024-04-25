export interface PerishableData<T> {
    expiry: number;
    data: T;
}