import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../right-botines/constants";

const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x: ((i * 73.7 + 11.3) % 100),
  y: ((i * 47.3 + 23.7) % 100),
  size: 2 + (i % 4),
  color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.orange : C.white,
  vy: 0.04 + (i % 5) * 0.016,
}));

interface StatCardVProps {
  value: string;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
  delay: number;
  frame: number;
  fps: number;
}

const StatCardV: React.FC<StatCardVProps> = ({ value, suffix, label, sublabel, color, delay, frame, fps }) => {
  const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 } });
  const lineW = interpolate(frame, [delay + 10, delay + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      background: C.panel,
      borderRadius: 24,
      border: `1px solid ${C.border}`,
      padding: "44px 60px",
      display: "flex",
      alignItems: "center",
      gap: 40,
      transform: `translateX(${interpolate(spr, [0, 1], [-60, 0])}px) scale(${interpolate(spr, [0, 1], [0.92, 1])})`,
      opacity: spr,
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 20px 60px #00000050`,
    }}>
      {/* Left color bar */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 6, background: color, transformOrigin: "top", transform: `scaleY(${lineW})` }} />

      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at left center, ${color}12 0%, transparent 55%)` }} />

      {/* Value */}
      <div style={{ fontSize: 96, fontWeight: 900, fontFamily: FONT, color, lineHeight: 1, letterSpacing: -3, position: "relative", flexShrink: 0 }}>
        {value}
        <span style={{ fontSize: 48, color: `${color}cc`, marginLeft: 4 }}>{suffix}</span>
      </div>

      {/* Label */}
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: FONT, color: C.white, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 500, fontFamily: FONT, color: C.gray, marginTop: 6 }}>{sublabel}</div>
      </div>
    </div>
  );
};

export const Scene6V: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [228, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const count276 = Math.floor(interpolate(frame, [22, 108], [0, 276], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const count40 = Math.floor(interpolate(frame, [48, 128], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const count3 = Math.floor(interpolate(frame, [72, 112], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const taglineOp = interpolate(frame, [130, 158], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 2 + 400) % 110) - 5;
          const px = p.x + Math.sin(frame * 0.015 + i * 1.1) * 2.5;
          const pOp = interpolate(frame, [0, 30], [0, 0.5], { extrapolateRight: "clamp" });
          return <div key={i} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: pOp * 0.6 }} />;
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.12 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 58, fontWeight: 900, fontFamily: FONT, color: C.white }}>Resultados</div>
        <div style={{ width: 240, height: 5, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 2, margin: "12px auto 0" }} />
      </div>

      {/* Cards stacked vertically */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 230, display: "flex", flexDirection: "column", gap: 40 }}>
        <StatCardV value={String(count276)} suffix="" label="Productos cargados" sublabel="en la tienda online" color={C.cyan} delay={20} frame={frame} fps={fps} />
        <StatCardV value={`+${count40}`} suffix="" label="Modelos distintos" sublabel="de botines y zapatillas" color={C.orange} delay={44} frame={frame} fps={fps} />
        <StatCardV value={String(count3)} suffix="x" label="Cuotas sin interés" sublabel="con todas las tarjetas" color={C.white} delay={68} frame={frame} fps={fps} />
      </div>

      {/* Tagline */}
      <div style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", opacity: taglineOp, textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ color: C.gray, fontSize: 22, fontFamily: FONT, fontWeight: 600 }}>Tienda rediseñada y 100% funcional</div>
      </div>
    </AbsoluteFill>
  );
};
