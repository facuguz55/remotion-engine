import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_TITLE, FONT_BODY, GOOGLE_FONTS } from "./constants";

export const NorthzoneScene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // "NOVA" drops from top
  const novaSpr = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 80 } });
  const novaY = interpolate(novaSpr, [0, 1], [-100, 0]);
  const novaOp = interpolate(frame - 15, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "AGENCY" rises from bottom
  const agencySpr = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 80 } });
  const agencyY = interpolate(agencySpr, [0, 1], [100, 0]);
  const agencyOp = interpolate(frame - 35, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold line
  const lineW = interpolate(frame, [55, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tagline
  const tagOp = interpolate(frame, [90, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [90, 118], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold username pulsing
  const usernameOp = interpolate(frame, [140, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.025 * Math.sin((frame * Math.PI) / 18);

  // Background radial glow
  const bgGlow = interpolate(frame, [20, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CTA line
  const ctaOp = interpolate(frame, [185, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: fadeIn }}>
      <style>{GOOGLE_FONTS}</style>

      {/* Gold glow bg */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 48%, ${NC.gold}14 0%, transparent 60%)`, opacity: bgGlow }} />

      {/* Grid lines subtle */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(transparent 79px, #ffffff04 80px, transparent 80.5px), linear-gradient(90deg, transparent 79px, #ffffff04 80px, transparent 80.5px)`, backgroundSize: "80px 80px" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>

        {/* NOVA */}
        <div style={{
          fontSize: 220,
          fontFamily: FONT_TITLE,
          color: NC.text,
          letterSpacing: 16,
          lineHeight: 1,
          transform: `translateY(${novaY}px)`,
          opacity: novaOp,
          textShadow: "0 0 80px #ffffff15",
        }}>NOVA</div>

        {/* Gold divider line */}
        <div style={{
          width: 900,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${NC.gold}, transparent)`,
          transform: `scaleX(${lineW})`,
          boxShadow: `0 0 30px ${NC.gold}60`,
          margin: "4px 0",
        }} />

        {/* AGENCY */}
        <div style={{
          fontSize: 220,
          fontFamily: FONT_TITLE,
          color: NC.gold,
          letterSpacing: 16,
          lineHeight: 1,
          transform: `translateY(${agencyY}px)`,
          opacity: agencyOp,
          textShadow: `0 0 100px ${NC.gold}50`,
        }}>AGENCY</div>

        {/* Tagline */}
        <div style={{
          marginTop: 44,
          fontSize: 30,
          fontFamily: FONT_BODY,
          fontWeight: 400,
          color: NC.text,
          letterSpacing: 1,
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
        }}>
          Hacemos que tu negocio{" "}
          <span style={{ color: NC.gold, fontWeight: 700 }}>venda solo.</span>
        </div>

        {/* Username */}
        <div style={{
          marginTop: 32,
          fontSize: 22,
          fontFamily: FONT_BODY,
          fontWeight: 500,
          color: NC.gold,
          letterSpacing: 4,
          textTransform: "lowercase",
          opacity: usernameOp,
          transform: `scale(${pulse})`,
          textShadow: `0 0 30px ${NC.gold}60`,
        }}>
          @novaagencytec
        </div>

        {/* CTA button */}
        <div style={{
          marginTop: 48,
          border: `2px solid ${NC.gold}`,
          borderRadius: 4,
          padding: "14px 40px",
          opacity: ctaOp,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{ fontSize: 18, fontFamily: FONT_BODY, fontWeight: 600, color: NC.text, letterSpacing: 3, textTransform: "uppercase" }}>
            novaagency.info
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
