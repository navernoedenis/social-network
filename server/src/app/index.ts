import express from 'express';
import { middlewares } from './middlewares';

import { router } from './router';

export const app = express();

app.use(middlewares);
app.use(router);
