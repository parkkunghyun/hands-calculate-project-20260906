import { ScribbleWorkbench } from "@/components/ScribbleWorkbench";

export default function RecognizePage() {
  return (
    <>
      <section className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pt-pad-xl pb-pad-lg">
        <div className="max-w-2xl space-y-pad-sm">
          <span className="inline-flex items-center gap-1.5 px-pad-sm py-0.5 rounded bg-surface-container-high text-secondary font-label-mono text-label-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            HANDWRITING RECOGNITION
          </span>
          <h1 className="font-headline-lg text-[28px] leading-9 tracking-tight md:text-headline-lg text-on-surface">
            손글씨를 텍스트로 바꿉니다.
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            숫자나 글자를 작성한 뒤 변환을 누르면 인식 결과를 보여줍니다. 예: 7
            → 7, A → A
          </p>
        </div>
      </section>
      <ScribbleWorkbench />
    </>
  );
}
