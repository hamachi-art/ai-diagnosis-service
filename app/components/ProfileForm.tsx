'use client';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { ALLOWED_AVATAR_ACCEPT, MAX_AVATAR_SIZE } from '@/lib/avatar-constants';
import { getDisplayImage, type UserProfile } from '@/lib/user-types';

type ProfileFormProps = {
  initialProfile: UserProfile;
};

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { update } = useSession();
  const router = useRouter();
  const [name, setName] = useState(initialProfile.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(getDisplayImage(initialProfile) ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(initialProfile.name ?? '');
    setAvatarUrl(getDisplayImage(initialProfile) ?? '');
  }, [initialProfile]);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setError(null);

    if (file.size > MAX_AVATAR_SIZE) {
      setError('ファイルサイズは300KB以下にしてください');
      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/profile/avatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? 'アップロードに失敗しました');
      }

      const data = (await response.json()) as UserProfile & { displayImage?: string };
      const newImage = data.displayImage ?? getDisplayImage(data) ?? '';

      setAvatarUrl(newImage);
      await update({ image: newImage });
      router.refresh();
      setMessage('プロフィール画像を更新しました');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

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
              src={avatarUrl || undefined}
              alt={initialProfile.name ?? 'ユーザー'}
              sx={{ width: 72, height: 72 }}
            />
            <Box>
              <Typography variant="h6">{initialProfile.email}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Googleアカウントで連携中
              </Typography>
              <Button variant="outlined" component="label" disabled={uploading} size="small">
                {uploading ? 'アップロード中…' : '画像を変更'}
                <input
                  type="file"
                  hidden
                  accept={ALLOWED_AVATAR_ACCEPT}
                  onChange={handleAvatarChange}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                300KB以下（JPEG / PNG / WebP / GIF）
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
