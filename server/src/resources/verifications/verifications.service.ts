import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

import { type VerificationType } from '@/db/files/models';
import {
  type CreateVerificationConfig,
  type GetVerificationConfig,
} from './verifications.types';

import { checkIsExpired, getExpiredAt } from '@/utils/helpers';

import * as entities from '@/db/files/entities';

class VerificationsService {
  // 2FA
  async create2FAVerification(config: CreateVerificationConfig) {
    await this.createVerification('2fa', config);
  }

  async get2FAVerification(config: GetVerificationConfig) {
    return this.getVerification('2fa', config);
  }

  async delete2FAVerification(verificationId: string) {
    return this.deleteVerification({
      type: '2fa',
      verificationId,
    });
  }

  // Email
  async createEmailVerification(config: CreateVerificationConfig) {
    await this.createVerification('email', config);
  }

  async getEmailVerification(config: GetVerificationConfig) {
    return this.getVerification('email', config);
  }

  async deleteEmailVerification(verificationId: string) {
    return this.deleteVerification({
      type: 'email',
      verificationId,
    });
  }

  // Forgot password
  async createForgotPasswordVerification(config: CreateVerificationConfig) {
    await this.createVerification('forgot-password', config);
  }

  async getForgotPasswordVerification(config: GetVerificationConfig) {
    return this.getVerification('forgot-password', config);
  }

  async deleteForgotPasswordVerification(verificationId: string) {
    return this.deleteVerification({
      type: 'forgot-password',
      verificationId,
    });
  }

  async checkEmailByToken(token: string) {
    return this.checkToken({ type: 'email', token });
  }

  // Phone
  async createPhoneVerification(config: CreateVerificationConfig) {
    await this.createVerification('phone', config);
  }

  async getPhoneVerification(config: GetVerificationConfig) {
    return this.getVerification('phone', config);
  }

  async deletePhoneVerification(verificationId: string) {
    return this.deleteVerification({
      type: 'phone',
      verificationId,
    });
  }

  private createVerification(
    type: VerificationType,
    config: CreateVerificationConfig
  ) {
    const { userId, payload, expiredAt } = config;

    return db.insert(entities.verifications).values({
      type,
      userId,
      payload,
      expiredAt: expiredAt ?? getExpiredAt(15, 'minutes'),
    });
  }

  private async getVerification(
    type: VerificationType,
    config: GetVerificationConfig
  ) {
    const { userId, skipExpireCheking = false } = config;

    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(entities.verifications.type, type),
        eq(entities.verifications.userId, userId)
      ),
    });

    if (skipExpireCheking) {
      return verification;
    }

    if (!verification) return null;
    if (checkIsExpired(verification.expiredAt)) {
      await this.deleteVerification({
        type: type,
        verificationId: verification.id,
      });
      return null;
    }

    return verification;
  }

  private deleteVerification(data: {
    type: VerificationType;
    verificationId: string;
  }) {
    return db
      .delete(entities.verifications)
      .where(
        and(
          eq(entities.verifications.id, data.verificationId),
          eq(entities.verifications.type, data.type)
        )
      );
  }

  private async checkToken(data: { type: VerificationType; token: string }) {
    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(entities.verifications.type, data.type),
        eq(entities.verifications.payload, data.token)
      ),
    });

    if (!verification) return 'Invalid token';

    if (checkIsExpired(verification.expiredAt)) {
      await this.deleteVerification({
        type: data.type,
        verificationId: verification.id,
      });

      const message =
        'Verification token is expired. ' +
        'Try to request another verification token';

      return message;
    }

    return verification;
  }
}

export const verificationsService = new VerificationsService();
