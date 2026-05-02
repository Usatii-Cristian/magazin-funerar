"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LiveRefresh({ interval = 20000 }) {
  const router = useRouter();
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = setInterval(tick, interval);
    const onWake = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    window.addEventListener("focus", onWake);
    document.addEventListener("visibilitychange", onWake);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onWake);
      document.removeEventListener("visibilitychange", onWake);
    };
  }, [router, interval]);
  return null;
}
