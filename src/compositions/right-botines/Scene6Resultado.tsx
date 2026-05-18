import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x: ((i * 73.7 + 11.3) % 100),
  y: ((i * 47.3 + 23.7) % 100),
  size: 2 + (i % 4),
  color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.orange : `${C.white}`,
  vy: 0.04 + (i % 5) * 0.016,
  vx: Math.sin(i * 1.4) * 0.008,
}));

interface StatCardProps {
  value: string;
  suffix: string;
  label: string;
  color: string;
  delay: number;
  frame: number;
  fps: number;
}

const StatCard: React.FC<StatCardProps> = ({ value, suffix, label, color, delay, frame, fps }) => {
  const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 } });
  const lineW = interpolate(frame, [delay + 10, delay + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: C.panel,
        borderRadius: 20,
        border: `1px solid ${C.border}`,
        padding: "40px 48px",
        textAlign: "center",
        transform: `translateY(${interpolate(spr, [0, 1], [50, 0])}px) scale(${interpolate(spr, [0, 1], [0.88, 1])})`,
        opacity: spr,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 20px 60px #00000050`,
      }}
    >
      {/* Color top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transformOrigin: "left",
          transform: `scaleX(${lineW})`,
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at top, ${color}10 0%, transparent 60%)`,
        }}
      />

      {/* Value */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: FONT,
          color,
          lineHeight: 1,
          letterSpacing: -2,
          position: "relative",
        }}
      >
        {value}
        <span style={{ fontSize: 40, color: `${color}cc`, marginLeft: 4 }}>{suffix}</span>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          fontFamily: FONT,
          color: C.gray,
          marginTop: 12,
          position: "relative",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Scene6Resultado: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [215, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [18, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Animated counts
  const count276 = Math.floor(interpolate(frame, [25, 110], [0, 276], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const count40 = Math.floor(interpolate(frame, [50, 130], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const count3 = Math.floor(interpolate(frame, [75, 115], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 2 + 400) % 110) - 5;
          const px = p.x + Math.sin(frame * 0.015 + i * 1.1) * 2.5;
          const particleOp = interpolate(frame, [0, 30], [0, 0.5], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${px}%`,
                top: `${py}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: particleOp * (0.2 + 0.3 * ((i % 5) / 5)),
              }}
            />
          );
        })}
      </div>

      {/* Grid subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          opacity: 0.12,
        }}
      />

      {/* Title */}
      <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp }}>
        <div style={{ fontSize: 52, fontWeight: 900, fontFamily: FONT, color: C.white }}>Resultados</div>
        <div style={{ width: 220, height: 4, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 2, margin: "10px auto 0" }} />
      </div>

      {/* Stats cards */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 80,
          right: 80,
          bottom: 100,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        <StatCard
          value={String(count276)}
          suffix=""
          label="Productos cargados"
          color={C.cyan}
          delay={20}
          frame={frame}
          fps={fps}
        />
        <StatCard
          value={`+${count40}`}
          suffix=""
          label="Modelos diferentes"
          color={C.orange}
          delay={45}
          frame={frame}
          fps={fps}
        />
        <StatCard
          value={String(count3)}
          suffix="x"
          label="Cuotas sin interés"
          color={C.white}
          delay={70}
          frame={frame}
          fps={fps}
        />
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textAlign: "center",
        }}
      >
        <div style={{ color: C.gray, fontSize: 18, fontFamily: FONT, fontWeight: 600 }}>
          Tienda completamente rediseñada y funcional
        </div>
      </div>
    </AbsoluteFill>
  );
};
