import { eq } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { profilesCache } from './profiles.cache';
import { type ToggleKey, type UpdateFields } from './profiles.types';

class ProfilesService {
  async getOne(userId: number) {
    const cacheData = await profilesCache.getOne(userId);
    if (cacheData) return cacheData;

    const profile = await db.query.profiles.findFirst({
      where: eq(entities.profiles.userId, userId),
    });

    const profileData = profile!;
    await profilesCache.createOne(profileData);
    return profileData;
  }

  async updatePhone(userId: number, phone: string | null) {
    const [updatedProfile] = await db
      .update(entities.profiles)
      .set({ phone, isPhoneVerified: false })
      .where(eq(entities.profiles.userId, userId))
      .returning();

    await profilesCache.createOne(updatedProfile);
    return updatedProfile;
  }

  async updateOne(userId: number, fields: UpdateFields) {
    const [updatedProfile] = await db
      .update(entities.profiles)
      .set(fields)
      .where(eq(entities.profiles.userId, userId))
      .returning();

    await profilesCache.createOne(updatedProfile);
    return updatedProfile;
  }

  async toggleIsActive(userId: number, value: boolean) {
    return this.toggleField('isActive', userId, value);
  }

  async toggleIsEmailVerified(userId: number, value: boolean) {
    return this.toggleField('isEmailVerified', userId, value);
  }

  async toggleIsOfficial(userId: number, value: boolean) {
    return this.toggleField('isOfficial', userId, value);
  }

  async toggleIsPhoneVerified(userId: number, value: boolean) {
    return this.toggleField('isPhoneVerified', userId, value);
  }

  private async toggleField(key: ToggleKey, userId: number, value: boolean) {
    const [updatedProfile] = await db
      .update(entities.profiles)
      .set({
        ...(key === 'isActive' && { isActive: value }),
        ...(key === 'isEmailVerified' && { isEmailVerified: value }),
        ...(key === 'isOfficial' && { isOfficial: value }),
        ...(key === 'isPhoneVerified' && { isPhoneVerified: value }),
      })
      .where(eq(entities.profiles.userId, userId))
      .returning();

    await profilesCache.createOne(updatedProfile);
    return updatedProfile;
  }
}

export const profilesService = new ProfilesService();
