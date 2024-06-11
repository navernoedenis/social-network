import { type Config } from 'jest';

const config: Config = {
  rootDir: './src',
  verbose: true,
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
};

export default config;
