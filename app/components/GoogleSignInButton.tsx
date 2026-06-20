'use client';

import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';

type GoogleSignInButtonProps = {
  callbackUrl?: string;
};

export function GoogleSignInButton({ callbackUrl = '/dashboard' }: GoogleSignInButtonProps) {
  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<GoogleIcon />}
      onClick={() => signIn('google', { callbackUrl })}
      fullWidth
    >
      Googleでログイン
    </Button>
  );
}
