import Link from "next/link";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop py-pad-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-pad-base">
          <Link
            href="/recognize"
            className="group rounded-[28px] bg-[#1e3a8a] text-white p-pad-xl min-h-72 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-pad-sm">
              <span className="font-label-mono text-[16px] uppercase tracking-widest text-white/70">
                01 · 인식
              </span>
              <h2 className="font-headline-lg text-[36px] leading-10">
                손글씨 인식하기
              </h2>
              <p className="font-body-md text-[20px] leading-7 text-white/80">
                숫자나 글자를 하나 쓰면 텍스트로 바꿉니다.
              </p>
            </div>
            <p className="font-display-hero text-[56px] leading-none">7 → 7</p>
          </Link>
          <Link
            href="/calculate"
            className="group rounded-[28px] bg-[#f4c430] text-on-surface p-pad-xl min-h-72 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-pad-sm">
              <span className="font-label-mono text-[16px] uppercase tracking-widest text-on-surface/70">
                02 · 계산
              </span>
              <h2 className="font-headline-lg text-[36px] leading-10">
                손글씨로 계산하기
              </h2>
              <p className="font-body-md text-[20px] leading-7 text-on-surface/80">
                수식을 쓰면 숫자와 연산자를 읽고 결과까지 보여줍니다.
              </p>
            </div>
            <p className="font-display-hero text-[48px] leading-none">
              2 + 2 = 4
            </p>
          </Link>
        </div>
      </section>
      <section
        id="about"
        className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pb-pad-2xl"
      >
        <div className="max-w-2xl space-y-pad-sm">
          <span className="font-label-mono text-[16px] text-secondary uppercase tracking-widest">
            프로젝트 소개
          </span>
          <h2 className="font-headline-lg text-[32px] leading-10 text-on-surface">
            손글씨를 읽고, 수식이면 계산합니다.
          </h2>
          <p className="font-body-md text-[20px] leading-7 text-secondary">
            인식은 글자를 텍스트로 바꾸는 기능이고, 계산은 그 위에 연산을 더하는
            기능입니다. 먼저 하고 싶은 작업을 고르면 됩니다.
          </p>
        </div>
      </section>
    </>
  );
}
