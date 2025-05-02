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
  Link,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
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

      // 未入力の場合
      if (data.id === '') {
        toast({
          title: 'エラー',
          description: 'IDを入力してください',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        // 遷移せずここで処理を終了
        return;
      }

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

  const onRegister = () => {
    navigate('/cards/register');
  };

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
          boxShadow="lg"
          borderRadius="lg"
          bg="white"
        >
          <CardHeader bg="blue.50">
            <Heading data-testid="title" textAlign={'center'} color="blue.700">
              名刺アプリ
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={onSubmit} data-testid="search-form">
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input
                  type="text"
                  {...register('id')}
                  autoFocus
                  placeholder="IDを入力"
                  data-testid="id-input"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'blue.300' }}
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
                    _hover={{ bg: 'blue.600' }}
                    data-testid="view-button"
                  >
                    名刺を見る
                  </Button>
                </Box>
              </FormControl>
            </form>
          </CardBody>
          <CardFooter
            justifyContent="center"
            width="100%"
            bg="gray.50"
            borderBottomRadius="lg"
          >
            <Link
              color="teal.500"
              onClick={onRegister}
              data-testid="register-link"
              fontWeight="medium"
              _hover={{ textDecoration: 'underline', color: 'teal.600' }}
            >
              新規登録
            </Link>
          </CardFooter>
        </Card>
      </Flex>
    </>
  );
};
