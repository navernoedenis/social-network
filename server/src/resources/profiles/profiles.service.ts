import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { profiles } from '@/db/files/entities';
import { type Profile } from '@/db/files/models';

class ProfilesService {
  async verifyEmail(userId: number, value: boolean = true) {
    await db
      .update(profiles)
      .set({ isVerified: value })
      .where(eq(profiles.userId, userId));
  }

  async getProfile(userId: number) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    return profile as Profile;
  }
}

export const profilesService = new ProfilesService();
