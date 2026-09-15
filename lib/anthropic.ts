import Anthropic from '@anthropic-ai/sdk';

import type { CareerRoadmap, DiagnosisAnswers } from '@/lib/diagnosis-types';

const MODEL = 'claude-haiku-4-5-20251001';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }
  return new Anthropic({ apiKey });
}

function buildPrompt(answers: DiagnosisAnswers): string {
  return `あなたはキャリアコンサルタントです。以下の5問の回答をもとに、日本語でキャリアロードマップを作成してください。

【職業適性】
${answers.careerAptitude}

【スキル】
${answers.skills}

【興味関心】
${answers.interests}

【価値観】
${answers.values}

【働き方】
${answers.workStyle}

必ず次のJSONオブジェクトのみを返してください（説明文やコードフェンスは不要）:
{
  "summary": "全体の要約（2〜4文）",
  "shortTerm": "短期プラン（〜3ヶ月）の具体的な行動提案",
  "midTerm": "中期プラン（〜1年）の目標と学びの方向性",
  "longTerm": "長期プラン（〜3年）のキャリアビジョン"
}`;
}

function parseRoadmap(text: string): CareerRoadmap {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? jsonMatch[0] : trimmed;
  const parsed = JSON.parse(raw) as Partial<CareerRoadmap>;

  if (
    typeof parsed.summary !== 'string' ||
    typeof parsed.shortTerm !== 'string' ||
    typeof parsed.midTerm !== 'string' ||
    typeof parsed.longTerm !== 'string'
  ) {
    throw new Error('Invalid roadmap JSON from Claude');
  }

  return {
    summary: parsed.summary.trim(),
    shortTerm: parsed.shortTerm.trim(),
    midTerm: parsed.midTerm.trim(),
    longTerm: parsed.longTerm.trim()
  };
}

function mockRoadmap(answers: DiagnosisAnswers): CareerRoadmap {
  return {
    summary: `「${answers.interests || '関心分野'}」への関心と「${answers.values || '大切にしたい価値観'}」を軸に、現在のスキルを活かしながら段階的にキャリアを広げる方針が適しています。`,
    shortTerm: `今後3ヶ月は、${answers.skills || '現在のスキル'}を整理し、小さな成果物や学習記録を週1回ペースで積み上げてください。あわせて、関心のある職種の情報収集（求人・記事・コミュニティ）を始めましょう。`,
    midTerm: `1年以内に、${answers.careerAptitude || '適性'}を活かせる役割で実務経験やポートフォリオを増やし、希望する働き方（${answers.workStyle || '理想の働き方'}）に近い環境を具体化してください。`,
    longTerm: `3年スパンでは、${answers.values || '価値観'}を満たせる領域で専門性を深め、キャリアの選択肢（昇進・転職・副業・独立など）を自ら設計できる状態を目指しましょう。`
  };
}

/**
 * 診断回答からキャリアロードマップ（短期・中期・長期）を生成する
 *
 * ANTHROPIC_API_KEY がある場合は Claude を呼ぶ（AUTH_MOCK_MODE でも課金確認できるようにする）。
 * キー未設定の開発時のみモックへフォールバックする。API失敗は握りつぶさず呼び出し元へ返す。
 */
export async function analyzeDiagnosis(
  answers: DiagnosisAnswers
): Promise<CareerRoadmap> {
  if (!process.env.ANTHROPIC_API_KEY) {
    if (process.env.AUTH_MOCK_MODE === 'true' || process.env.NODE_ENV !== 'production') {
      console.warn('[anthropic] ANTHROPIC_API_KEY is not set, using mock roadmap');
      return mockRoadmap(answers);
    }
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const client = getClient();
  console.log('[anthropic] calling Claude API', MODEL);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: buildPrompt(answers)
      }
    ]
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Empty response from Claude');
  }

  try {
    const roadmap = parseRoadmap(textBlock.text);
    console.log('[anthropic] Claude API succeeded');
    return roadmap;
  } catch {
    // JSONパース失敗時はテキスト全体を短期プランに入れて最低限返す
    console.warn('[anthropic] Claude response was not valid JSON, using raw text fallback');
    return {
      summary: 'AIによるキャリア分析結果です。',
      shortTerm: textBlock.text,
      midTerm: '中期プランの詳細は、回答内容を見直し再診断してください。',
      longTerm: '長期プランの詳細は、回答内容を見直し再診断してください。'
    };
  }
}
