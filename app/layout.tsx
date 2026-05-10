import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: '5問でわかる、あなたのキャリア | AIキャリア診断',
  description:
    '5問の質問に答えるだけで、AIがあなたに最適なキャリアロードマップを提案します。'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

