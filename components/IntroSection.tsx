import type { RecognitionResultData } from "@/lib/recognition/types";

type IntroSectionProps = {
  specimen: RecognitionResultData;
};

export function IntroSection({ specimen }: IntroSectionProps) {
  return (
    <section
      id="how-it-works"
      className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pt-pad-xl pb-pad-lg"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-pad-lg">
        <div className="space-y-pad-sm max-w-2xl">
          <div className="flex flex-wrap items-center gap-pad-sm">
            <span className="inline-flex items-center gap-1.5 px-pad-sm py-0.5 rounded bg-surface-container-high text-secondary font-label-mono text-label-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
              HANDWRITTEN MATH SOLVER · SHEET 01
            </span>
            <span className="text-secondary/60 font-code-dense text-code-dense">
              120GSM · RULER OFF
            </span>
          </div>
          <h1 className="font-headline-lg text-[28px] leading-9 tracking-tight md:text-headline-lg text-on-surface">
            손으로 쓰면, 바로 풀립니다.
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            수식을 직접 작성해 보세요. 손글씨를 인식하고 계산 결과를 정갈하게
            보여드립니다.
          </p>
        </div>
        <div className="self-start md:self-auto bg-surface-container-lowest shadow-sm rounded-xl p-pad-md flex items-center gap-pad-md">
          <div className="h-10 w-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[20px]">gesture</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-mono text-label-mono text-secondary uppercase">
              PENCIL RECOGNITION
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-math-display text-math-display text-on-surface italic">
                {specimen.expression}
              </span>
              <span className="font-code-dense text-code-dense text-primary-container font-medium">
                →
              </span>
              <span className="font-headline-md text-headline-md text-primary-container font-semibold">
                {specimen.result}
              </span>
            </div>
          </div>
          <div className="ml-pad-sm pl-pad-sm bg-surface-container-high w-px h-8" />
          <span className="font-label-mono text-label-mono text-secondary px-pad-xs">
            {specimen.latencyLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
