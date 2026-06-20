'use client';

import { Button, Stack } from '@mui/material';
import { signIn } from 'next-auth/react';

type MockSignInButtonProps = {
  callbackUrl: string;
};

export function MockSignInButton({ callbackUrl }: MockSignInButtonProps) {
  return (
    <Stack spacing={1}>
      <Button
        variant="outlined"
        size="large"
        onClick={() =>
          signIn('credentials', {
            callbackUrl,
            email: 'mock@example.com',
            name: 'テストユーザー'
          })
        }
        fullWidth
      >
        モックログイン（開発用）
      </Button>
    </Stack>
  );
}

