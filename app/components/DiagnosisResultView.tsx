'use client';

import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import Link from 'next/link';

import {
  DIAGNOSIS_QUESTIONS,
  type CareerRoadmap,
  type DiagnosisAnswers
} from '@/lib/diagnosis-types';

type DiagnosisResultViewProps = {
  id: string;
  answers: DiagnosisAnswers;
  careerRoadmap: CareerRoadmap;
  createdAt?: string | Date;
  showActions?: boolean;
};

const PLAN_SECTIONS: { key: keyof CareerRoadmap; label: string }[] = [
  { key: 'summary', label: '総合コメント' },
  { key: 'shortTerm', label: '短期プラン（〜3ヶ月）' },
  { key: 'midTerm', label: '中期プラン（〜1年）' },
  { key: 'longTerm', label: '長期プラン（〜3年）' }
];

export function DiagnosisResultView({
  id,
  answers,
  careerRoadmap,
  createdAt,
  showActions = true
}: DiagnosisResultViewProps) {
  const createdLabel = createdAt
    ? new Date(createdAt).toLocaleString('ja-JP')
    : null;

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              キャリアロードマップ
            </Typography>
            {createdLabel ? (
              <Typography variant="body2" color="text.secondary">
                診断日時: {createdLabel}
              </Typography>
            ) : null}

            {PLAN_SECTIONS.map((section) => (
              <Stack key={section.key} spacing={1}>
                <Typography variant="subtitle1" color="secondary.main" sx={{ fontWeight: 700 }}>
                  {section.label}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {careerRoadmap[section.key]}
                </Typography>
                {section.key !== 'longTerm' ? <Divider /> : null}
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              あなたの回答
            </Typography>
            {DIAGNOSIS_QUESTIONS.map((question) => (
              <Stack key={question.key} spacing={0.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  {question.label}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {answers[question.key]}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {showActions ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component={Link} href={`/diagnosis/${id}/edit`} variant="contained">
            結果を編集
          </Button>
          <Button component={Link} href="/diagnosis/history" variant="outlined">
            履歴一覧
          </Button>
          <Button component={Link} href="/diagnosis" variant="outlined">
            もう一度診断
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
