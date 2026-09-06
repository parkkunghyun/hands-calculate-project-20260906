import Link from "next/link";

type ActionLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "paper" | "accent" | "ghost";
};

const VARIANTS = {
  paper:
    "border border-[#d2cbbf] bg-surface-container-lowest text-on-surface hover:bg-surface-container",
  accent:
    "border border-transparent bg-accent text-on-surface hover:brightness-105",
  ghost:
    "border border-white/70 bg-transparent text-white hover:bg-white/10",
} as const;

export function ActionLink({
  href,
  children,
  variant = "paper",
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center min-h-12 min-w-44 px-pad-xl py-3 rounded-full font-label-ui text-[20px] transition-colors ${VARIANTS[variant]}`}
    >
      {children}
    </Link>
  );
}
