import { Outlet, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { User } from '../domain/user';
import {
  Box,
  Container,
  Heading,
  Link,
  Text,
  VStack,
  List,
  ListItem,
  Flex,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  IconButton,
  Wrap,
  WrapItem,
  Stack,
  CardFooter,
  Button,
} from '@chakra-ui/react';
import * as DOMPurify from 'dompurify';
import { getUserSkillById } from '../lib/userSkill';
import { FaGithub } from 'react-icons/fa';
import { SiQiita, SiX } from 'react-icons/si';

export const UserCard = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) {
          toast({
            title: 'エラー発生',
            description: 'IDが見つかりません',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        console.log(`${id}のユーザー情報を取得します`);

        const userData = await getUserSkillById(id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        // エラー時のみトースト表示
        toast({
          title: 'エラー発生',
          description: 'ユーザー情報の取得に失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUser();
  }, [id, toast]); // idを依存配列に追加

  /**
   * 画面レイアウト
   */
  return (
    <Box bg="gray.50" minH="100vh" py={8} px={4}>
      <Container maxW="container.sm">
        <VStack spacing={4}>
          <Card
            w="100%"
            bg="white"
            boxShadow="lg"
            borderRadius="lg"
            overflow="hidden"
          >
            <CardHeader bg="blue.50">
              <Flex gap="4">
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name={user?.name} src="" />
                  <Box>
                    <Heading size="lg" data-testid="user-name" color="blue.700">
                      {user?.name}
                    </Heading>
                  </Box>
                </Flex>
              </Flex>
            </CardHeader>

            <CardBody maxH={{ base: 'auto', md: 'none' }} overflow="auto">
              <Stack spacing="6" align="stretch">
                <Box>
                  <Heading
                    size="md"
                    textTransform="uppercase"
                    mb={4}
                    color="blue.700"
                  >
                    自己紹介
                  </Heading>

                  <Text
                    data-testid="user-description"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.default.sanitize(
                        user?.description || ''
                      ),
                    }}
                    textAlign={'left'}
                    bg="white"
                    p={3}
                    borderRadius="md"
                    borderColor="gray.200"
                    borderWidth="1px"
                  />
                </Box>
                <Box>
                  <Heading
                    size="md"
                    textTransform="uppercase"
                    mb={4}
                    color="blue.700"
                  >
                    スキル
                  </Heading>
                  <List
                    spacing={3}
                    styleType="none"
                    pl={4}
                    data-testid="skill-list"
                    bg="white"
                    p={3}
                    borderRadius="md"
                  >
                    {user?.skills?.map((skill) => (
                      <ListItem
                        key={skill.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <Box
                          as="span"
                          w={2}
                          h={2}
                          borderRadius="full"
                          bg="teal.500"
                        />
                        <Text textAlign="center" data-testid="skill-item">
                          {skill.name}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Heading
                    size="md"
                    textTransform="uppercase"
                    mb={4}
                    color="blue.700"
                  >
                    SNS
                  </Heading>
                  <Flex
                    justify="center"
                    align="center"
                    bg="white"
                    p={3}
                    borderRadius="md"
                  >
                    <Wrap spacing={8} justify="center" data-testid="sns-links">
                      {user?.github_id && user.github_id !== null && (
                        <WrapItem>
                          <Link
                            href={user.github_id}
                            isExternal
                            _hover={{ textDecoration: 'none' }}
                          >
                            <IconButton
                              aria-label="GitHub"
                              icon={<FaGithub size="32px" />}
                              variant="ghost"
                              size="lg"
                              color="gray.700"
                              w="70px"
                              h="70px"
                              borderRadius="full"
                              transition="all 0.2s ease"
                              _hover={{
                                bg: 'gray.100',
                                transform: 'scale(1.1)',
                                boxShadow: 'md',
                              }}
                              data-testid="github-icon"
                            />
                          </Link>
                        </WrapItem>
                      )}

                      {user?.qiita_id && user.qiita_id !== null && (
                        <WrapItem>
                          <Link
                            href={user.qiita_id}
                            isExternal
                            _hover={{ textDecoration: 'none' }}
                          >
                            <IconButton
                              aria-label="Qiita"
                              icon={<SiQiita size="32px" />}
                              variant="ghost"
                              size="lg"
                              color="teal.600"
                              w="70px"
                              h="70px"
                              borderRadius="full"
                              transition="all 0.2s ease"
                              _hover={{
                                bg: 'teal.50',
                                transform: 'scale(1.1)',
                                boxShadow: 'md',
                              }}
                              data-testid="qiita-icon"
                            />
                          </Link>
                        </WrapItem>
                      )}

                      {user?.x_id && user.x_id !== null && (
                        <WrapItem>
                          <Link
                            href={user.x_id}
                            isExternal
                            _hover={{ textDecoration: 'none' }}
                          >
                            <IconButton
                              aria-label="X (Twitter)"
                              icon={<SiX size="32px" />}
                              variant="ghost"
                              size="lg"
                              color="black"
                              w="70px"
                              h="70px"
                              borderRadius="full"
                              transition="all 0.2s ease"
                              _hover={{
                                bg: 'gray.100',
                                transform: 'scale(1.1)',
                                boxShadow: 'md',
                              }}
                              data-testid="x-icon"
                            />
                          </Link>
                        </WrapItem>
                      )}
                    </Wrap>
                  </Flex>
                </Box>
              </Stack>
            </CardBody>
            <CardFooter bg="gray.50" justifyContent="space-between">
              <Button
                onClick={() => navigate('/')}
                colorScheme="blue"
                data-testid="back-button"
                _hover={{ bg: 'blue.600' }}
              >
                戻る
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  navigate(`/cards/${id}/edit`);
                }}
                _hover={{ bg: 'teal.600' }}
              >
                編集
              </Button>
            </CardFooter>
          </Card>
        </VStack>
        <Outlet />
      </Container>
    </Box>
  );
};
