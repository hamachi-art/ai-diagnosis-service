'use client';

import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import {
  DIAGNOSIS_QUESTIONS,
  type CareerRoadmap,
  type DiagnosisAnswers
} from '@/lib/diagnosis-types';

type DiagnosisEditFormProps = {
  id: string;
  initialAnswers: DiagnosisAnswers;
  initialRoadmap: CareerRoadmap;
};

export function DiagnosisEditForm({
  id,
  initialAnswers,
  initialRoadmap
}: DiagnosisEditFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<DiagnosisAnswers>(initialAnswers);
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(initialRoadmap);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/diagnosis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          careerRoadmap: roadmap
        })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? '更新に失敗しました');
      }

      setMessage('診断結果を更新しました');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('この診断結果を削除しますか？')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/diagnosis/${id}`, {
        method: 'DELETE'
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? '削除に失敗しました');
      }

      router.push('/diagnosis/history');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            回答の編集
          </Typography>

          {DIAGNOSIS_QUESTIONS.map((question) => (
            <TextField
              key={question.key}
              label={question.label}
              value={answers[question.key]}
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.key]: event.target.value
                }))
              }
              multiline
              minRows={2}
              fullWidth
              required
            />
          ))}

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ロードマップの編集
          </Typography>

          <TextField
            label="総合コメント"
            value={roadmap.summary}
            onChange={(event) =>
              setRoadmap((prev) => ({ ...prev, summary: event.target.value }))
            }
            multiline
            minRows={2}
            fullWidth
            required
          />
          <TextField
            label="短期プラン"
            value={roadmap.shortTerm}
            onChange={(event) =>
              setRoadmap((prev) => ({ ...prev, shortTerm: event.target.value }))
            }
            multiline
            minRows={3}
            fullWidth
            required
          />
          <TextField
            label="中期プラン"
            value={roadmap.midTerm}
            onChange={(event) =>
              setRoadmap((prev) => ({ ...prev, midTerm: event.target.value }))
            }
            multiline
            minRows={3}
            fullWidth
            required
          />
          <TextField
            label="長期プラン"
            value={roadmap.longTerm}
            onChange={(event) =>
              setRoadmap((prev) => ({ ...prev, longTerm: event.target.value }))
            }
            multiline
            minRows={3}
            fullWidth
            required
          />

          {message ? <Alert severity="success">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button type="submit" variant="contained" disabled={saving || deleting}>
              {saving ? '保存中…' : '変更を保存'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="error"
              disabled={saving || deleting}
              onClick={handleDelete}
            >
              {deleting ? '削除中…' : '削除する'}
            </Button>
            <Button
              type="button"
              variant="text"
              disabled={saving || deleting}
              onClick={() => router.push(`/diagnosis/${id}`)}
            >
              詳細に戻る
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
