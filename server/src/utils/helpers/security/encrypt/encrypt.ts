import { createCipheriv, createDecipheriv } from 'node:crypto';
import { ENV } from '@/app/env';

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(ENV.ENCRYPT_SECRET_KEY);
const ivKey = Buffer.from(ENV.ENCRYPT_IV_KEY);

export const encryptData = (text: string) => {
  const cipher = createCipheriv(algorithm, secretKey, ivKey);
  const encrypted = cipher.update(text, 'utf8', 'hex');
  return encrypted + cipher.final('hex');
};

export const decryptData = (encrypted: string) => {
  const decipher = createDecipheriv(algorithm, secretKey, ivKey);
  const decrypted = decipher.update(encrypted, 'hex', 'utf8');
  return decrypted + decipher.final('utf8');
};
