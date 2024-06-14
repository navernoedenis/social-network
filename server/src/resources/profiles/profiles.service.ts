import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { profiles } from '@/db/files/entities';
import { type Profile } from '@/db/files/models';
import { type SwitchKey, type UpdateFields } from './profiles.types';

class ProfilesService {
  async getProfile(userId: number) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    return profile as Profile;
  }

  async updatePhone(userId: number, phone: string | null) {
    return db
      .update(profiles)
      .set({
        phone,
        isPhoneVerified: false,
      })
      .where(eq(profiles.userId, userId));
  }

  async updateFields(userId: number, fields: UpdateFields) {
    return db
      .update(profiles)
      .set(fields)
      .where(eq(profiles.userId, userId))
      .returning();
  }

  async switchIsActive(userId: number, value: boolean) {
    return this.switchField('isActive', userId, value);
  }

  async switchIsEmailVerified(userId: number, value: boolean) {
    return this.switchField('isEmailVerified', userId, value);
  }

  async switchIsOfficial(userId: number, value: boolean) {
    return this.switchField('isOfficial', userId, value);
  }

  async switchIsPhoneVerified(userId: number, value: boolean) {
    return this.switchField('isPhoneVerified', userId, value);
  }

  private async switchField(key: SwitchKey, userId: number, value: boolean) {
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...(key === 'isActive' && { isActive: value }),
        ...(key === 'isEmailVerified' && { isEmailVerified: value }),
        ...(key === 'isOfficial' && { isOfficial: value }),
        ...(key === 'isPhoneVerified' && { isPhoneVerified: value }),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return updatedProfile;
  }
}

export const profilesService = new ProfilesService();
