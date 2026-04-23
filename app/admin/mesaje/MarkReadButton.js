"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ messageId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markRead() {
    setLoading(true);
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: messageId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={markRead}
      disabled={loading}
      className="shrink-0 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-200 disabled:opacity-60"
    >
      {loading ? "..." : "Marchează citit"}
    </button>
  );
}
