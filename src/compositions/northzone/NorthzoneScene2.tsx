import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_TITLE, FONT_BODY, GOOGLE_FONTS } from "./constants";

const CARDS = [
  { emoji: "💬", text: "Respondés mensajes\nuno por uno", color: "#1e1a2a" },
  { emoji: "🌙", text: "Los fines de semana\nperdés ventas", color: "#1a1e2a" },
  { emoji: "📱", text: "Solo vendés\nen Santa Fe", color: "#1a2a1e" },
  { emoji: "🛒", text: "No sabés quién\ncasi compró", color: "#2a1a1a" },
];

const CARD_DELAYS = [30, 75, 120, 165];

export const NorthzoneScene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [340, 360], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [8, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [8, 28], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: op }}>
      <style>{GOOGLE_FONTS}</style>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, #0a0a0a 100%)" }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 80, left: "50%", transform: `translateX(-50%) translateY(${titleY}px)`, textAlign: "center", opacity: titleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 18, fontFamily: FONT_BODY, fontWeight: 600, color: NC.gold, letterSpacing: 6, textTransform: "uppercase", marginBottom: 8 }}>
          ¿Por qué perdés ventas?
        </div>
        <div style={{ fontSize: 72, fontFamily: FONT_TITLE, color: NC.text, letterSpacing: 4, lineHeight: 1 }}>
          EL PROBLEMA
        </div>
        <div style={{ width: 80, height: 3, background: NC.gold, margin: "14px auto 0", borderRadius: 2 }} />
      </div>

      {/* Cards */}
      <div style={{ position: "absolute", top: 270, left: 80, right: 80, bottom: 80, display: "flex", gap: 28, alignItems: "center" }}>
        {CARDS.map(({ emoji, text, color }, i) => {
          const delay = CARD_DELAYS[i];
          const spr = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100 } });
          const cardY = interpolate(spr, [0, 1], [120, 0]);
          const cardOp = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cardScale = interpolate(spr, [0, 1], [0.92, 1]);

          // Subtle glow on last revealed card
          const isLatest = i === CARDS.filter((_, j) => frame >= CARD_DELAYS[j]).length - 1;

          return (
            <div key={i} style={{
              flex: 1,
              height: "100%",
              background: color,
              border: `1px solid ${isLatest && frame < 280 ? NC.gold + "60" : NC.cardBorder}`,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: "32px 24px",
              transform: `translateY(${cardY}px) scale(${cardScale})`,
              opacity: cardOp,
              position: "relative",
              overflow: "hidden",
              boxShadow: isLatest && frame < 280 ? `0 0 40px ${NC.gold}20` : "none",
            }}>
              {/* Top gold accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${NC.gold}60, transparent)` }} />

              <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>

              <div style={{ textAlign: "center" }}>
                {text.split("\n").map((line, li) => (
                  <div key={li} style={{
                    fontSize: li === 0 ? 26 : 26,
                    fontFamily: FONT_BODY,
                    fontWeight: li === 0 ? 700 : 600,
                    color: li === 0 ? NC.text : NC.dim,
                    lineHeight: 1.3,
                  }}>{line}</div>
                ))}
              </div>

              {/* Number indicator */}
              <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 13, fontFamily: FONT_BODY, color: NC.goldDim, fontWeight: 600 }}>0{i + 1}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
