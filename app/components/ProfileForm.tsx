'use client';

import { Alert, Avatar, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';

import type { UserProfile } from '@/lib/user';

type ProfileFormProps = {
  initialProfile: UserProfile;
};

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { update } = useSession();
  const [name, setName] = useState(initialProfile.name ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initialProfile.name ?? '');
  }, [initialProfile.name]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? '保存に失敗しました');
      }

      await update({ name });
      setMessage('プロフィールを保存しました');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar
              src={initialProfile.image ?? undefined}
              alt={initialProfile.name ?? 'ユーザー'}
              sx={{ width: 72, height: 72 }}
            />
            <Box>
              <Typography variant="h6">{initialProfile.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                Googleアカウントで連携中
              </Typography>
            </Box>
          </Stack>

          <TextField
            label="表示名"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
          />

          {message ? <Alert severity="success">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? '保存中…' : '変更を保存'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
