import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-hairline">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row">
        <p className="font-mono text-xs text-faint">
          AI Smart Code &amp; Resume Reviewer
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            Review
          </Link>
          <Link
            href="/settings"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            Settings
          </Link>
          <span className="flex items-center gap-1.5 font-mono text-xs text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-pass" aria-hidden="true" />
            live
          </span>
        </div>
      </div>
    </footer>
  );
}