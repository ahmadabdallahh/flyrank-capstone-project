"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Review" },
  { href: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-40 mt-5 flex justify-center px-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="flex w-full max-w-md items-center justify-between gap-2 rounded-full border border-hairline bg-surface/80 p-1.5 pr-2 shadow-sm backdrop-blur-xl"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-ink"
          aria-label="AI Smart Reviewer — home"
        >
          <BrandMark className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline">Reviewer</span>
          <span className="sm:hidden">AI</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-accent text-accent-ink"
                    : "text-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}