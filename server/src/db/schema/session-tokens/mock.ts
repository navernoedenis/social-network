import { faker } from '@faker-js/faker';
import { type NewSessionToken } from './model';

export const createSessionToken = ({
  expiredAt,
  token,
  userId,
}: {
  expiredAt: Date;
  token: string;
  userId: number;
}): NewSessionToken => ({
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
    'unknown',
  ]),
  os: faker.helpers.arrayElement([
    'linux',
    'macos',
    'windows',
    'android',
    'unknown',
  ]),
  ip: faker.internet.ipv4(),
  token,
  expiredAt,
});
