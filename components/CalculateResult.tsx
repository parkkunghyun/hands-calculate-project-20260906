import type { CalculationResult } from "@/lib/recognition/types";

type CalculateResultProps = {
  result: CalculationResult | null;
  error: string | null;
  converting: boolean;
};

export function CalculateResult({
  result,
  error,
  converting,
}: CalculateResultProps) {
  return (
    <section className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pb-pad-2xl">
      <div className="mb-pad-base bg-surface-container rounded-lg px-pad-base py-pad-sm">
        <span className="font-label-ui text-label-ui text-on-surface font-medium">
          {converting
            ? "수식을 읽고 계산하고 있습니다."
            : error
              ? error
              : result
                ? "계산이 완료되었습니다"
                : "수식을 쓴 뒤 계산하기를 눌러 주세요."}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-pad-base">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-pad-lg">
          <div className="flex items-center gap-2 pb-pad-sm">
            <span className="w-5 h-5 rounded bg-surface-container-high font-label-mono text-label-mono flex items-center justify-center text-secondary">
              01
            </span>
            <span className="font-title-editorial text-title-editorial text-on-surface font-medium">
              인식된 수식
            </span>
          </div>
          <div className="mt-pad-md bg-surface-container-low rounded-lg p-pad-base min-h-16 flex items-center">
            <p className="font-math-display text-math-display text-on-surface tracking-wide">
              {result?.expression ?? "—"}
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-pad-lg">
          <div className="flex items-center gap-2 pb-pad-sm">
            <span className="w-5 h-5 rounded bg-surface-container-high font-label-mono text-label-mono flex items-center justify-center text-secondary">
              02
            </span>
            <span className="font-title-editorial text-title-editorial text-on-surface font-medium">
              계산 결과
            </span>
          </div>
          <div className="mt-pad-md bg-surface-container-low rounded-lg p-pad-base min-h-16 flex items-baseline gap-pad-sm">
            <span className="font-math-display text-math-display text-secondary">
              =
            </span>
            <span className="font-display-hero text-[40px] leading-none md:text-display-hero text-on-surface font-semibold">
              {result?.result ?? "—"}
            </span>
          </div>
          <p className="pt-pad-md font-code-dense text-code-dense text-secondary">
            {result?.equation ?? "예: 2 + 2 = 4"}
          </p>
        </div>
      </div>
    </section>
  );
}
