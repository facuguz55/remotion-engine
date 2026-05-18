import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: ((i * 91.3 + 7) % 100),
  y: ((i * 53.7 + 31) % 100),
  size: 1.5 + (i % 3),
  color: i % 2 === 0 ? C.cyan : C.orange,
  vy: 0.025 + (i % 4) * 0.012,
}));

export const Scene7Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [205, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const badgeSpr = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 85 } });
  const labelSpr = spring({ frame: frame - 35, fps, config: { damping: 16, stiffness: 100 } });
  const urlSpr = spring({ frame: frame - 90, fps, config: { damping: 16, stiffness: 100 } });
  const btnSpr = spring({ frame: frame - 115, fps, config: { damping: 12, stiffness: 120 } });
  const linesSpr = spring({ frame: frame - 55, fps, config: { damping: 16, stiffness: 90 } });

  const pulse = interpolate(Math.sin((frame * Math.PI) / 25), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 1.5 + 300) % 110) - 5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${py}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: 0.18,
              }}
            />
          );
        })}
      </div>

      {/* Big glow bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${C.cyan}08 0%, transparent 65%)`,
          opacity: badgeSpr,
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          opacity: 0.15,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* "Desarrollado por" label */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            fontFamily: FONT,
            color: C.gray,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: labelSpr,
            transform: `translateY(${interpolate(labelSpr, [0, 1], [-12, 0])}px)`,
          }}
        >
          Desarrollado por
        </div>

        {/* Nova Agency badge */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.panel}, ${C.card})`,
            border: `2px solid ${C.cyan}50`,
            borderRadius: 24,
            padding: "44px 72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            transform: `scale(${interpolate(badgeSpr, [0, 1], [0.85, 1]) * pulse})`,
            opacity: badgeSpr,
            boxShadow: `0 0 60px ${C.cyan}18, 0 40px 80px #00000060`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top gradient line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`,
            }}
          />

          {/* Inner glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 50% 0%, ${C.cyan}12 0%, transparent 55%)`,
            }}
          />

          {/* NOVA */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              fontFamily: FONT,
              lineHeight: 1,
              background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.white} 50%, ${C.orange} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -2,
              position: "relative",
            }}
          >
            NOVA
          </div>

          {/* AGENCY */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              fontFamily: FONT,
              color: C.white,
              letterSpacing: 12,
              position: "relative",
            }}
          >
            AGENCY
          </div>

          {/* Bottom separator */}
          <div style={{ width: 60, height: 2, background: `${C.cyan}60`, borderRadius: 1, marginTop: 4 }} />
        </div>

        {/* Horizontal lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: linesSpr,
          }}
        >
          <div
            style={{
              width: 200,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C.border})`,
            }}
          />
          <div style={{ color: C.gray, fontSize: 13, fontFamily: FONT, letterSpacing: 3, textTransform: "uppercase" }}>
            Diseño · Desarrollo · Tiendanube
          </div>
          <div
            style={{
              width: 200,
              height: 1,
              background: `linear-gradient(90deg, ${C.border}, transparent)`,
            }}
          />
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: FONT,
            color: C.cyan,
            letterSpacing: 2,
            opacity: urlSpr,
            transform: `translateY(${interpolate(urlSpr, [0, 1], [12, 0])}px)`,
          }}
        >
          novaagency.info
        </div>

        {/* CTA Button */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.orange}, #e05520)`,
            borderRadius: 12,
            padding: "18px 48px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transform: `scale(${interpolate(btnSpr, [0, 1], [0.85, 1])})`,
            opacity: btnSpr,
            boxShadow: `0 12px 32px ${C.orange}45`,
          }}
        >
          <div
            style={{
              color: C.white,
              fontSize: 18,
              fontFamily: FONT,
              fontWeight: 900,
              letterSpacing: 0.5,
            }}
          >
            CONOCÉ NUESTROS PROYECTOS
          </div>
          <div style={{ color: C.white, fontSize: 20, fontWeight: 900 }}>→</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
