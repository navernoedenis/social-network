import { type AuthUser } from './main';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

declare module 'node:http' {
  interface IncomingMessage {
    user?: AuthUser;
  }
}
