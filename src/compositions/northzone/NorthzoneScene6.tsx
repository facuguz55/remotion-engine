import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_TITLE, FONT_BODY, GOOGLE_FONTS } from "./constants";

const CLIENTS = ["FROMNORTH", "IMPORT CALABRESE", "RIGHT BOTINES", "FUNES CLUB"];
const CLIENT_DELAYS = [55, 95, 135, 175];

export const NorthzoneScene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [280, 300], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const topLabelOp = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: op }}>
      <style>{GOOGLE_FONTS}</style>

      {/* Subtle gold radial glow center */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 55%, ${NC.gold}08 0%, transparent 65%)` }} />

      {/* Decorative horizontal lines */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${NC.gold}30, transparent)`, opacity: topLabelOp }} />
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${NC.gold}30, transparent)`, opacity: topLabelOp }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>

        {/* Top label */}
        <div style={{ textAlign: "center", opacity: topLabelOp }}>
          <div style={{ fontSize: 14, fontFamily: FONT_BODY, fontWeight: 600, color: NC.gold, letterSpacing: 8, textTransform: "uppercase", marginBottom: 8 }}>
            Ya trabajamos con
          </div>
          <div style={{ width: 60, height: 2, background: NC.gold, margin: "0 auto", borderRadius: 1 }} />
        </div>

        {/* Client names */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          {CLIENTS.map((client, i) => {
            const delay = CLIENT_DELAYS[i];
            const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 } });
            const clientOp = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const clientY = interpolate(spr, [0, 1], [30, 0]);
            const clientScale = interpolate(spr, [0, 1], [0.92, 1]);
            const isLatest = CLIENT_DELAYS.filter(d => frame >= d).length - 1 === i;
            const glowIntensity = isLatest && frame < 250 ? 1 : 0.2;

            return (
              <div key={i} style={{
                fontSize: 62,
                fontFamily: FONT_TITLE,
                color: isLatest && frame < 250 ? NC.gold : NC.text,
                letterSpacing: 6,
                lineHeight: 1,
                transform: `translateY(${clientY}px) scale(${clientScale})`,
                opacity: clientOp,
                textShadow: `0 0 60px ${NC.gold}${Math.round(glowIntensity * 60).toString(16).padStart(2, "0")}`,
                textAlign: "center",
              }}>
                {client}
              </div>
            );
          })}
        </div>

        {/* Bottom separator dots */}
        <div style={{ display: "flex", gap: 10, opacity: interpolate(frame, [220, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {["·", "·", "·"].map((dot, i) => (
            <div key={i} style={{ color: NC.goldDim, fontSize: 28, fontFamily: FONT_TITLE }}>{dot}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
