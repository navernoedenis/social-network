import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

import { AppHandlers } from '@/utils/app-handlers';
import { authRouter } from '@/resources/auth';
import { ENV } from '@/app/env';
import { isAuthorized } from '@/utils/middlewares';

import { sessionTokensRouter } from '@/resources/session-tokens';
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
router.use('/api/v1/session-tokens', sessionTokensRouter);

router.get('/test', AppHandlers.testHandler);
router.use('*', AppHandlers.notFoundtHandler);
router.use(AppHandlers.httpErrorHandler);
