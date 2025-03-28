import { z } from 'zod';

export const userFormSchema = z.object({
  id: z
    .string()
    .nonempty('IDは必須です')
    .min(3, 'IDは3文字以上で入力してください'),
  name: z
    .string()
    .nonempty('名前は必須です')
    .min(5, '名前は5文字以上で入力してください')
    .max(50, '名前は50文字以内で入力してください'),
  description: z
    .string()
    .min(1, '自己紹介は必須です')
    .max(1000, '自己紹介は1000文字以内で入力してください'),
  skillId: z.string().nonempty('スキルは必須です'),
  githubId: z.string().nullable(),
  qiitaId: z.string().nullable(),
  xId: z.string().nullable(),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
