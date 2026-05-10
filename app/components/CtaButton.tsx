'use client';

import * as React from 'react';
import { Alert, Button, Snackbar } from '@mui/material';

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
          background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0891b2 100%)',
            boxShadow: '0 14px 30px rgba(37, 99, 235, 0.32)'
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

