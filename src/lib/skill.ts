import { Skill } from '../domain/skill';
import { supabase } from '../utils/supabase.ts';

export const getSkillsByUserId = async (userId: string): Promise<Skill[]> => {
  const { data: userSkills, error: userSkillsError } = await supabase
    .from('user_skills')
    .select('skill_id')
    .eq('user_id', userId);

  if (userSkillsError) throw userSkillsError;

  const skillIds = userSkills.map((us) => us.skill_id);

  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('*')
    .in('skill_id', skillIds);

  if (skillsError) throw skillsError;

  return skills.map((skill) =>
    Skill.newSkill(skill.skill_id, skill.name, skill.category)
  );
};
