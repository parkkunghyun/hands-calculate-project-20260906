import type { OcrResult } from "@/lib/recognition/types";

type RecognitionResultProps = {
  result: OcrResult | null;
  error: string | null;
  converting: boolean;
};

export function RecognitionResult({
  result,
  error,
  converting,
}: RecognitionResultProps) {
  return (
    <section className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pb-pad-2xl">
      <div className="mb-pad-base bg-surface-container rounded-lg px-pad-base py-pad-sm flex flex-wrap items-center justify-between gap-pad-md">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={`flex items-center justify-center w-5 h-5 rounded-full ${
              error
                ? "bg-error text-on-primary"
                : result
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-dim text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {error ? "close" : result ? "check" : "more_horiz"}
            </span>
          </span>
          <span className="font-label-ui text-label-ui text-on-surface font-medium">
            {converting
              ? "Gemini가 손글씨를 읽고 있습니다."
              : error
                ? error
                : result
                  ? "손글씨를 텍스트로 읽었습니다"
                  : "아직 변환된 글씨가 없습니다. 캔버스에 쓴 뒤 변환을 눌러 주세요."}
          </span>
        </div>
        {result && (
          <span className="font-label-mono text-label-mono text-secondary uppercase">
            Gemini · {result.latencyMs}ms
          </span>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-pad-lg">
        <div className="flex items-center justify-between pb-pad-sm">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-surface-container-high font-label-mono text-label-mono flex items-center justify-center text-secondary">
              01
            </span>
            <span className="font-title-editorial text-title-editorial text-on-surface font-medium">
              변환된 텍스트
            </span>
          </div>
          <span className="font-label-mono text-label-mono text-secondary uppercase">
            {result ? `${result.latencyMs}ms` : "대기"}
          </span>
        </div>
        <div className="mt-pad-md bg-surface-container-low rounded-lg p-pad-base min-h-16 flex items-center">
          <p className="font-math-display text-math-display text-on-surface tracking-wide">
            {result?.text ?? "—"}
          </p>
        </div>
        <p className="pt-pad-md font-body-sm text-body-sm text-secondary italic">
          * 이번 단계는 계산 없이, 손글씨가 글자로 바뀌는지만 확인합니다.
        </p>
      </div>
    </section>
  );
}
