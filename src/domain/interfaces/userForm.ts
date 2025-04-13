export class UserForm {
  constructor(
    public user_id: string,
    public name: string,
    public description: string,
    public skillIds: Array<number>, // string[]からnumber[]に変更
    public githubId?: string | null,
    public qiitaId?: string | null,
    public xId?: string | null
  ) {}
}
