export class MStandings {
    constructor(public readonly overallLeaguePosition: string, public readonly teamID: string) { }

    public static from(row: Record<string, string>): MStandings {
        return new MStandings(row['overall_league_position'], row['team_id']);
    }
}