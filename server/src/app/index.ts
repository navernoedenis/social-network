import { createServer } from 'http';
import express from 'express';

import { middlewares } from './middlewares';
import { router } from './router';

export const app = express();
export const httpServer = createServer(app);

app.use(middlewares);
app.use(router);
