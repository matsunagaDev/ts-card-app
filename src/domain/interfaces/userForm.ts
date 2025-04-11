export interface UserForm {
  user_id: string;
  name: string;
  description: string;
  skillIds: string[]; // 配列型に変更して複数のスキルIDを受け取れるように
  githubId?: string | null;
  qiitaId?: string | null;
  xId?: string | null;
}
