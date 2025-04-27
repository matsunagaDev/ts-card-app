import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { getUserById } from '../lib/user';

export const Home = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log('ID:', data);

    try {
      const user = await getUserById(data.id);
      console.log('ユーザー情報:', user);

      // ユーザーが存在しない場合
      if (user === null) {
        toast({
          title: 'エラー',
          description: '入力されたIDのユーザーは存在しません',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        // 遷移せずここで処理を終了
        return;
      }

      // ユーザーが存在する場合は対象のユーザーページへ遷移
      navigate(`/cards/${data.id}`);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);

      toast({
        title: 'エラー',
        description: 'ユーザー情報の取得に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  return (
    <>
      <Flex alignItems={'center'} justifyContent={'center'} h={'100vh'}>
        <Card>
          <CardHeader>
            <Heading data-testid="title" textAlign={'center'}>
              名刺アプリ
            </Heading>
          </CardHeader>
          <CardBody>
            {/* react-hook-formのuseFormを使用して、フォームの状態を管理 */}
            <form onSubmit={onSubmit} data-testid="search-form">
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input
                  type="text"
                  {...register('id')}
                  autoFocus
                  placeholder="IDを入力"
                  data-testid="id-input"
                />
                {errors.id && (
                  <Text color="red.500" fontSize="sm">
                    {errors.id.message}
                  </Text>
                )}
                <Box mt={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="100%"
                    data-testid="view-button"
                  >
                    名刺を見る
                  </Button>
                </Box>
              </FormControl>
            </form>
          </CardBody>
          <CardFooter justifyContent="center" width="100%">
            <Link color="teal.500" to="cards/register">
              新規登録
            </Link>
          </CardFooter>
        </Card>
      </Flex>
    </>
  );
};
