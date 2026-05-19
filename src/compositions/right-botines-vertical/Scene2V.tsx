import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../right-botines/constants";

const GREEN = "#86efac";

// Mockup antiguo — layout wide/horizontal
const OldDesignV: React.FC = () => (
  <div style={{ width: "100%", height: "100%", background: "#f0ebe4", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", gap: 10, padding: 18, position: "relative" }}>
    <div style={{ background: "#7a3a1e", height: 48, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 18px" }}>
      <div style={{ color: "#e8d5c0", fontSize: 18, fontFamily: FONT, fontWeight: 800 }}>RIGHT BOTINES</div>
      <div style={{ flex: 1 }} />
      {["Novedades", "Ofertas", "Contacto"].map(t => <div key={t} style={{ color: "#e8d5c0", fontSize: 13, fontFamily: FONT, marginLeft: 20 }}>{t}</div>)}
    </div>
    <div style={{ background: "linear-gradient(135deg, #b8866a, #d4a07a)", flex: 1, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ color: "#fff", fontSize: 28, fontFamily: FONT, fontWeight: 900 }}>NUEVA TEMPORADA</div>
      <div style={{ background: "#7a3a1e", color: "#fff", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontFamily: FONT, fontWeight: 700 }}>Ver catálogo</div>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      {["#e2d5c8", "#d8cbbf", "#ccbdb0", "#c4b3a4"].map((bg, i) => (
        <div key={i} style={{ flex: 1, background: bg, height: 90, borderRadius: 8 }} />
      ))}
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#7a3a1e", height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#e8d5c0", fontSize: 12, fontFamily: FONT }}>© 2021 Right Botines — Empretienda</div>
    </div>
  </div>
);

// Mockup nuevo — layout wide/horizontal
const NewDesignV: React.FC = () => (
  <div style={{ width: "100%", height: "100%", background: C.bg, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", gap: 0, position: "relative", border: `2px solid ${C.cyan}50` }}>
    <div style={{ background: C.panel, height: 52, display: "flex", alignItems: "center", padding: "0 18px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ color: C.cyan, fontSize: 20, fontFamily: FONT, fontWeight: 900, letterSpacing: 1 }}>RIGHT</div>
      <div style={{ flex: 1 }} />
      {["Catálogo", "Marcas", "Ofertas"].map(t => <div key={t} style={{ color: C.gray, fontSize: 13, fontFamily: FONT, marginLeft: 24 }}>{t}</div>)}
      <div style={{ background: C.cyan, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 20, fontSize: 14 }}>🛒</div>
    </div>
    <div style={{ background: C.cyan, height: 36, display: "flex", alignItems: "center", padding: "0 18px" }}>
      <div style={{ color: C.bg, fontSize: 13, fontFamily: FONT, fontWeight: 700 }}>🚚 Envío gratis a partir de $150.000 — 3 cuotas sin interés</div>
    </div>
    <div style={{ flex: 1, display: "flex", gap: 0 }}>
      <div style={{ flex: 1.4, background: `linear-gradient(135deg, ${C.panel}, #0e1e33)`, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: 28, gap: 14, borderRight: `1px solid ${C.border}` }}>
        <div style={{ color: C.orange, fontSize: 36, fontFamily: FONT, fontWeight: 900, lineHeight: 1 }}>HOT SALE 🔥</div>
        <div style={{ color: C.gray, fontSize: 14, fontFamily: FONT }}>Hasta 3 cuotas sin interés</div>
        <div style={{ background: C.orange, color: C.white, padding: "10px 24px", borderRadius: 8, fontSize: 13, fontFamily: FONT, fontWeight: 800 }}>VER OFERTAS →</div>
      </div>
      <div style={{ flex: 1, background: C.bg, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 12 }}>
        {[C.cyan + "25", C.orange + "22", C.cyan + "20", C.orange + "20"].map((accent, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ background: accent, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👟</div>
            <div style={{ padding: "5px 8px 7px" }}>
              <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>Nike</div>
              <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 700 }}>$124.999</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})` }} />
  </div>
);

export const Scene2V: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [228, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const topSpr = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 90 } });
  const botSpr = spring({ frame: frame - 30, fps, config: { damping: 16, stiffness: 90 } });
  const arrowProg = interpolate(frame, [52, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowLabelOp = interpolate(frame, [105, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap');`}</style>

      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.18 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 58, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1 }}>El Problema</div>
        <div style={{ fontSize: 20, fontWeight: 600, fontFamily: FONT, color: C.cyan, marginTop: 10, letterSpacing: 3, textTransform: "uppercase", opacity: subtitleOp }}>
          Migración de diseño
        </div>
      </div>

      {/* Panel Empretienda — TOP */}
      <div style={{ position: "absolute", top: 220, left: 60, right: 60, height: 560, transform: `translateY(${interpolate(topSpr, [0, 1], [-60, 0])}px)`, opacity: topSpr }}>
        <div style={{ fontSize: 15, fontFamily: FONT, fontWeight: 800, color: GREEN, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 10 }}>Empretienda</div>
        <div style={{ height: "calc(100% - 30px)" }}>
          <OldDesignV />
        </div>
      </div>

      {/* Arrow pointing DOWN */}
      <div style={{ position: "absolute", top: 813, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: `${arrowProg * 70}px`, background: `linear-gradient(180deg, ${C.cyan}, ${C.orange})`, borderRadius: 3, boxShadow: `0 0 12px ${C.cyan}60` }} />
        {arrowProg > 0.88 && (
          <div style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `14px solid ${C.orange}` }} />
        )}
        <div style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: C.cyan, letterSpacing: 2, textTransform: "uppercase", opacity: arrowLabelOp }}>migración</div>
      </div>

      {/* Panel TiendaNube — BOTTOM */}
      <div style={{ position: "absolute", top: 950, left: 60, right: 60, height: 880, transform: `translateY(${interpolate(botSpr, [0, 1], [60, 0])}px)`, opacity: botSpr }}>
        <div style={{ fontSize: 15, fontFamily: FONT, fontWeight: 800, color: C.cyan, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 10 }}>TiendaNube</div>
        <div style={{ height: "calc(100% - 30px)" }}>
          <NewDesignV />
        </div>
      </div>
    </AbsoluteFill>
  );
};
