export class MCountry {

    constructor(public readonly countryID: string, public readonly countryName: string) { }

    public static from(row: Record<string, string>): MCountry {
        return new MCountry(row['country_id'], row['country_name']);
    }
}