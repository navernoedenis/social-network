import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { profiles } from '@/db/files/entities';
import { type Profile } from '@/db/files/models';
import { type SwitchKey } from './profiles.types';

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

  async switchIsActive(userId: number, value: boolean) {
    return this.switchField('active', userId, value);
  }

  async switchIsEmailVerified(userId: number, value: boolean) {
    return this.switchField('email', userId, value);
  }

  async switchIsOfficial(userId: number, value: boolean) {
    return this.switchField('official', userId, value);
  }

  async switchIsPhoneVerified(userId: number, value: boolean) {
    return this.switchField('phone', userId, value);
  }

  private async switchField(key: SwitchKey, userId: number, value: boolean) {
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...(key === 'active' && { isActive: value }),
        ...(key === 'email' && { isEmailVerified: value }),
        ...(key === 'official' && { isOfficial: value }),
        ...(key === 'phone' && { isPhoneVerified: value }),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return updatedProfile;
  }
}

export const profilesService = new ProfilesService();
