import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const GREEN = "#86efac";

const OldDesign: React.FC = () => (
  <div
    style={{
      background: "#f0ebe4",
      width: "100%",
      height: "100%",
      borderRadius: 14,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 16,
      position: "relative",
    }}
  >
    <div style={{ background: "#7a3a1e", height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
      <div style={{ color: "#e8d5c0", fontSize: 15, fontFamily: FONT, fontWeight: 800 }}>RIGHT BOTINES</div>
      <div style={{ flex: 1 }} />
      <div style={{ background: "#c87a4a", width: 28, height: 28, borderRadius: 6 }} />
    </div>
    <div style={{ background: "linear-gradient(135deg, #b8866a, #d4a07a)", height: 90, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
      <div style={{ color: "#fff", fontSize: 14, fontFamily: FONT, fontWeight: 800 }}>NUEVA TEMPORADA</div>
      <div style={{ color: "#f5e8da", fontSize: 11, fontFamily: FONT }}>Ver catálogo</div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      {["#e2d5c8", "#d8cbbf", "#ccbdb0"].map((bg, i) => (
        <div key={i} style={{ flex: 1, background: bg, height: 72, borderRadius: 6 }} />
      ))}
    </div>
    {[1, 0.75, 0.5].map((w, i) => (
      <div key={i} style={{ background: "#ccc0b2", height: 9, borderRadius: 4, width: `${w * 100}%` }} />
    ))}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#7a3a1e", height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#e8d5c0", fontSize: 11, fontFamily: FONT }}>© 2021 Right Botines — Empretienda</div>
    </div>
  </div>
);

const NewDesign: React.FC = () => (
  <div
    style={{
      background: C.bg,
      width: "100%",
      height: "100%",
      borderRadius: 14,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 16,
      position: "relative",
      border: `2px solid ${C.cyan}50`,
    }}
  >
    <div style={{ background: C.panel, height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, border: `1px solid ${C.border}` }}>
      <div style={{ color: C.cyan, fontSize: 16, fontFamily: FONT, fontWeight: 900, letterSpacing: 1 }}>RIGHT</div>
      <div style={{ flex: 1 }} />
      <div style={{ background: C.cyan, width: 28, height: 28, borderRadius: 6 }} />
    </div>
    <div style={{ background: C.cyan, height: 32, borderRadius: 6, display: "flex", alignItems: "center", padding: "0 12px" }}>
      <div style={{ color: C.bg, fontSize: 12, fontFamily: FONT, fontWeight: 700 }}>🚚 Envío gratis a partir de $150.000</div>
    </div>
    <div style={{ background: `linear-gradient(135deg, ${C.panel}, ${C.card})`, height: 88, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, border: `1px solid ${C.border}` }}>
      <div style={{ color: C.orange, fontSize: 16, fontFamily: FONT, fontWeight: 900 }}>HOT SALE 🔥</div>
      <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Hasta 3 cuotas sin interés</div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      {[C.card, C.panel, C.card].map((bg, i) => (
        <div key={i} style={{ flex: 1, background: bg, height: 60, borderRadius: 6, border: `1px solid ${C.border}` }} />
      ))}
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})` }} />
  </div>
);

export const Scene2Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [228, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [10, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [28, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const leftSpr = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 90 } });
  const rightSpr = spring({ frame: frame - 28, fps, config: { damping: 16, stiffness: 90 } });

  const arrowProg = interpolate(frame, [55, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowLabelOp = interpolate(frame, [112, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap');`}</style>

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.18 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp }}>
        <div style={{ fontSize: 52, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1 }}>El Problema</div>
        <div style={{ fontSize: 20, fontWeight: 600, fontFamily: FONT, color: C.cyan, marginTop: 10, letterSpacing: 3, textTransform: "uppercase", opacity: subtitleOp }}>
          Migración completa de diseño
        </div>
      </div>

      {/* Panels */}
      <div style={{ position: "absolute", top: 200, left: 80, right: 80, bottom: 80, display: "flex", alignItems: "center", gap: 0 }}>

        {/* Left: Empretienda */}
        <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", gap: 14, transform: `translateX(${interpolate(leftSpr, [0, 1], [-80, 0])}px)`, opacity: leftSpr }}>
          <div style={{ fontSize: 14, fontFamily: FONT, fontWeight: 800, color: GREEN, letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
            Empretienda
          </div>
          <OldDesign />
        </div>

        {/* Arrow */}
        <div style={{ width: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ position: "relative", width: 120, height: 6 }}>
            <div style={{ width: `${arrowProg * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 3, boxShadow: `0 0 12px ${C.cyan}60` }} />
            {arrowProg > 0.85 && (
              <div style={{ position: "absolute", right: `${(1 - arrowProg) * 100}%`, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `13px solid ${C.orange}` }} />
            )}
          </div>
          <div style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: C.cyan, letterSpacing: 3, textTransform: "uppercase", opacity: arrowLabelOp, textAlign: "center" }}>
            migración
          </div>
        </div>

        {/* Right: TiendaNube */}
        <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", gap: 14, transform: `translateX(${interpolate(rightSpr, [0, 1], [80, 0])}px)`, opacity: rightSpr }}>
          <div style={{ fontSize: 14, fontFamily: FONT, fontWeight: 800, color: C.cyan, letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
            TiendaNube
          </div>
          <NewDesign />
        </div>
      </div>
    </AbsoluteFill>
  );
};
