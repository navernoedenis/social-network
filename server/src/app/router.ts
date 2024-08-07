import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

import { ENV } from '@/app/env';

import { appHandlers } from '@/utils/app-handlers';
import { isAuthorized } from '@/utils/middlewares';

import { authRouter } from '@/resources/auth';
import { bookmarksRouter } from '@/resources/bookmarks';
import { conversationsRouter } from '@/resources/conversations';
import { filesRouter } from '@/resources/files';
import { friendsRouter } from '@/resources/friends';
import { postsRouter } from '@/resources/posts';
import { profilesRouter } from '@/resources/profiles';
import { sessionTokensRouter } from '@/resources/session-tokens';
import { subscriptionsRouter } from '@/resources/subscriptions';
import { usersRouter } from '@/resources/users';
import { verificationsRouter } from '@/resources/verifications';

export const router = Router();

if (ENV.IS_DEVELOPMENT) {
  const filePath = path.resolve(__dirname, '../swagger.yaml');
  const document = fs.readFileSync(filePath, 'utf-8');
  const apiDoc = yaml.parse(document);

  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDoc));
}

router.use('/auth', authRouter);
router.use('/verifications', verificationsRouter);

router.use('/api', isAuthorized);
router.use('/api/v1/bookmarks', bookmarksRouter);
router.use('/api/v1/conversations', conversationsRouter);
router.use('/api/v1/files', filesRouter);
router.use('/api/v1/friends', friendsRouter);
router.use('/api/v1/posts', postsRouter);
router.use('/api/v1/profiles', profilesRouter);
router.use('/api/v1/session-tokens', sessionTokensRouter);
router.use('/api/v1/subscriptions', subscriptionsRouter);
router.use('/api/v1/users', usersRouter);

router.get('/test', appHandlers.test);
router.use('*', appHandlers.notFound);
router.use(appHandlers.httpError);
