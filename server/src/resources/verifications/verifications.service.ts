import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { verifications } from '@/db/files/entities';
import { type Verification, type VerificationType } from '@/db/files/models';

import { checkIsExpired, getErrorMessage, getExpiredAt } from '@/utils/helpers';

import { type ExecutionResult } from '@/types/main';
import {
  type CreateVerificationConfig,
  type GetVerificationConfig,
} from './verifications.types';

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

    return db.insert(verifications).values({
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
        eq(verifications.type, type),
        eq(verifications.userId, userId)
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
      .delete(verifications)
      .where(
        and(
          eq(verifications.id, data.verificationId),
          eq(verifications.type, data.type)
        )
      );
  }

  private async checkToken(data: {
    type: VerificationType;
    token: string;
  }): ExecutionResult<Verification> {
    try {
      const verification = await db.query.verifications.findFirst({
        where: and(
          eq(verifications.type, data.type),
          eq(verifications.payload, data.token)
        ),
      });

      if (!verification) throw new Error('Invalid token');
      if (checkIsExpired(verification.expiredAt)) {
        await this.deleteVerification({
          type: data.type,
          verificationId: verification.id,
        });

        const message =
          'Verification token is expired. ' +
          'Try to request another verification token';

        throw new Error(message);
      }

      return { data: verification };
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
  }
}

export const verificationsService = new VerificationsService();
