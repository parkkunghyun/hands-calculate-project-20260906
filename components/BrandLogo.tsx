import Image from "next/image";

type BrandLogoProps = {
  size?: "nav" | "hero" | "footer";
};

const SIZES = {
  nav: { width: 132, height: 88, className: "h-12 w-auto" },
  footer: { width: 108, height: 72, className: "h-10 w-auto" },
  hero: { width: 280, height: 186, className: "w-[min(46vw,200px)] h-auto" },
} as const;

export function BrandLogo({ size = "nav" }: BrandLogoProps) {
  const { width, height, className } = SIZES[size];
  return (
    <Image
      src="/logo-20260906.png"
      alt=""
      width={width}
      height={height}
      className={`${className} rounded-xl`}
      priority={size !== "footer"}
    />
  );
}
