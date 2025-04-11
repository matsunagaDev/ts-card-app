import { Skill } from '../domain/skill';
import { AllSkills } from '../lib/skill';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  userFormSchema,
  UserFormSchemaType,
} from '../validations/schemas/userFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export const Register = () => {
  const navigate = useNavigate();
  const [skills, setSkill] = useState<Skill[]>([]); // フォームのチェックボックス

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormSchemaType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      user_id: '',
      name: '',
      description: '',
      skillIds: [], // 配列として初期化
      githubId: '',
      qiitaId: '',
      xId: '',
    },
    mode: 'onChange',
  });

  const onSubmitUser: SubmitHandler<UserFormSchemaType> = async (data) => {
    try {
      // チェックボックスの値を文字列配列に変換
      const skillIds = data.skillIds.map(String);

      const formData = {
        ...data,
        skillIds: skillIds,
      };

      console.log('送信データ:', formData);

      // const response = await createUser(formData);
      // console.log('登録成功:', response);
      // navigate('/');
    } catch (error) {
      console.error('登録エラー:', error);
    }
  };

  // バリデーションエラーの監視
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('バリデーションエラー:', errors);
    }
  }, [errors]);

  // スキルの初期表示
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
                  <Controller
                    name="skillIds"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <CheckboxGroup
                        colorScheme="blue"
                        value={value || []}
                        onChange={(vals) =>
                          // チェックボックスの値を配列として取得
                          onChange(vals.map(Number))
                        }
                      >
                        <Stack spacing={[1, 2]} direction={['column']}>
                          {Array.isArray(skills) &&
                            skills.map((skill) => (
                              <Checkbox key={skill.id} value={skill.id}>
                                {skill.name}
                              </Checkbox>
                            ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                  />
                  {errors.skillIds && (
                    <Text color="red.500" fontSize="sm">
                      {errors.skillIds.message}
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
                  onClick={(e) => {
                    // preventDefault()は不要なので削除
                    console.log('送信ボタンクリック');
                  }}
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
