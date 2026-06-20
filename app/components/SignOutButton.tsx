'use client';

import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <Button variant="outlined" color="inherit" onClick={() => signOut({ callbackUrl: '/' })}>
      ログアウト
    </Button>
  );
}
