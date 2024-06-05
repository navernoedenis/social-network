import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { emailVerifications } from '@/db/files/entities';
import { type EmailVerification } from '@/db/files/models';
import { type ExecutionResult } from '@/types/main';
import { checkIsExpired, getErrorMessage, getExpiredAt } from '@/utils/helpers';

// 2fa

class VerificationsService {
  async createEmailVerification({
    userId,
    email,
    token,
  }: {
    userId: number;
    email: string;
    token: string;
  }): Promise<ExecutionResult<null>> {
    try {
      await db.insert(emailVerifications).values({
        email,
        expiredAt: getExpiredAt(15, 'minutes'),
        token,
        userId,
      });

      return { data: null };
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
  }

  async getEmailVerification(userId: number) {
    const verification = await db.query.emailVerifications.findFirst({
      where: eq(emailVerifications.userId, userId),
    });

    if (!verification) return null;
    if (checkIsExpired(verification.expiredAt)) {
      await this.deleteEmailVerification(verification.id);
      return null;
    }

    return verification;
  }

  async deleteEmailVerification(verificationId: string) {
    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.id, verificationId));
  }

  async checkEmailByToken(
    token: string
  ): Promise<ExecutionResult<EmailVerification>> {
    try {
      const verification = await db.query.emailVerifications.findFirst({
        where: eq(emailVerifications.token, token),
      });

      if (!verification) throw new Error('Invalid token');
      if (checkIsExpired(verification.expiredAt)) {
        await this.deleteEmailVerification(verification.id);

        const message =
          'Verification token is expired. ' +
          'Try to request another verify token on your profile page';

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
