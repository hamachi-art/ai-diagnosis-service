'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import {
  DIAGNOSIS_QUESTIONS,
  EMPTY_ANSWERS,
  type DiagnosisAnswers
} from '@/lib/diagnosis-types';

export function DiagnosisForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<DiagnosisAnswers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = DIAGNOSIS_QUESTIONS[step];
  const progress = ((step + 1) / DIAGNOSIS_QUESTIONS.length) * 100;
  const currentValue = answers[current.key];
  const canGoNext = currentValue.trim().length > 0;

  function updateAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < DIAGNOSIS_QUESTIONS.length - 1) {
      if (!canGoNext) return;
      setStep((prev) => prev + 1);
      return;
    }

    if (!canGoNext) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const data = (await response.json()) as { id?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? '診断に失敗しました');
      }

      if (!data.id) {
        throw new Error('診断結果IDを取得できませんでした');
      }

      router.push(`/diagnosis/result?id=${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '診断に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              質問 {step + 1} / {DIAGNOSIS_QUESTIONS.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1 }} />
          </Box>

          <Box>
            <Typography variant="overline" color="secondary.main">
              {current.label}
            </Typography>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {current.prompt}
            </Typography>
          </Box>

          <TextField
            value={currentValue}
            onChange={(event) => updateAnswer(event.target.value)}
            placeholder={current.placeholder}
            multiline
            minRows={4}
            fullWidth
            required
            disabled={submitting}
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Button
              type="button"
              variant="outlined"
              disabled={step === 0 || submitting}
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            >
              戻る
            </Button>
            <Button type="submit" variant="contained" disabled={!canGoNext || submitting}>
              {submitting
                ? 'AI分析中…'
                : step < DIAGNOSIS_QUESTIONS.length - 1
                  ? '次へ'
                  : '診断する'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
