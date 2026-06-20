import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

const isMockMode = process.env.AUTH_MOCK_MODE === 'true';

const mockImage =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2750%27%20r%3D%2745%27%20fill%3D%27%23a78bfa%27/%3E%3Ctext%20x%3D%2750%27%20y%3D%2758%27%20text-anchor%3D%27middle%27%20font-size%3D%2742%27%20fill%3D%27white%27%3EM%3C/text%3E%3C/svg%3E";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    ...(isMockMode
      ? [
          Credentials({
            name: 'Mock',
            credentials: {
              email: { label: 'Email', type: 'text' },
              name: { label: 'Name', type: 'text' }
            },
            async authorize(credentials) {
              const email =
                typeof credentials?.email === 'string'
                  ? credentials.email
                  : 'mock@example.com';
              const name =
                typeof credentials?.name === 'string'
                  ? credentials.name
                  : 'テストユーザー';

              // NextAuth の `jwt` callback で token.sub に入るため、必ず id を返す
              return {
                id: `mock-${email}`,
                name,
                email,
                image: mockImage
              };
            }
          })
        ]
      : [])
  ],
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

      if (isProtected && !isLoggedIn) {
        return false;
      }

      return true;
    }
  },
  trustHost: true
} satisfies NextAuthConfig;
