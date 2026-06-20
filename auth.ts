import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';

import { authConfig } from '@/auth.config';
import clientPromise from '@/lib/mongodb';
import { ensureUserTimestamps, seedMockUserProfile } from '@/lib/user';

const isMockMode = process.env.AUTH_MOCK_MODE === 'true';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // 開発用モードでは MongoDB に繋がなくても動作確認できるようにする
  adapter: isMockMode ? undefined : MongoDBAdapter(clientPromise),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, trigger, session }) {
      // token.sub を常に埋めて、ミドルウェア/保護判定で落ちないようにする
      const nextSub =
        (user?.id ? String(user.id) : undefined) ??
        (account?.providerAccountId ? String(account.providerAccountId) : undefined) ??
        (typeof user?.email === 'string' ? user.email : undefined);

      if (nextSub) {
        token.sub = nextSub;
      }

      if (user?.id) {
        // MongoDB が落ちていても UI 確認のために致命エラーにしない
        try {
          await ensureUserTimestamps(String(user.id));
        } catch {
          // ignore
        }
      }

      if (isMockMode && token.sub) {
        seedMockUserProfile({
          id: String(token.sub),
          name: user?.name,
          email: user?.email,
          image: user?.image
        });
      }

      if (trigger === 'update' && session?.name) {
        token.name = session.name as string;
      }

      if (user?.name) token.name = user.name;
      if (user?.image) token.picture = user.image;
      if (user?.email) token.email = user.email;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ? String(token.sub) : session.user.id ?? '';
        if (token.name) {
          session.user.name = token.name as string;
        }
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.email) {
          session.user.email = token.email as string;
        }
      }

      return session;
    }
  }
});
