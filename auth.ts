import NextAuth from 'next-auth';

import { authConfig } from '@/auth.config';
import { ensureUserTimestamps, seedMockUserProfile, upsertOAuthUser } from '@/lib/user';

const isMockMode = process.env.AUTH_MOCK_MODE === 'true';

/**
 * MongoDB Adapter は使わない。
 * Adapter は MongoDB 接続失敗時に AdapterError → Configuration（Server error）になり、
 * ログイン全体が止まるため、JWT セッション + ベストエフォートのユーザー保存に切り替える。
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, trigger, session }) {
      // 初回サインイン時: MongoDB にユーザーを保存できればその ID、失敗時はフォールバック
      if (user && account) {
        const email =
          typeof user.email === 'string'
            ? user.email
            : typeof token.email === 'string'
              ? token.email
              : undefined;

        if (email) {
          const mongoId = await upsertOAuthUser({
            email,
            name: user.name,
            image: user.image,
            providerAccountId: String(account.providerAccountId ?? '')
          });

          if (mongoId) {
            token.sub = mongoId;
          } else {
            token.sub =
              (account.providerAccountId ? String(account.providerAccountId) : undefined) ??
              (user.id ? String(user.id) : undefined) ??
              email;
          }
        } else {
          token.sub =
            (user.id ? String(user.id) : undefined) ??
            (account.providerAccountId ? String(account.providerAccountId) : undefined) ??
            token.sub;
        }
      } else if (!token.sub) {
        const nextSub =
          (user?.id ? String(user.id) : undefined) ??
          (account?.providerAccountId ? String(account.providerAccountId) : undefined) ??
          (typeof user?.email === 'string' ? user.email : undefined);
        if (nextSub) {
          token.sub = nextSub;
        }
      }

      if (token.sub) {
        try {
          await ensureUserTimestamps(String(token.sub));
        } catch {
          // ignore
        }
      }

      if (isMockMode && token.sub) {
        seedMockUserProfile({
          id: String(token.sub),
          name: user?.name ?? (token.name as string | undefined),
          email: user?.email ?? (token.email as string | undefined),
          image: user?.image ?? (token.picture as string | undefined)
        });
      }

      if (trigger === 'update' && session) {
        if (session.name) {
          token.name = session.name as string;
        }
        if (session.image) {
          token.picture = session.image as string;
        }
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
