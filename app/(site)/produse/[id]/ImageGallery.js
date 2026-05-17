"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";

export default function ImageGallery({ images: rawImages, name }) {
  const images = (rawImages ?? []).filter(
    (s) => typeof s === "string" && s.length > 0
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [, startTransition] = useTransition();

  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef({ dist: null, scale: 1 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0, moved: false });
  const transformWrapperRef = useRef(null);
  const lightboxIndexRef = useRef(null);

  useEffect(() => {
    lightboxIndexRef.current = lightboxIndex;
  }, [lightboxIndex]);

  function applyTransform(x, y, s, animated = false) {
    const el = transformWrapperRef.current;
    if (!el) return;
    el.style.transition = animated ? "transform 0.2s ease" : "none";
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

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
    applyTransform(offsetRef.current.x, offsetRef.current.y, newScale);
  }

  function onTouchEnd() {
    pinchRef.current.dist = null;
    setZoomedIn(scaleRef.current > 1);
  }

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
    <div className="min-w-0">
      {/* Main image */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-xl ${
          hasImages ? "cursor-zoom-in bg-stone-100" : "bg-stone-200"
        }`}
        onClick={() => hasImages && setLightboxIndex(selectedIndex)}
      >
        {hasImages ? (
          <Image
            src={images[selectedIndex]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <svg className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
            </svg>
          </div>
        )}
        {hasImages && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            Zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition-all ${
                i === selectedIndex ? "ring-gold-400" : "ring-transparent hover:ring-stone-300"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
            {lightboxIndex + 1} / {images.length}
          </div>

          <div className="absolute right-16 top-4 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/60">
            {zoomedIn ? "Trageți pentru a muta" : "Click / pinch pentru zoom"}
          </div>

          <button
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="Închide"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

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
    </div>
  );
}
