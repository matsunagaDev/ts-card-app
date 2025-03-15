export class UserSkill {
  constructor(
    public id: string, // UserSkillレコードの一意のID
    public user_id: string, // 紐付くユーザーのID
    public skill_id: string, // 紐付くスキルのID
    public created_at: string // レコード作成日時
  ) {}

  public static newUserSkill(
    id: string,
    user_id: string,
    skill_id: string,
    created_at: string
  ): UserSkill {
    // ここの`: UserSkill`が戻り値の型を示している
    return new UserSkill(id, user_id, skill_id, created_at);
  }
}
