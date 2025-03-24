import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
} from '@chakra-ui/react';
import { Link } from 'react-router';

export const Home = () => {
  return (
    <>
      <Flex alignItems={'center'} justifyContent={'center'} h={'100vh'}>
        <Card>
          <CardHeader>
            <Heading data-testid="title">名刺アプリ</Heading>
          </CardHeader>
          <CardBody>
            ID
            <Input autoFocus placeholder="IDを入力" />
            <Box mt={4}>
              <Button colorScheme="blue" w="100%">
                名刺を見る
              </Button>
            </Box>
            <Box mt={4}>
              <Link to="cards/register">新規登録</Link>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
