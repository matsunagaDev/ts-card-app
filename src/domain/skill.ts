export class Skill {
  constructor(
    public id: string,
    public name: string,
    public created_at: string
  ) {}

  public static newSkill(id: string, name: string, created_at: string): Skill {
    return new Skill(id, name, created_at);
  }
}
