import argon2 from 'argon2';

export const createHash = async (value: string) => {
  const hash = await argon2.hash(value);
  return hash;
};

export const verifyHash = async (value: string, hash: string) => {
  return argon2.verify(hash, value);
};
