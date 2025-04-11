import { z } from 'zod';

export const userFormSchema = z.object({
  user_id: z
    .string()
    .nonempty('IDは必須です')
    .min(3, 'IDは3文字以上で入力してください')
    .regex(/^[a-zA-Z]+$/, 'IDは英単語のみ使用できます'),
  name: z
    .string()
    .nonempty('名前は必須です')
    .max(50, '名前は50文字以内で入力してください'),
  description: z
    .string()
    .min(1, '自己紹介は必須です')
    .max(1000, '自己紹介は1000文字以内で入力してください'),
  skillIds: z.array(z.string()).min(1, 'スキルは1つ以上選択してください'),
  githubId: z.string().nullable().optional(),
  qiitaId: z.string().nullable().optional(),
  xId: z.string().nullable().optional(),
});

export type UserFormSchemaType = z.infer<typeof userFormSchema>;
