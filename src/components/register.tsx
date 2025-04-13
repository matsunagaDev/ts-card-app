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
import { insertUser } from '../lib/user';
import { zodResolver } from '@hookform/resolvers/zod';

export const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を追加
  const [skills, setSkill] = useState<Skill[]>([]);

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
      console.log('Submitted data:', data);

      // SNSアカウントIDの空白チェックと変換処理
      const formData = {
        ...data,
        skillIds: Array.isArray(data.skillIds) ? data.skillIds : [], // 配列であることを保証
        githubId: data.githubId || null,
        qiitaId: data.qiitaId || null,
        xId: data.xId || null,
      };

      console.log('送信データ:', formData); // デバッグ用ログ
      console.log('githubId:', formData.githubId);
      console.log('qiitaId:', formData.qiitaId);
      console.log('xId:', formData.xId);

      // 登録処理;
      const result = await insertUser(formData);
      if (!result) {
        console.error('ユーザー登録に失敗しました');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // スキルの初期表示
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true); // ローディング開始
        const allSkills = await AllSkills();
        setSkill(allSkills || []);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setSkill([]);
      } finally {
        setIsLoading(false); // ローディング終了
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
          {isLoading ? (
            <Box p={4} textAlign="center">
              Loading...
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit((data) => {
                onSubmitUser(data);
              })}
            >
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
          )}
        </Card>
      </Flex>
    </>
  );
};
