export class MTeam {

    public constructor(public readonly teamID: string, public readonly teamName: string) { }

    public static from(row: Record<string, string>): MTeam {
        return new MTeam(row['team_key'], row['team_name']);
    }
}