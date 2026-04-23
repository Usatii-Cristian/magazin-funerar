"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageGallery({ images, name, children }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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

  const mainImage = images[0] || "";
  const galleryImages = images.slice(1);

  return (
    <>
      {/* Hero image — clickable */}
      <div
        className="relative h-[65vh] min-h-[420px] w-full cursor-zoom-in overflow-hidden"
        onClick={() => setLightboxIndex(0)}
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-stone-900/10" />

        {/* Zoom hint */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          Zoom
        </div>

        {/* Overlay content (back link, badges, title) */}
        {children}
      </div>

      {/* Gallery thumbnails — shown inside product details section via prop */}
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

          {/* Image */}
          <div
            className="relative h-full w-full max-w-5xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${name} ${lightboxIndex + 1}`}
              fill
              className="object-contain"
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
