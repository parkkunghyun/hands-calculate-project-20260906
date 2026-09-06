"use client";

import { useState } from "react";
import { CalculateResult } from "@/components/CalculateResult";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { evaluateExpression } from "@/lib/recognition/evaluate";
import type { CalculationResult } from "@/lib/recognition/types";

export function CalculateWorkbench() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  return (
    <>
      <DrawingCanvas
        converting={converting}
        actionLabel="계산하기"
        busyLabel="계산 중..."
        readyHint="작성됨 · 계산 대기"
        actionIcon="bolt"
        onConvertStart={() => {
          setConverting(true);
          setError(null);
        }}
        onConverted={(ocr) => {
          try {
            const calculation = evaluateExpression(ocr.text);
            setResult({ ...calculation, latencyMs: ocr.latencyMs });
          } catch (next) {
            setResult(null);
            setError(
              next instanceof Error
                ? `인식됨: ${ocr.text}. ${next.message}`
                : "계산에 실패했습니다.",
            );
          }
          setConverting(false);
        }}
        onConvertError={(message) => {
          setError(message);
          setConverting(false);
        }}
      />
      <CalculateResult
        result={result}
        error={error}
        converting={converting}
      />
    </>
  );
}
