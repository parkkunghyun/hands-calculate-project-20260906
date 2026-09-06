"use client";

import { useState } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { RecognitionResult } from "@/components/RecognitionResult";
import type { OcrResult } from "@/lib/recognition/types";

export function ScribbleWorkbench() {
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  return (
    <>
      <DrawingCanvas
        converting={converting}
        onConvertStart={() => {
          setConverting(true);
          setError(null);
        }}
        onConverted={(next) => {
          setResult(next);
          setConverting(false);
        }}
        onConvertError={(message) => {
          setError(message);
          setConverting(false);
        }}
      />
      <RecognitionResult
        result={result}
        error={error}
        converting={converting}
      />
    </>
  );
}
