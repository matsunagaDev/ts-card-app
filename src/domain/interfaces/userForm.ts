export interface UserForm {
  user_id: string;
  name: string;
  description: string;
  skillIds: number[]; // string[]からnumber[]に変更
  githubId?: string | null;
  qiitaId?: string | null;
  xId?: string | null;
}
