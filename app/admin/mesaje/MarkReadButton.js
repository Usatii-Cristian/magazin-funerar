"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StatusButtons({ messageId, isRead, isDelivered }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => patch(isRead ? "unread" : "read")}
        disabled={loading !== null}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
          isRead
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
        }`}
      >
        {loading === "read" || loading === "unread"
          ? "..."
          : isRead
          ? "✅ Contactat"
          : "❌ Necontactat"}
      </button>
      <button
        onClick={() => patch(isDelivered ? "undeliver" : "deliver")}
        disabled={loading !== null}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
          isDelivered
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
        }`}
      >
        {loading === "deliver" || loading === "undeliver"
          ? "..."
          : isDelivered
          ? "📦 Livrat"
          : "⏳ Nelivrat"}
      </button>
    </div>
  );
}
