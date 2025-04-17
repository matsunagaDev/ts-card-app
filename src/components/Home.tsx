import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

export const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    console.log('ID:', data);
    // IDがDBに存在するか確認する処理を追加⭐️

    navigate(`/cards/${data.id}`);
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
            <form onSubmit={onSubmit}>
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input
                  type="text"
                  {...register('id')}
                  autoFocus
                  placeholder="IDを入力"
                  isInvalid={!!errors.id}
                />
                {errors.id && (
                  <Text color="red.500" fontSize="sm">
                    {errors.id.message}
                  </Text>
                )}
                <Box mt={4}>
                  <Button type="submit" colorScheme="blue" w="100%">
                    名刺を見る
                  </Button>
                </Box>
              </FormControl>
            </form>
            <Box mt={4}>
              <Link to="cards/register">新規登録</Link>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
