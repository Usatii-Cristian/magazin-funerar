"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";

export default function ImageGallery({ images: rawImages, name, children }) {
  const images = (rawImages ?? []).filter(
    (s) => typeof s === "string" && s.length > 0
  );

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [, startTransition] = useTransition();

  // Refs for real-time gesture values — no React re-render on every frame
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef({ dist: null, scale: 1 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0, moved: false });
  const transformWrapperRef = useRef(null);
  const lightboxIndexRef = useRef(null);
  // Mirror lightboxIndex into a ref so the keyboard handler can read the
  // current value without re-binding on every change. Mutating refs during
  // render is an anti-pattern in concurrent React, so do it in an effect.
  useEffect(() => {
    lightboxIndexRef.current = lightboxIndex;
  }, [lightboxIndex]);

  // Apply CSS transform directly — bypasses React render cycle entirely
  function applyTransform(x, y, s, animated = false) {
    const el = transformWrapperRef.current;
    if (!el) return;
    el.style.transition = animated ? "transform 0.2s ease" : "none";
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  // Reset transform when image changes — runs after mount so ref is available
  useEffect(() => {
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    if (transformWrapperRef.current) {
      transformWrapperRef.current.style.transition = "none";
      transformWrapperRef.current.style.transform = "translate(0px,0px) scale(1)";
    }
    setZoomedIn(false);
    setIsDragging(false);
  }, [lightboxIndex]);

  // Keyboard nav — registered once; reads current index from ref to avoid re-registering
  useEffect(() => {
    function onKey(e) {
      const idx = lightboxIndexRef.current;
      if (idx === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft" && idx > 0)
        startTransition(() => setLightboxIndex((i) => i - 1));
      if (e.key === "ArrowRight" && idx < images.length - 1)
        startTransition(() => setLightboxIndex((i) => i + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pinch-to-zoom (touch) ──────────────────────────────────────────────────
  function getPinchDist(e) {
    const [a, b] = e.touches;
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: getPinchDist(e), scale: scaleRef.current };
    }
  }

  function onTouchMove(e) {
    if (e.touches.length !== 2 || pinchRef.current.dist === null) return;
    const ratio = getPinchDist(e) / pinchRef.current.dist;
    const newScale = Math.min(4, Math.max(1, pinchRef.current.scale * ratio));
    scaleRef.current = newScale;
    // Direct DOM — no setState, no re-render
    applyTransform(offsetRef.current.x, offsetRef.current.y, newScale);
  }

  function onTouchEnd() {
    pinchRef.current.dist = null;
    setZoomedIn(scaleRef.current > 1); // one setState only at gesture end
  }

  // ── Mouse drag-to-pan ──────────────────────────────────────────────────────
  function onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffX: offsetRef.current.x,
      startOffY: offsetRef.current.y,
      moved: false,
    };
    if (scaleRef.current > 1) setIsDragging(true);
  }

  function onMouseMove(e) {
    const d = dragRef.current;
    if (!d.active || scaleRef.current <= 1) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    const newX = d.startOffX + dx;
    const newY = d.startOffY + dy;
    offsetRef.current = { x: newX, y: newY };
    // Direct DOM — no setState, no re-render
    applyTransform(newX, newY, scaleRef.current);
  }

  function onMouseUp() {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    dragRef.current.moved = false;
    setIsDragging(false);
    if (!moved) {
      if (scaleRef.current > 1) {
        scaleRef.current = 1;
        offsetRef.current = { x: 0, y: 0 };
        applyTransform(0, 0, 1, true);
        setZoomedIn(false);
      } else {
        scaleRef.current = 2;
        applyTransform(0, 0, 2, true);
        setZoomedIn(true);
      }
    }
  }

  function onMouseLeave() {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      dragRef.current.moved = false;
      setIsDragging(false);
    }
  }

  const hasImages = images.length > 0;
  const imgCursor = zoomedIn
    ? isDragging ? "cursor-grabbing" : "cursor-grab"
    : "cursor-zoom-in";

  return (
    <>
      {/* Hero image */}
      <div
        className={`relative h-[55vh] min-h-[260px] sm:min-h-[360px] w-full overflow-hidden lg:max-h-[520px] ${
          hasImages ? "cursor-zoom-in bg-stone-900" : "bg-stone-800"
        }`}
        onClick={() => hasImages && setLightboxIndex(0)}
      >
        {hasImages ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-600">
            <svg className="h-24 w-24" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-stone-900/10" />

        {hasImages && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            Zoom
          </div>
        )}

        <div onClick={(e) => e.stopPropagation()} className="contents">
          {children}
        </div>
      </div>

      {/* Gallery thumbnails */}
      {images.length > 1 && (
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-stone-900">
            Galerie foto
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition-all ${
                  i === 0 ? "ring-gold-400" : "ring-transparent hover:ring-stone-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 120px"
                />
                {i === 0 && (
                  <div className="absolute bottom-0.5 left-0.5 rounded bg-gold-500/80 px-1 py-0.5 text-[10px] font-medium text-white">
                    Principal
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Counter */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Zoom hint */}
          <div className="absolute right-16 top-4 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/60">
            {zoomedIn ? "Trageți pentru a muta" : "Click / pinch pentru zoom"}
          </div>

          {/* Close */}
          <button
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="Închide"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); startTransition(() => setLightboxIndex((i) => i - 1)); }}
              aria-label="Anterior"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Next */}
          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); startTransition(() => setLightboxIndex((i) => i + 1)); }}
              aria-label="Următor"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Image + gesture surface */}
          <div
            className={`relative h-full w-full max-w-5xl select-none overflow-hidden p-4 ${imgCursor}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: "none" }}
          >
            {/* Transform target — mutated directly, never via setState */}
            <div
              ref={transformWrapperRef}
              className="absolute inset-0"
              style={{ transform: "translate(0px,0px) scale(1)", willChange: "transform" }}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${name} ${lightboxIndex + 1}`}
                fill
                draggable={false}
                className="pointer-events-none object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    startTransition(() => setLightboxIndex(i));
                  }}
                  className={`relative h-12 w-12 overflow-hidden rounded transition-all ${
                    i === lightboxIndex
                      ? "opacity-100 ring-2 ring-white"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
