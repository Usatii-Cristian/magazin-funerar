"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function PaginationBar({ currentPage, totalPages }) {
  const params = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  function pageHref(p) {
    const sp = new URLSearchParams(params.toString());
    if (p === 1) sp.delete("page");
    else sp.set("page", String(p));
    const q = sp.toString();
    return q ? `${pathname}?${q}` : pathname;
  }

  // Build page list with ellipsis
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    }
  }
  const withGaps = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) withGaps.push("gap");
    withGaps.push(pages[i]);
  }

  const btnBase = "flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg px-3 text-sm transition";

  return (
    <nav aria-label="Paginare" className="mt-8 overflow-x-auto">
    <div className="flex min-w-max items-center justify-center gap-1 px-2">
      <Link
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`${btnBase} ${
          currentPage === 1
            ? "pointer-events-none text-stone-300"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        ←
      </Link>

      {withGaps.map((item, i) =>
        item === "gap" ? (
          <span key={`g${i}`} className="px-1 text-stone-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(item)}
            className={`${btnBase} ${
              item === currentPage
                ? "bg-stone-900 font-semibold text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`${btnBase} ${
          currentPage === totalPages
            ? "pointer-events-none text-stone-300"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        →
      </Link>
    </div>
    </nav>
  );
}
