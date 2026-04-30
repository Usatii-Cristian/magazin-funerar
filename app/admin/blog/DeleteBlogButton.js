"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBlogButton({ postId, postTitle }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/blog/${postId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-stone-500">Sigur?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
        >
          {deleting ? "..." : "Da"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-600 hover:bg-stone-200"
        >
          Nu
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
      title={`Șterge: ${postTitle}`}
    >
      Șterge
    </button>
  );
}
