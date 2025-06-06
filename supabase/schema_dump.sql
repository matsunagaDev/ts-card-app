-- テーブル: public.users
DROP TABLE IF EXISTS public.user_skill;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.skills;

CREATE TABLE public.users (
  user_id VARCHAR NOT NULL,
  name VARCHAR,
  description TEXT,
  github_id VARCHAR,
  qiita_id VARCHAR,
  x_id VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

-- テーブル: public.skills
CREATE TABLE public.skills (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  name VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);

-- テーブル: public.user_skill
CREATE TABLE public.user_skill (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  user_id VARCHAR NOT NULL,
  skill_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_skill_pkey PRIMARY KEY (id),
  CONSTRAINT user_skill_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT user_skill_skill_id_fkey FOREIGN KEY (skill_id)
    REFERENCES public.skills (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
);
