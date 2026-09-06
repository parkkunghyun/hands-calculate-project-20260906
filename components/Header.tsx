"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";

const NAV_ITEMS = [
  { href: "/recognize", label: "손글씨 인식", short: "인식" },
  { href: "/calculate", label: "손글씨 계산", short: "계산" },
  { href: "/#about", label: "프로젝트 소개", short: "소개" },
] as const;

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href;
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-[72px] w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between">
        <Link href="/" aria-label="홈" className="inline-flex items-center">
          <BrandLogo size="nav" />
        </Link>
        <nav className="flex items-center gap-pad-md md:gap-pad-lg">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-on-surface font-medium underline underline-offset-8 decoration-primary decoration-1"
                    : "font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface transition-colors"
                }
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
