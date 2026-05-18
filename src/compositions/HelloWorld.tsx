import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const HelloWorld: React.FC<{ message: string }> = ({ message }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0]);
  const scale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 800,
          fontFamily: "Arial Black, sans-serif",
          textAlign: "center",
          letterSpacing: -2,
        }}
      >
        {message}
      </div>
      <div
        style={{
          opacity: opacity * 0.6,
          color: "#888",
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Frame {frame} / {durationInFrames}
      </div>
    </AbsoluteFill>
  );
};
