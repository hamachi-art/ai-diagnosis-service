'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Diagnosis } from '@/lib/diagnosis-types';

type DiagnosisHistoryListProps = {
  initialDiagnoses: Diagnosis[];
};

export function DiagnosisHistoryList({ initialDiagnoses }: DiagnosisHistoryListProps) {
  const router = useRouter();
  const [diagnoses, setDiagnoses] = useState(initialDiagnoses);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm('この診断結果を削除しますか？')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/diagnosis/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? '削除に失敗しました');
      }

      setDiagnoses((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '削除に失敗しました');
    } finally {
      setDeletingId(null);
    }
  }

  if (diagnoses.length === 0) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography>まだ診断履歴がありません。</Typography>
            <Button component={Link} href="/diagnosis" variant="contained">
              診断をはじめる
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {diagnoses.map((diagnosis) => (
        <Card key={diagnosis.id}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
              {new Date(diagnosis.createdAt).toLocaleString('ja-JP')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {diagnosis.careerRoadmap.summary}
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: 'wrap' }}>
            <Button component={Link} href={`/diagnosis/${diagnosis.id}`} size="small">
              詳細
            </Button>
            <Button
              component={Link}
              href={`/diagnosis/${diagnosis.id}/edit`}
              size="small"
              variant="outlined"
            >
              編集
            </Button>
            <Button
              size="small"
              color="error"
              disabled={deletingId === diagnosis.id}
              onClick={() => handleDelete(diagnosis.id)}
            >
              {deletingId === diagnosis.id ? '削除中…' : '削除'}
            </Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
}
