export type DiagnosisAnswers = {
  careerAptitude: string;
  skills: string;
  interests: string;
  values: string;
  workStyle: string;
};

export type CareerRoadmap = {
  summary: string;
  shortTerm: string;
  midTerm: string;
  longTerm: string;
};

export type Diagnosis = {
  id: string;
  userId: string;
  answers: DiagnosisAnswers;
  /** AI分析結果（短期・中期・長期プラン） */
  careerRoadmap: CareerRoadmap;
  /** careerRoadmap のエイリアス（API互換） */
  result: CareerRoadmap;
  createdAt: Date;
  updatedAt: Date;
};

export type DiagnosisAnswersInput = DiagnosisAnswers;

export const DIAGNOSIS_QUESTIONS = [
  {
    key: 'careerAptitude' as const,
    label: '職業適性',
    prompt:
      '得意なことや、周囲から「向いている」と言われる仕事・役割があれば教えてください。',
    placeholder: '例：人と話すのが得意、データを整理するのが好き など'
  },
  {
    key: 'skills' as const,
    label: 'スキル',
    prompt: '現在持っているスキルや経験（仕事・学習・趣味含む）を教えてください。',
    placeholder: '例：Excel、接客、プログラミング入門、語学 など'
  },
  {
    key: 'interests' as const,
    label: '興味関心',
    prompt: '仕事や学びに関して、興味がある分野・テーマを教えてください。',
    placeholder: '例：デザイン、教育、ヘルスケア、スタートアップ など'
  },
  {
    key: 'values' as const,
    label: '価値観',
    prompt: 'キャリアで大切にしたい価値観を教えてください。',
    placeholder: '例：安定、成長、社会貢献、裁量大、ワークライフバランス など'
  },
  {
    key: 'workStyle' as const,
    label: '働き方',
    prompt: '理想の働き方や環境の希望を教えてください。',
    placeholder: '例：リモート、チームで協働、裁量のある個人ワーク など'
  }
] as const;

export const EMPTY_ANSWERS: DiagnosisAnswers = {
  careerAptitude: '',
  skills: '',
  interests: '',
  values: '',
  workStyle: ''
};
