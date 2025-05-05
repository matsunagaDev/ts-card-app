import {
  userEditFormSchema,
  UserEditFormSchemaType,
} from '../validations/schemas/userFormSchema';
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
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '../domain/user';
import { getUserSkillForEdit } from '../lib/userSkill';
import { updateUser } from '../lib/user';

export const Edit = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [skills, setSkill] = useState<Skill[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UserEditFormSchemaType>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      name: '',
      description: '',
      skillIds: [],
      githubId: '',
      qiitaId: '',
      xId: '',
    },
    mode: 'onChange',
  });

  /**
   * ユーザー情報を取得
   * @returns
   */
  useEffect(() => {
    const UserData = async () => {
      try {
        if (!id) {
          console.log('URLパラメータのIDが見つかりません');
          return;
        }
        const allSkills = await AllSkills();
        setSkill(allSkills || []); // スキル一覧をセット

        const User = await getUserSkillForEdit(id);

        setUser(User); // ユーザー情報をセット

        // 非同期で取得したデータをフォームにセット
        setValue('name', User.name);
        setValue('description', User.description);
        setValue(
          'skillIds',
          User.skills.map((skill) => Number(skill.id))
        );
        setValue('githubId', User.github_id);
        setValue('qiitaId', User.qiita_id);
        setValue('xId', User.x_id);

        console.log(`ユーザー情報をセット: ${User.name}`);
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
    UserData();
  }, [toast, id, setValue]); // setValueを依存配列に追加

  /**
   * 更新処理
   * @param data
   */
  const onUpdateUser = async (data: UserEditFormSchemaType) => {
    try {
      console.log('Submitted data:', data);

      // UserFormインターフェースに合わせて必須フィールドを確実に含める
      const formData = {
        user_id: user?.user_id || '', // ユーザーIDを確実に含める
        name: data.name || '', // nameを必須として扱う
        description: data.description || '', // descriptionを必須として扱う
        skillIds: Array.isArray(data.skillIds) ? data.skillIds : [], // 配列であることを保証
        githubId: data.githubId || null,
        qiitaId: data.qiitaId || null,
        xId: data.xId || null,
      };

      console.log('送信データ:', formData); // デバッグ用ログ

      try {
        // updateUserの結果を直接取得
        const result = await updateUser(formData);

        // 結果に基づいてトースト表示
        if (result) {
          // 更新成功時はユーザー詳細画面に遷移
          navigate(`/cards/${formData.user_id}`);
        } else {
          toast({
            title: '更新失敗',
            description: 'ユーザー情報の更新に失敗しました',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: '更新失敗',
          description: 'ユーザー情報の更新処理中にエラーが発生しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('更新処理エラー:', error);
      }
    } catch (error) {
      console.error('ユーザー更新エラー:', error);
    }
  };

  /**
   * 画面レイアウト
   */
  return (
    <>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        minH={'100vh'}
        py={8}
        overflow={'auto'}
        bg="gray.50"
      >
        <Card
          maxW="400px"
          w={{ base: '90%', md: '400px' }}
          my={4}
          boxShadow="lg"
          bg="white"
          borderRadius="lg"
        >
          <form
            onSubmit={handleSubmit(onUpdateUser, (formErrors) => {
              console.log('バリデーションエラー:', formErrors);
            })}
          >
            <CardHeader bg="blue.50">
              <Heading size="md" textAlign="center" color="blue.700">
                編集
              </Heading>
            </CardHeader>

            <CardBody maxH={{ base: '60vh', md: 'none' }} overflow="auto">
              <Stack spacing={4}>
                <Box>
                  <FormLabel>好きな英単語</FormLabel>
                  <Box>
                    <Heading size="lg" color="blue.700">
                      {user?.user_id}
                    </Heading>
                  </Box>
                </Box>
                <Box>
                  <FormLabel>
                    名前{' '}
                    <Text as="span" color="red.500" fontWeight="bold">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    placeholder="名前を入力"
                    {...register('name')}
                    isInvalid={!!errors.name}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">
                      {errors.name.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>
                    自己紹介{' '}
                    <Text as="span" color="red.500" fontWeight="bold">
                      *
                    </Text>
                  </FormLabel>
                  <Textarea
                    placeholder="<h1>タグも使用可能です</h1>"
                    {...register('description')}
                    isInvalid={!!errors.description}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                  />
                  {errors.description && (
                    <Text color="red.500" fontSize="sm">
                      {errors.description.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>
                    スキル{' '}
                    <Text as="span" color="red.500" fontWeight="bold">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="skillIds"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckboxGroup
                        colorScheme="blue"
                        value={value || []} // valueはsetValueによって更新される
                        onChange={(vals) =>
                          // チェックボックスの値を配列として取得
                          onChange(vals.map(Number))
                        }
                      >
                        <Stack spacing={[1, 2]} direction={['column']}>
                          {Array.isArray(skills) &&
                            skills.map((skill) => (
                              <Checkbox
                                key={skill.id}
                                value={Number(skill.id)} // 明示的に数値に変換
                              >
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
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
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
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                  />
                  {errors.qiitaId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.qiitaId.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <FormLabel>X ID</FormLabel>
                  <Input
                    {...register('xId')}
                    isInvalid={!!errors.xId}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.300' }}
                  />
                  {errors.xId && (
                    <Text color="red.500" fontSize="sm">
                      {errors.xId.message}
                    </Text>
                  )}
                </Box>
              </Stack>
            </CardBody>

            <CardFooter
              flexDirection={{ base: 'column', sm: 'row' }}
              bg="gray.50"
              gap={4}
            >
              <Button
                colorScheme="orange"
                variant="outline"
                flex="1"
                onClick={() => navigate(-1)}
                _hover={{ bg: 'orange.50' }}
              >
                戻る
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                flex="1"
                _hover={{ bg: 'blue.600' }}
              >
                更新
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Flex>
    </>
  );
};
