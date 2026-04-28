"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LiveRefresh({ interval = 5000 }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), interval);
    const onFocus = () => router.refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [router, interval]);
  return null;
}
