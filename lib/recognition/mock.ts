import type { RecognitionResultData } from "./types";

/** Temporary fixture so the UI can be reviewed before a recognizer is wired. */
export const MOCK_RECOGNITION: RecognitionResultData = {
  expression: "2 + 2",
  result: "4",
  confidencePercent: 96.4,
  latencyMs: 32,
  latencyLabel: "0.032s LATENCY",
  latex: "2 + 2 = 4",
  precisionLabel: "정밀도: 100%",
  resultKind: "RESULT INTEGER",
  operationLabel: "표준 사칙연산 (정수 덧셈)",
  expressionId: "#08492",
  detectedCount: 1,
  canvasSize: "880 × 380 PX",
};

export const EXAMPLE_EXPRESSIONS = [
  "2 + 2",
  "15 × 8 - 40",
  "√(144) + 5",
  "3/4 + 1/2",
  "3x + 7 = 22",
] as const;
