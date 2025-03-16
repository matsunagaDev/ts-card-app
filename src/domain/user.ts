import { Skill } from './skill';

export class User {
  constructor(
    public user_id: string,
    public name: string,
    public description: string,
    public skills: Skill[], // Array<Skill>よりもSkill[]の方が推奨
    public github_id: string,
    public qiita_id: string,
    public x_id: string,
    public created_at: string
  ) {}

  // createUserファクトリーメソッドを追加
  public static newUser(
    user_id: string,
    name: string,
    description: string,
    skills: Skill[],
    github_id: string,
    qiita_id: string,
    x_id: string,
    created_at: string
  ): User {
    return new User(
      user_id,
      name,
      description,
      skills,
      User.githubAccount(github_id),
      User.qiitaAccount(qiita_id),
      User.xAccount(x_id),
      created_at
    );
  }

  public static githubAccount(github_id: string): string {
    return `https://github.com/${github_id}`;
  }

  public static qiitaAccount(qiita_id: string): string {
    return `https://qiita.com/${qiita_id}`;
  }

  public static xAccount(x_id: string): string {
    return `https://x.com/${x_id}`;
  }
}
