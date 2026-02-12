
export interface AnalysisResult {
  score: number; // 0-100, higher means more professional
  title: string; // Like "韭菜本韭", "反向指标大师", etc.
  tags: string[]; // ['追涨杀跌', '死扛到底', '频繁交易']
  roast: string; // The main spicy commentary
  behaviorAnalysis: {
    point: string;
    description: string;
  }[];
  suggestion: string;
}

export interface AppState {
  isAnalyzing: boolean;
  image: string | null;
  result: AnalysisResult | null;
  error: string | null;
}
