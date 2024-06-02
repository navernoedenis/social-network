import crypto from 'node:crypto';

export const createToken = (len: number = 32) => {
  return crypto.randomBytes(len).toString('hex');
};
