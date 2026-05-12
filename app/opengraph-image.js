import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "GranitNord Elit CV — Servicii Funerare & Monumente din Granit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0c0a09 0%, #1c1917 60%, #292524 100%)",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#d4a64f",
          }}
        >
          <div style={{ display: "flex", width: 56, height: 4, background: "#d4a64f" }} />
          <div style={{ display: "flex" }}>Servicii Funerare</div>
        </div>

        {/* Main heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            <span>GranitNord</span>
            <span style={{ color: "#d4a64f" }}>-Granit</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              color: "#d6d3d1",
              maxWidth: 880,
              lineHeight: 1.3,
            }}
          >
            Monumente Funerare din Granit & Marmură — Respect, Grijă și Profesionalism
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#a8a29e",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", color: "#d4a64f", fontSize: 28, fontWeight: 600 }}>
              Disponibili 24/7
            </div>
            <div style={{ display: "flex" }}>
              15+ ani experiență · 500+ familii ajutate
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderLeft: "2px solid #d4a64f",
              paddingLeft: 24,
              fontSize: 32,
              fontWeight: 700,
              color: "white",
            }}
          >
            079 175 383
          </div>
        </div>

        {/* Decorative gold accent corner */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            width: 8,
            height: "100%",
            background: "linear-gradient(180deg, #d4a64f 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
