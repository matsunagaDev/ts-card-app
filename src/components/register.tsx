import { Skill } from '../domain/skill';
import { AllSkills } from '../lib/skill';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserForm } from '../domain/interfaces/userForm';
import { createUser } from '../lib/user';
import { useForm, SubmitHandler } from 'react-hook-form';
import { userFormSchema } from '../validations/schemas/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export const Register = () => {
  const [skills, setSkill] = useState<Skill[] | null>([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      skillId: '',
      githubId: '',
      qiitaId: '',
      xId: '',
    },
    mode: 'onChange',
    resolver: zodResolver(userFormSchema),
  });

  // フォーム送信
  const onSubmitUser = async (data: UserForm) => {
    try {
      console.log(data);
      await createUser(data);
      navigate('/');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // useEffectでコンポーネントマウント時にスキルを取得
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const allSkills = await AllSkills();
        if (!allSkills) {
          console.log('スキルが取得できませんでした');
          return;
        }
        setSkill(allSkills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  /**
   * 画面表示
   */
  return (
    <>
      <Flex alignItems={'center'} justifyContent={'center'} h={'100vh'}>
        <Card maxW="400px">
          <form onSubmit={handleSubmit(onSubmitUser)}>
            <CardHeader>
              <Heading size="md" textAlign="center">
                新規登録
              </Heading>
            </CardHeader>

            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text>好きな英単語</Text>
                  <Input
                    autoFocus
                    placeholder="英単語を入力"
                    {...(register('id'), { required: true })}
                  />
                </Box>
                <Box>
                  <Text>名前</Text>
                  <Input
                    placeholder="名前を入力"
                    {...(register('name'), { required: true })}
                  />
                </Box>
                <Box>
                  <Text>自己紹介</Text>
                  <Textarea
                    placeholder="<h1>タグも使用可能です</h1>"
                    {...(register('description'), { required: true })}
                  />
                </Box>
                <Box>
                  <Text>スキル</Text>
                  <Select
                    variant="outline"
                    placeholder="選択してください"
                    name="skillId"
                  >
                    {skills?.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Text>GitHub ID</Text>
                  <Input {...register('githubId')} />
                </Box>
                <Box>
                  <Text>Qiita ID</Text>
                  <Input {...register('qiitaId')} />
                </Box>
                <Box>
                  <Text>X ID</Text>
                  <Input {...register('xId')} />
                </Box>
              </Stack>
            </CardBody>
            <CardFooter>
              <Box mt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  w="100%"
                  onClick={handleSubmit(onSubmitUser)}
                >
                  登録
                </Button>
              </Box>
              <Box mt={4}>
                <Button
                  colorScheme="orange"
                  variant="outline"
                  w="100%"
                  onClick={() => navigate(-1)}
                >
                  戻る
                </Button>
              </Box>
            </CardFooter>
          </form>
        </Card>
      </Flex>
    </>
  );
};
