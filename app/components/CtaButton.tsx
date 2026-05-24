'use client';

import * as React from 'react';
import { Alert, Button, Snackbar } from '@mui/material';

import { ctaGradient, ctaGradientHover } from '../styles/cosmic';

type Props = {
  label?: string;
  size?: 'small' | 'medium' | 'large';
};

export function CtaButton({ label = '無料で診断を始める', size = 'large' }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        size={size}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          px: 4,
          py: 1.4,
          borderRadius: 999,
          color: '#fff',
          background: ctaGradient,
          boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4), 0 0 40px rgba(34, 211, 238, 0.15)',
          '&:hover': {
            background: ctaGradientHover,
            boxShadow: '0 14px 36px rgba(124, 58, 237, 0.5), 0 0 50px rgba(236, 72, 153, 0.2)'
          }
        }}
      >
        {label}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={2400}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="info" variant="filled">
          Coming Soon（Stage2以降で提供予定）
        </Alert>
      </Snackbar>
    </>
  );
}
