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
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router';
import { UserForm } from '../domain/interfaces/userForm';
import { createUser } from '../lib/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { userFormSchema } from '../validations/schemas/userFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export const Register = () => {
  const navigate = useNavigate();
  const [skills, setSkill] = useState<Skill[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    defaultValues: {
      user_id: '',
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

  const onSubmitUser = async (data: UserForm) => {
    try {
      console.log('ユーザー登録:', data);
      // 送信中はローディング状態を維持
      const newUser = await createUser(data);

      console.log('新規登録したユーザー:', newUser);

      // navigate('/');
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // useEffectでコンポーネントマウント時にスキルを取得
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const allSkills = await AllSkills();
        setSkill(allSkills || []);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setSkill([]);
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
                  <FormLabel>好きな英単語</FormLabel>
                  <Input
                    autoFocus
                    placeholder="英単語を入力"
                    {...register('user_id')}
                    isInvalid={!!errors.user_id}
                  />
                  {errors.user_id && (
                    <Text color="red.500" fontSize="sm">
                      {errors.user_id.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>名前</FormLabel>
                  <Input
                    placeholder="名前を入力"
                    {...register('name')}
                    isInvalid={!!errors.name}
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">
                      {errors.name.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>自己紹介</FormLabel>
                  <Textarea
                    placeholder="<h1>タグも使用可能です</h1>"
                    {...register('description')}
                    isInvalid={!!errors.description}
                  />
                  {errors.description && (
                    <Text color="red.500" fontSize="sm">
                      {errors.description.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>スキル</FormLabel>
                  <Select
                    variant="outline"
                    placeholder="選択してください"
                    {...register('skillId')}
                    isInvalid={!!errors.skillId}
                  >
                    {Array.isArray(skills) &&
                      skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                  </Select>
                  {errors.skillId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.skillId.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>GitHub ID</FormLabel>
                  <Input
                    {...register('githubId')}
                    isInvalid={!!errors.githubId}
                  />
                  {errors.githubId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.githubId.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>Qiita ID</FormLabel>
                  <Input
                    {...register('qiitaId')}
                    isInvalid={!!errors.qiitaId}
                  />
                  {errors.qiitaId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.qiitaId.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>X ID</FormLabel>
                  <Input {...register('xId')} isInvalid={!!errors.xId} />
                  {errors.xId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.xId.message}
                    </Text>
                  )}
                </Box>
              </Stack>
            </CardBody>
            {/* フォームの送信ボタン */}
            <CardFooter>
              <Box mt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  w="100%"
                  isLoading={isSubmitting}
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
