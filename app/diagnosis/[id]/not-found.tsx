import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';

export default function DiagnosisNotFound() {
  return (
    <Stack spacing={2} sx={{ py: 8, alignItems: 'flex-start' }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        診断結果が見つかりません
      </Typography>
      <Typography color="text.secondary">
        指定された診断結果は存在しないか、アクセス権限がありません。
      </Typography>
      <Button component={Link} href="/diagnosis/history" variant="contained">
        履歴一覧へ
      </Button>
    </Stack>
  );
}
