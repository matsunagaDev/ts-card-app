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

export const Register = () => {
  return (
    <>
      <Flex alignItems={'center'} justifyContent={'center'} h={'100vh'}>
        <Card>
          <CardHeader>
            <Heading>新規登録</Heading>
          </CardHeader>
          <CardBody>
            ID
            <Input autoFocus placeholder="IDを入力" />
            <Box mt={4}>
              <Button colorScheme="blue" w="100%">
                登録
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
