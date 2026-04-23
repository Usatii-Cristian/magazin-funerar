"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ messageId, isRead, isDelivered }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null); // "read" | "deliver" | null

  async function patch(action) {
    setLoading(action);
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: messageId, action }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex shrink-0 flex-col gap-2">
      {!isRead && (
        <button
          onClick={() => patch("read")}
          disabled={loading !== null}
          className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-200 disabled:opacity-60"
        >
          {loading === "read" ? "..." : "Marchează citit"}
        </button>
      )}
      {!isDelivered && (
        <button
          onClick={() => patch("deliver")}
          disabled={loading !== null}
          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60"
        >
          {loading === "deliver" ? "..." : "Marchează livrat"}
        </button>
      )}
    </div>
  );
}
