import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low/70 py-pad-xl mt-pad-3xl">
      <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-pad-base text-on-surface-variant font-label-ui text-[18px]">
        <div className="flex items-center gap-pad-md">
          <BrandLogo size="footer" />
          <span className="font-code-dense text-secondary">
            손글씨를 읽고, 수식이면 계산합니다.
          </span>
        </div>
        <span className="font-code-dense text-secondary">© 2026</span>
      </div>
    </footer>
  );
}
