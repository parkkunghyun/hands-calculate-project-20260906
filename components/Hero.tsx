import { ActionLink } from "@/components/ActionLink";
import { BrandLogo } from "@/components/BrandLogo";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pt-pad-xl pb-pad-lg flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 px-pad-md py-1 rounded-full bg-surface-container-high text-secondary font-label-mono text-[16px] uppercase tracking-widest">
          HANDWRITING RECOGNITION LAB
        </span>
        <div className="mt-pad-md">
          <BrandLogo size="hero" />
        </div>
        <h1 className="mt-pad-md max-w-3xl font-headline-lg text-[32px] leading-10 md:text-[48px] md:leading-[1.15] tracking-tight text-on-surface">
          손으로 쓰면, 바로 이해합니다.
        </h1>
        <p className="mt-pad-sm max-w-xl font-body-md text-[20px] leading-7 text-secondary">
          숫자와 수식을 직접 작성해보세요. 손글씨를 텍스트로 인식하고, 수학식은
          계산 결과까지 보여드립니다.
        </p>
        <div className="mt-pad-lg flex flex-col sm:flex-row items-center justify-center gap-pad-sm">
          <ActionLink href="/recognize" variant="accent">
            손글씨 인식하기
          </ActionLink>
          <ActionLink href="/calculate" variant="paper">
            손글씨로 계산하기
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
