import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_TITLE, FONT_BODY, GOOGLE_FONTS } from "./constants";

const STEPS = [
  { text: "Diseñamos tu tienda online", sub: "Identidad, catálogo y checkout optimizado" },
  { text: "Conectamos los sistemas", sub: "TiendaNube + WhatsApp + Email + Analytics" },
  { text: "Activamos las automatizaciones", sub: "Carritos, mails, cupones y respuestas automáticas" },
  { text: "Vos solo revisás los pedidos", sub: "El resto trabaja solo, 24/7" },
];

const STEP_DELAYS = [40, 90, 140, 190];

export const NorthzoneScene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [340, 360], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  // Left title words: "TU / TIENDA / TRABAJA / SOLA"
  const titleLines = ["TU TIENDA", "TRABAJA", "SOLA."];
  const titleLineDelays = [15, 35, 58];

  // Dividing line
  const lineH = interpolate(frame, [12, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: op }}>
      <style>{GOOGLE_FONTS}</style>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, #1a1200 0%, transparent 60%)" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex" }}>

        {/* Left panel */}
        <div style={{ width: 860, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px 0 80px", position: "relative" }}>
          {/* Subtitle */}
          <div style={{
            fontSize: 14,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            color: NC.gold,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>La solución</div>

          {/* Title lines */}
          {titleLines.map((line, i) => {
            const delay = titleLineDelays[i];
            const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 } });
            const lineOp = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const lineX = interpolate(spr, [0, 1], [-50, 0]);
            const isLast = i === titleLines.length - 1;
            return (
              <div key={i} style={{
                fontSize: i === 2 ? 140 : 110,
                fontFamily: FONT_TITLE,
                color: isLast ? NC.gold : NC.text,
                letterSpacing: 4,
                lineHeight: 0.92,
                transform: `translateX(${lineX}px)`,
                opacity: lineOp,
                textShadow: isLast ? `0 0 80px ${NC.gold}40` : "none",
              }}>{line}</div>
            );
          })}

          {/* Bottom label */}
          <div style={{
            fontSize: 15,
            fontFamily: FONT_BODY,
            color: NC.dim,
            marginTop: 28,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            Desarrollado por{" "}
            <span style={{ color: NC.gold, fontWeight: 700 }}>Nova Agency</span>
          </div>
        </div>

        {/* Gold dividing line */}
        <div style={{
          width: 1,
          background: `linear-gradient(180deg, transparent, ${NC.gold}80, transparent)`,
          transform: `scaleY(${lineH})`,
          transformOrigin: "top",
          margin: "60px 0",
        }} />

        {/* Right panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px 0 60px", gap: 0 }}>
          {STEPS.map(({ text, sub }, i) => {
            const delay = STEP_DELAYS[i];
            const spr = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
            const itemOp = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const itemX = interpolate(spr, [0, 1], [40, 0]);
            const checkSpr = spring({ frame: frame - (delay + 15), fps, config: { damping: 10, stiffness: 200 } });
            const checkScale = interpolate(checkSpr, [0, 1], [0, 1]);
            const isChecked = frame >= delay + 15;

            return (
              <div key={i} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 24,
                paddingBottom: 36,
                marginBottom: i < STEPS.length - 1 ? 0 : 0,
                borderBottom: i < STEPS.length - 1 ? `1px solid ${NC.cardBorder}` : "none",
                marginTop: 0,
                paddingTop: i === 0 ? 0 : 32,
                transform: `translateX(${itemX}px)`,
                opacity: itemOp,
              }}>
                {/* Check circle */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: isChecked ? NC.gold : "transparent",
                  border: `2px solid ${NC.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                  transform: `scale(${checkScale})`,
                  boxShadow: isChecked ? `0 0 20px ${NC.gold}50` : "none",
                }}>
                  {isChecked && (
                    <div style={{ color: NC.bg, fontSize: 20, fontWeight: 900, lineHeight: 1, opacity: checkSpr }}>✓</div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 26, fontFamily: FONT_BODY, fontWeight: 700, color: NC.text, lineHeight: 1.2, marginBottom: 4 }}>
                    {text}
                  </div>
                  <div style={{ fontSize: 15, fontFamily: FONT_BODY, color: NC.dim, lineHeight: 1.4 }}>
                    {sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
