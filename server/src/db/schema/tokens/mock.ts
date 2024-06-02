import { faker } from '@faker-js/faker';
import { type NewRefreshToken } from './model';

export const createRefreshToken = ({
  expiredAt,
  token,
  userId,
}: {
  expiredAt: Date;
  token: string;
  userId: number;
}): NewRefreshToken => ({
  userId,
  browser: faker.helpers.arrayElement([
    'brave',
    'chrome',
    'firefox',
    'internet explorer',
    'maxthon',
    'microsoft edge',
    'opera',
    'safari',
    'vivaldi',
  ]),
  os: faker.helpers.arrayElement(['linux', 'macos', 'windows', 'android']),
  ip: faker.internet.ipv4(),
  token,
  expiredAt,
});
