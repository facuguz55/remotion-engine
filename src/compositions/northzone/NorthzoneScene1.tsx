import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_TITLE, FONT_BODY, GOOGLE_FONTS } from "./constants";

const WORDS_MAIN = ["13.000", "personas", "miran", "tu", "Instagram."];
const WORDS_GOLD = ["¿Cuántas", "te", "compran?"];

export const NorthzoneScene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [162, 180], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  // Cursor blinking em "Instagram."
  const cursorOp = frame > 95 ? 0 : Math.round(frame / 15) % 2 === 0 ? 1 : 0.3;

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: op }}>
      <style>{GOOGLE_FONTS}</style>

      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 55%, #0a0a0a 100%)" }} />

      {/* Subtle horizontal lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(transparent 49.5px, #ffffff06 50px, transparent 50.5px)", backgroundSize: "100% 50px" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>

        {/* Main words */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0 18px", maxWidth: 1500, lineHeight: 1 }}>
          {WORDS_MAIN.map((word, i) => {
            const delay = 15 + i * 16;
            const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 110 } });
            const wordY = interpolate(spr, [0, 1], [55, 0]);
            const wordOp = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isLast = i === WORDS_MAIN.length - 1;
            return (
              <div key={i} style={{ position: "relative" }}>
                <div style={{
                  fontSize: 122,
                  fontFamily: FONT_TITLE,
                  color: NC.text,
                  letterSpacing: 3,
                  transform: `translateY(${wordY}px)`,
                  opacity: wordOp,
                  textShadow: "0 0 60px #ffffff10",
                }}>{word}</div>
                {isLast && frame < 100 && (
                  <div style={{ position: "absolute", right: -12, top: 12, width: 4, height: 88, background: NC.gold, opacity: cursorOp }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Gold separator line */}
        {frame >= 100 && (
          <div style={{
            width: interpolate(frame, [100, 135], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${NC.gold}, transparent)`,
            opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }} />
        )}

        {/* Gold question */}
        <div style={{ display: "flex", gap: "0 14px", justifyContent: "center" }}>
          {WORDS_GOLD.map((word, i) => {
            const delay = 110 + i * 15;
            const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 } });
            const wordY = interpolate(spr, [0, 1], [22, 0]);
            const wordOp = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                fontSize: 68,
                fontFamily: FONT_TITLE,
                color: NC.gold,
                letterSpacing: 2,
                transform: `translateY(${wordY}px)`,
                opacity: wordOp,
                textShadow: `0 0 40px ${NC.gold}50`,
              }}>{word}</div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
