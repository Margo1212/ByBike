import { User } from '@prisma/client';
import { Strategy } from 'passport-google-oauth2';

import { prisma } from '~/common/prisma';

interface GoogleProfileResponse {
  provider: string;
  id: string;
  displayName: string;
  email: string;
  picture: string;
}

export const getGoogleAuthStrategy = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    // eslint-disable-next-line no-console
    console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');

    process.exit(1);
  }

  return new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (
      request: unknown,
      accessToken: string,
      refreshToken: unknown,
      profile: GoogleProfileResponse,
      done: (err: unknown, user: User | null) => void
    ) => {
      try {
        let user = await prisma.user.findUnique({ where: { email: profile.email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              nickname: profile.displayName,
              email: profile.email,
              avatar: profile.picture,
            },
          });
        }
        done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  );
};
