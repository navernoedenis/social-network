import '@/packages';
import { dbClient } from '@/config/db-client.config';
import { db } from '@/db';

import * as entities from '@/db/files/entities';
import * as mocks from '@/db/files/mocks';

import { print } from '@/utils/lib';
import {
  createHash,
  createJwtToken,
  createToken,
  getErrorMessage,
  getExpiredAt,
} from '@/utils/helpers';

const getBoolean = () => Math.random() >= 0.5;
const getRandom = <T>(arr: T[]) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};
const getQuantity = (data: { max: number }) =>
  Math.floor(Math.random() * data.max);

const createPostComment = async (data: {
  parentId?: number | null;
  postId?: number | null;
  userId: number;
}) => {
  const { parentId, postId, userId } = data;

  const commentData = mocks.createComment({
    parentId: parentId ? parentId : null,
    userId: userId,
  });
  const [comment] = await db
    .insert(entities.comments)
    .values(commentData)
    .returning();

  if (postId) {
    await db
      .insert(entities.postsComments)
      .values({ postId, commentId: comment.id })
      .returning();
  }

  const shouldAddChild = getBoolean();
  if (!shouldAddChild) {
    return comment;
  }

  return createPostComment({
    parentId: comment.id,
    userId: userId,
    postId: null,
  });
};

const startSeeding = async () => {
  try {
    print.success('Connecting to database 🔌');
    await dbClient.connect();

    const userIds: number[] = [];

    print.success('Seeding data...🌱🌱🌱');
    for (let index = 0; index < 20; index++) {
      const userData = mocks.createUser();

      const isRoot = index === 0;
      if (isRoot) {
        userData.role = 'root';
        userData.email = 'denis@gmail.com';
        userData.username = 'denis';
      }

      // USER
      const [user] = await db
        .insert(entities.users)
        .values(userData)
        .returning();

      userIds.push(user.id);

      // PASSWORD
      const hash = await createHash('12345678password');
      await db.insert(entities.passwords).values({
        userId: user.id,
        hash,
      });

      // 2FA VERIFICATION
      const shouldAdd2FA = getBoolean();
      if (shouldAdd2FA && !isRoot) {
        const token = createJwtToken('refresh', {
          id: user.id,
          email: user.email,
          role: user.role,
        });

        const sessionToken = mocks.createSessionToken({
          userId: user.id,
          token,
          expiredAt: getExpiredAt(30, 'days'),
        });

        await Promise.all([
          db.insert(entities.settings).values({
            userId: user.id,
            is2faEnabled: true,
          }),
          db.insert(entities.verifications).values({
            type: '2fa',
            userId: user.id,
            payload: createToken(),
            expiredAt: getExpiredAt(5, 'minutes'),
          }),
          db.insert(entities.sessionTokens).values(sessionToken),
        ]);
      }

      // PROFILE
      const [profile] = await db
        .insert(entities.profiles)
        .values(mocks.createProfile(user.id))
        .returning();

      if (!profile.isEmailVerified) {
        await db.insert(entities.verifications).values({
          type: 'email',
          userId: user.id,
          payload: createToken(),
          expiredAt: getExpiredAt(2, 'hours'),
        });
      }

      // STATUS
      const status = mocks.createStatus(user.id);
      await db.insert(entities.status).values(status);

      // SETTINGS
      const settingsData = mocks.createSettings(user.id);
      await db.insert(entities.settings).values(settingsData);

      // CONVERSATION
      const shouldCreateConversation = getBoolean();
      if (shouldCreateConversation) {
        const friendIds = userIds.filter((id) => id !== user.id);
        const friendId = getRandom(friendIds);

        if (friendIds.length) {
          const [conversation] = await db
            .insert(entities.conversations)
            .values({ authorId: user.id, userId: friendId })
            .returning();

          // CONVERSATION -> MESSAGE
          const messagesQuantity = getQuantity({ max: 20 });
          for (let i = 0; i < messagesQuantity; i++) {
            const messageData = mocks.createMessage(user.id);
            const [message] = await db
              .insert(entities.messages)
              .values(messageData)
              .returning();

            await db.insert(entities.conversationsMessages).values({
              conversationId: conversation.id,
              messageId: message.id,
            });
          }
        }
      }

      // POST
      const shouldCreatePost = getBoolean();
      if (shouldCreatePost) {
        const postsQuantity = getQuantity({ max: 4 });

        for (let i = 0; i < postsQuantity; i++) {
          const postData = mocks.createPost(user.id);
          const [post] = await db
            .insert(entities.posts)
            .values(postData)
            .returning();

          // POST -> LIKE
          const shouldAddPostLike = getBoolean();
          if (shouldAddPostLike) {
            const likeData = mocks.createLike();
            const [like] = await db
              .insert(entities.likes)
              .values(likeData)
              .returning();

            await db.insert(entities.postsLikes).values({
              likeId: like.id,
              postId: post.id,
              userId: user.id,
            });
          }

          // POST -> FILE
          const shouldAddFile = getBoolean();
          if (shouldAddFile) {
            const fileData = mocks.createFile(user.id);
            const [file] = await db
              .insert(entities.files)
              .values(fileData)
              .returning();

            await db.insert(entities.postsFiles).values({
              postId: post.id,
              fileId: file.id,
            });
          }

          // POST -> COMMENT
          const shouldAddComment = getBoolean();
          if (shouldAddComment) {
            const comment = await createPostComment({
              parentId: null,
              postId: post.id,
              userId: user.id,
            });

            // POST -> COMMENT -> LIKE
            const shouldLikeComment = getBoolean();
            if (shouldLikeComment) {
              const likeData = mocks.createLike();
              const [like] = await db
                .insert(entities.likes)
                .values(likeData)
                .returning();

              await db.insert(entities.commentsLikes).values({
                commentId: comment.id,
                likeId: like.id,
                userId: user.id,
              });
            }
          }

          // POST -> BOOKMARK
          const shouldAddBookmark = getBoolean();
          if (shouldAddBookmark) {
            await db
              .insert(entities.bookmarks)
              .values({ entity: 'post', entityId: post.id, userId: user.id });
          }
        }
      }
    }

    print.success('Done!..🔥');
  } catch (error) {
    print.error(getErrorMessage(error));
  } finally {
    await dbClient.end();
  }
};

startSeeding();
