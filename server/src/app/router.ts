import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { ENV } from '@/app/env';
import { authRouter } from '@/resources/auth';
import { AppHandlers } from '@/utils/app-handlers';

import apiDocument from '@/swagger.json';

export const router = Router();

if (ENV.IS_DEVELOPMENT) {
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));
}

router.use('/auth', authRouter);

router.get('/test', AppHandlers.testHandler);
router.use('*', AppHandlers.notFoundtHandler);
router.use(AppHandlers.httpErrorHandler);
