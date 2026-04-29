"use client";

import { useEffect, useState } from "react";

const KEY = "primnord:compare";
const MAX = 3;

const subscribers = new Set();
function emit() {
  subscribers.forEach((fn) => fn());
}

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function write(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  emit();
}

export function useCompare() {
  const [ids, setIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(read());
    setHydrated(true);
    const fn = () => setIds(read());
    subscribers.add(fn);
    const onStorage = (e) => {
      if (e.key === KEY) setIds(read());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      subscribers.delete(fn);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggle(id) {
    const cur = read();
    if (cur.includes(id)) {
      write(cur.filter((x) => x !== id));
    } else if (cur.length < MAX) {
      write([...cur, id]);
    }
  }

  function remove(id) {
    write(read().filter((x) => x !== id));
  }

  function clear() {
    write([]);
  }

  return {
    ids,
    hydrated,
    toggle,
    remove,
    clear,
    has: (id) => ids.includes(id),
    full: ids.length >= MAX,
    max: MAX,
  };
}
