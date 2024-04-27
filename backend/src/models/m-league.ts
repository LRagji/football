export class MLeague {

    constructor(public readonly leagueID: string, public readonly leagueName: string) { }

    public static from(row: Record<string, string>): MLeague {
        return new MLeague(row['league_id'], row['league_name']);
    }
}