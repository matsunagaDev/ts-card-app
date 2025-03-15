export class User {
  constructor(
    public user_id: string,
    public name: string,
    public description: string,
    public github_id: string,
    public qiita_id: string,
    public x_id: string,
    public created_at: string
  ) {}

  public static newUser(
    user_id: string,
    name: string,
    description: string,
    github_id: string,
    qiita_id: string,
    x_id: string,
    created_at: string
  ): User {
    return new User(
      user_id,
      name,
      description,
      github_id,
      qiita_id,
      x_id,
      created_at
    );
  }
}
