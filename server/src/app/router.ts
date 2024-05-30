import { Router } from 'express';
import { AppHandlers } from '@/utils/app-handlers';

export const router = Router();

router.get('/test', AppHandlers.testHandler);
router.use('*', AppHandlers.notFoundtHandler);
router.use(AppHandlers.httpErrorHandler);
