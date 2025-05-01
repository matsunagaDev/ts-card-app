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
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import {
  userFormSchema,
  UserFormSchemaType,
} from '../validations/schemas/userFormSchema';
import { checkUserExists, insertUser } from '../lib/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserForm } from '@/domain/interfaces/userForm';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
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

  /**
   * スキル一覧を取得
   * @returns
   */
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const allSkills = await AllSkills();
        setSkill(allSkills || []);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setSkill([]);

        // エラー時のみトースト表示
        toast({
          title: '読み込みエラー',
          description: 'スキルデータの取得に失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchSkills();
  }, [toast]);

  /**
   * ユーザー登録処理
   * @param data
   */
  const onSubmitUser = async (data: UserFormSchemaType) => {
    try {
      console.log('Submitted data:', data);

      // SNSアカウントIDの空白チェックと変換処理
      const formData: UserForm = {
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        skillIds: Array.isArray(data.skillIds) ? data.skillIds : [], // 配列であることを保証
        githubId: data.githubId || null,
        qiitaId: data.qiitaId || null,
        xId: data.xId || null,
      };

      console.log('送信データ:', formData); // デバッグ用ログ

      // ユーザーの重複チェック
      const exists = await checkUserExists(formData.user_id);

      if (exists) {
        // ユーザーが存在する場合はエラーtoastを表示
        toast({
          title: 'ユーザー登録エラー',
          description: 'このユーザーIDは既に使用されています',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return; // ユーザーが存在する場合は処理を中断
      }

      // ユーザー登録処理
      await toast.promise(insertUser(formData), {
        loading: {
          title: '登録中',
          description: 'ユーザー情報を登録しています',
        },
        success: {
          title: '登録完了',
          description: 'ユーザー情報の登録に成功しました',
        },
        error: {
          title: '登録失敗',
          description: 'ユーザー情報の登録に失敗しました',
        },
      });

      // 登録成功後にトップページへ遷移
      navigate('/');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: '予期せぬエラー',
        description: '登録処理中にエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  /**
   * 画面表示
   */
  return (
    <>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        minH={'100vh'}
        py={8}
        overflow={'auto'}
        bg="gray.50" // 全体の背景色を淡いグレーに
      >
        <Card
          maxW="400px"
          my={4}
          boxShadow="lg" // シャドウを追加して浮き上がり感を出す
          bg="white" // カードの背景色
          borderRadius="lg" // 角を丸くする
        >
          <form
            onSubmit={handleSubmit((data) => {
              onSubmitUser(data);
            })}
          >
            <CardHeader bg="blue.50">
              {' '}
              {/* ヘッダー部分の背景色 */}
              <Heading
                size="md"
                textAlign="center"
                color="blue.700"
                data-testid="title"
              >
                新規登録
              </Heading>
            </CardHeader>

            <CardBody maxH={{ base: '60vh', md: 'none' }} overflow="auto">
              <Stack spacing={4}>
                <Box>
                  <FormLabel htmlFor="user-id-input">好きな英単語</FormLabel>
                  <Input
                    id="user-id-input"
                    autoFocus
                    placeholder="英単語を入力"
                    {...register('user_id')}
                    isInvalid={!!errors.user_id}
                    bg="white" // 入力フィールドの背景色
                    borderColor="gray.300" // 枠線の色
                    _hover={{ borderColor: 'blue.300' }} // ホバー時の枠線色
                    data-testid="user-id-input"
                  />
                  {errors.user_id && (
                    <Text color="red.500" fontSize="sm">
                      {errors.user_id.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel htmlFor="name-input">名前</FormLabel>
                  <Input
                    id="name-input"
                    placeholder="名前を入力"
                    {...register('name')}
                    isInvalid={!!errors.name}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                    data-testid="name-input"
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">
                      {errors.name.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel htmlFor="description-input">自己紹介</FormLabel>
                  <Textarea
                    id="description-input"
                    placeholder="<h1>タグも使用可能です</h1>"
                    {...register('description')}
                    isInvalid={!!errors.description}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                    data-testid="description-input"
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
                  <FormLabel htmlFor="github-input">GitHub ID</FormLabel>
                  <Input
                    id="github-input"
                    {...register('githubId')}
                    isInvalid={!!errors.githubId}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                    placeholder="GitHubのIDを入力"
                  />
                  {errors.githubId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.githubId.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel htmlFor="qiita-input">Qiita ID</FormLabel>
                  <Input
                    id="qiita-input"
                    {...register('qiitaId')}
                    isInvalid={!!errors.qiitaId}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                    placeholder="QiitaのIDを入力"
                  />
                  {errors.qiitaId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.qiitaId.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel htmlFor="x-input">X ID</FormLabel>
                  <Input
                    id="x-input"
                    {...register('xId')}
                    isInvalid={!!errors.xId}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                    placeholder="XのIDを入力"
                  />
                  {errors.xId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.xId.message}
                    </Text>
                  )}
                </Box>
              </Stack>
            </CardBody>
            {/* フォームの送信ボタン */}
            <CardFooter flexDirection="column" bg="gray.50">
              {' '}
              {/* フッター部分の背景色 */}
              <Box mt={4} w="100%">
                <Button
                  type="submit"
                  colorScheme="blue"
                  w="100%"
                  _hover={{ bg: 'blue.600' }} // ホバー時の色を少し濃くする
                  data-testid="register-button"
                >
                  登録
                </Button>
              </Box>
              <Box mt={4} w="100%">
                <Button
                  colorScheme="orange"
                  variant="outline"
                  w="100%"
                  _hover={{ bg: 'orange.50' }} // ホバー時の背景色
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
