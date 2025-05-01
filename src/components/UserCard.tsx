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
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { SiQiita } from 'react-icons/si';

export const UserCard = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userPromise = new Promise(async (resolve, reject) => {
        try {
          if (!id) {
            reject(new Error('URLパラメータのIDが見つかりません'));
            return;
          }
          console.log(`${id}のユーザー情報を取得します`);

          const userData = await getUserSkillById(id);
          setUser(userData);
          resolve(userData); // 成功時
        } catch (error) {
          console.error('Error fetching user:', error);
          reject(error); // 失敗時
        }
      });

      // Promiseの結果に基づいてToastを表示
      toast.promise(userPromise, {
        success: {
          title: 'ユーザー情報取得完了',
          description: 'ユーザー情報の取得に成功しました',
        },
        error: {
          title: 'エラー発生',
          description: 'ユーザー情報の取得に失敗しました',
        },
        loading: {
          title: '読み込み中',
          description: 'ユーザー情報を取得しています',
        },
      });
    };

    fetchUser();
  }, [id, toast]); // idを依存配列に追加

  /**
   * 画面レイアウト
   */
  return (
    <Box bg="gray.100" minH="100vh" py={4}>
      <Container maxW="container.sm">
        <VStack spacing={4}>
          <Card w="100%" bg="white">
            <CardHeader>
              <Flex gap="4">
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name={user?.name} src="" />
                  <Box>
                    <Heading size="lg" data-testid="user-name">
                      {user?.name}
                    </Heading>
                  </Box>
                </Flex>
              </Flex>
            </CardHeader>

            <CardBody>
              <Stack spacing="4" align="stretch">
                <Box>
                  <Heading size="md" textTransform="uppercase" mb={4}>
                    自己紹介
                  </Heading>

                  {/* 方法1: Chakra UIのdangerouslySetInnerHTML代替手段を使用 */}
                  <Text
                    data-testid="user-description"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.default.sanitize(
                        user?.description || ''
                      ),
                    }}
                    textAlign={'left'}
                  />
                </Box>
                <Box>
                  <Heading size="md" textTransform="uppercase" mb={4}>
                    スキル
                  </Heading>
                  <List
                    spacing={3}
                    styleType="none"
                    pl={4}
                    data-testid="skill-list"
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
                  <Heading size="md" textTransform="uppercase" mb={4}>
                    SNS
                  </Heading>
                  <Flex justify="center" align="center">
                    <Wrap spacing={8} justify="center" data-testid="sns-links">
                      {user?.github_id && (
                        <WrapItem>
                          <Link
                            href={user.github_id}
                            isExternal
                            _hover={{ textDecoration: 'none' }}
                          >
                            <IconButton
                              aria-label="GitHub"
                              icon={<FaGithub size="24px" />}
                              variant="ghost"
                              size="lg"
                              _hover={{ bg: 'gray.100' }}
                              data-testid="github-icon"
                            />
                          </Link>
                        </WrapItem>
                      )}

                      {user?.qiita_id && (
                        <WrapItem>
                          <Link
                            href={user.qiita_id}
                            isExternal
                            _hover={{ textDecoration: 'none' }}
                          >
                            <IconButton
                              aria-label="Qiita"
                              icon={<SiQiita size="24px" />}
                              variant="ghost"
                              size="lg"
                              _hover={{ bg: 'gray.100' }}
                              data-testid="qiita-icon"
                            />
                          </Link>
                        </WrapItem>
                      )}

                      {user?.x_id && (
                        <WrapItem>
                          <Link
                            href={user.x_id}
                            isExternal
                            _hover={{ textDecoration: 'none' }}
                          >
                            <IconButton
                              aria-label="X (Twitter)"
                              icon={<FaTwitter size="24px" />}
                              variant="ghost"
                              size="lg"
                              _hover={{ bg: 'gray.100' }}
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
            <CardFooter>
              <Flex justify="space-between" w="100%">
                <Button
                  onClick={() => navigate('/')}
                  colorScheme="blue"
                  data-testid="back-button"
                >
                  戻る
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    navigate(`/cards/${id}/edit`);
                  }}
                >
                  編集
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </VStack>
        <Outlet />
      </Container>
    </Box>
  );
};
