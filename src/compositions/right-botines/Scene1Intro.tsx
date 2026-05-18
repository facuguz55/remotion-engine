import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFade = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const sceneOut = interpolate(frame, [122, 150], [1, 0], { extrapolateLeft: "clamp" });
  const masterOp = bgFade * sceneOut;

  const lineProgress = interpolate(frame, [48, 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [85, 112], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [85, 112], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dotsOp = interpolate(frame, [105, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const LETTERS = "RIGHT".split("");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap');`}</style>
      <AbsoluteFill
        style={{
          background: C.bg,
          opacity: masterOp,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 38,
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
            opacity: 0.22,
          }}
        />

        {/* Glow blob */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 420,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.cyan}14 0%, transparent 65%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
          }}
        />

        {/* Logo letters */}
        <div style={{ display: "flex", gap: 8, zIndex: 1 }}>
          {LETTERS.map((letter, i) => {
            const spr = spring({
              frame: frame - i * 7 - 5,
              fps,
              from: -150,
              to: 0,
              config: { damping: 14, stiffness: 105 },
            });
            const letterOp = interpolate(frame - i * 7 - 5, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={letter + i}
                style={{
                  fontSize: 220,
                  fontWeight: 900,
                  fontFamily: FONT,
                  color: C.white,
                  lineHeight: 1,
                  transform: `translateY(${spr}px)`,
                  opacity: letterOp,
                  letterSpacing: -6,
                  textShadow: `0 0 80px ${C.cyan}25`,
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>

        {/* Gradient accent line */}
        <div
          style={{
            width: 640,
            height: 5,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`,
            transformOrigin: "left center",
            transform: `scaleX(${lineProgress})`,
            boxShadow: `0 0 28px ${C.cyan}70`,
            zIndex: 1,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 27,
            fontWeight: 700,
            fontFamily: FONT,
            color: C.gray,
            letterSpacing: 10,
            textTransform: "uppercase",
            opacity: tagOp,
            transform: `translateY(${tagY}px)`,
            zIndex: 1,
          }}
        >
          Botines Alta Gama
        </div>

        {/* Scene indicator dots */}
        <div
          style={{
            position: "absolute",
            bottom: 68,
            display: "flex",
            gap: 8,
            opacity: dotsOp,
            zIndex: 1,
          }}
        >
          {[1, 0, 0, 0, 0, 0, 0].map((active, i) => (
            <div
              key={i}
              style={{
                width: active ? 28 : 8,
                height: 4,
                borderRadius: 2,
                background: active ? C.cyan : C.gray,
                opacity: active ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
