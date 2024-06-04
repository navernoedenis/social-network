import { faker } from '@faker-js/faker';
import { createOtpPassword } from '@/utils/helpers/otp-password';
import {
  type NewEmailVerification,
  type NewTwoFactorVerification,
} from './model';

export const createEmailVerification = ({
  userId,
  email,
  expiredAt,
}: {
  userId: number;
  email: string;
  expiredAt: Date;
}): NewEmailVerification => ({
  userId,
  email,
  token: faker.string.uuid(),
  expiredAt,
});

export const createTwoFactorVerification = ({
  userId,
  expiredAt,
}: {
  userId: number;
  expiredAt: Date;
}): NewTwoFactorVerification => ({
  userId,
  otp: `${createOtpPassword()}`,
  expiredAt,
});
