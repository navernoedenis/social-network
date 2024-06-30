import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type Profile } from '@/db/files/models';
import { type ToggleKey, type UpdateFields } from './profiles.types';

import * as entities from '@/db/files/entities';

class ProfilesService {
  async getOne(userId: number) {
    const profile = await db.query.profiles.findFirst({
      where: eq(entities.profiles.userId, userId),
    });

    return profile as Profile;
  }

  async updatePhone(userId: number, phone: string | null) {
    return db
      .update(entities.profiles)
      .set({
        phone,
        isPhoneVerified: false,
      })
      .where(eq(entities.profiles.userId, userId));
  }

  async updateOne(userId: number, fields: UpdateFields) {
    return db
      .update(entities.profiles)
      .set(fields)
      .where(eq(entities.profiles.userId, userId))
      .returning();
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

    return updatedProfile;
  }
}

export const profilesService = new ProfilesService();
