export type RecognitionResultData = {
  expression: string;
  result: string;
  confidencePercent: number;
  latencyMs: number;
  latencyLabel: string;
  latex: string;
  precisionLabel: string;
  resultKind: string;
  operationLabel: string;
  expressionId: string;
  detectedCount: number;
  canvasSize: string;
};

export type OcrResult = {
  text: string;
  confidence: number;
  latencyMs: number;
};

export type CalculationResult = {
  expression: string;
  equation: string;
  result: string;
  latencyMs: number;
};
