"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function ImageGallery({ images, name, children }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const pinchRef = useRef({ dist: null, scale: 1 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0, moved: false });

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [lightboxIndex]);

  useEffect(() => {
    function onKey(e) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft" && lightboxIndex > 0)
        setLightboxIndex((i) => i - 1);
      if (e.key === "ArrowRight" && lightboxIndex < images.length - 1)
        setLightboxIndex((i) => i + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, images.length]);

  // Pinch zoom (touch)
  function getPinchDist(e) {
    const [a, b] = e.touches;
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: getPinchDist(e), scale };
    }
  }
  function onTouchMove(e) {
    if (e.touches.length === 2 && pinchRef.current.dist !== null) {
      const ratio = getPinchDist(e) / pinchRef.current.dist;
      setScale(Math.min(4, Math.max(1, pinchRef.current.scale * ratio)));
    }
  }
  function onTouchEnd() {
    pinchRef.current.dist = null;
  }

  // Mouse drag-to-pan
  function onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffX: offset.x,
      startOffY: offset.y,
      moved: false,
    };
    if (scale > 1) setIsDragging(true);
  }

  function onMouseMove(e) {
    const d = dragRef.current;
    if (!d.active || scale <= 1) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    setOffset({ x: d.startOffX + dx, y: d.startOffY + dy });
  }

  function onMouseUp() {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    dragRef.current.moved = false;
    setIsDragging(false);
    if (!moved) {
      if (scale > 1) {
        setScale(1);
        setOffset({ x: 0, y: 0 });
      } else {
        setScale(2);
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
  const mainImage = images[0];
  const galleryImages = images.slice(1);

  const imgCursor =
    scale > 1
      ? isDragging
        ? "cursor-grabbing"
        : "cursor-grab"
      : "cursor-zoom-in";

  return (
    <>
      {/* Hero image — clickable */}
      <div
        className={`relative h-[65vh] min-h-[420px] w-full overflow-hidden ${hasImages ? "cursor-zoom-in bg-stone-900" : "bg-stone-800"}`}
        onClick={() => hasImages && setLightboxIndex(0)}
      >
        {hasImages ? (
          <Image
            src={mainImage}
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

        {/* Zoom hint */}
        {hasImages && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            Zoom
          </div>
        )}

        {/* Overlay content — stop propagation so clicks don't open lightbox */}
        <div onClick={(e) => e.stopPropagation()} className="contents">
          {children}
        </div>
      </div>

      {/* Gallery thumbnails */}
      {galleryImages.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-display text-lg font-semibold text-stone-900">
            Galerie foto
          </h3>
          <div className="grid grid-cols-3 gap-3">
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
                  sizes="(max-width: 640px) 33vw, 200px"
                />
                {i === 0 && (
                  <div className="absolute bottom-1 left-1 rounded bg-gold-500/80 px-1.5 py-0.5 text-xs font-medium text-white">
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
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Zoom/pan hint */}
          <div className="absolute top-4 right-16 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/60">
            {scale > 1 ? `${Math.round(scale * 100)}% — trageți pentru a muta` : "Click pentru zoom"}
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i - 1); }}
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
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i + 1); }}
              aria-label="Următor"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Image — click to zoom, drag to pan when zoomed */}
          <div
            className={`relative h-full w-full max-w-5xl p-4 overflow-hidden select-none ${imgCursor}`}
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
            <Image
              src={images[lightboxIndex]}
              alt={`${name} ${lightboxIndex + 1}`}
              fill
              draggable={false}
              className="object-contain pointer-events-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.2s ease",
              }}
              priority
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`relative h-12 w-12 overflow-hidden rounded transition-all ${
                    i === lightboxIndex
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
