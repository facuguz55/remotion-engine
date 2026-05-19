import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_TITLE, FONT_BODY, GOOGLE_FONTS } from "./constants";

const AUTOMATIONS = [
  {
    emoji: "🛒",
    name: "Recupero de carrito",
    desc: "El cliente casi compró. Le mandamos el producto olvidado antes de que lo olvide.",
    color: "#1e1a0a",
  },
  {
    emoji: "🎮",
    name: "Sistemas interactivos",
    desc: "Flujos que guían al cliente paso a paso hasta confirmar la compra.",
    color: "#0a1a1e",
  },
  {
    emoji: "✉️",
    name: "Mails automáticos",
    desc: "Bienvenida, seguimiento de pedido y postventa — sin tocar nada.",
    color: "#1a0e1e",
  },
  {
    emoji: "💬",
    name: "Respuestas por WhatsApp",
    desc: "El bot atiende mientras vos dormís. Stock, precios, envíos y más.",
    color: "#0a1e10",
  },
  {
    emoji: "🏷️",
    name: "Cupones únicos por cliente",
    desc: "Descuentos personalizados que aumentan la conversión sin perder margen.",
    color: "#1e100a",
  },
];

const DELAYS = [35, 65, 95, 125, 155];

// Row 1: cards 0,1,2 — Row 2: cards 3,4 centered
const CARD_W = 556;
const CARD_H = 340;
const GAP = 24;
const GRID_LEFT = (1920 - (3 * CARD_W + 2 * GAP)) / 2; // center the 3-col row
const ROW2_LEFT = (1920 - (2 * CARD_W + GAP)) / 2;      // center the 2-col row
const GRID_TOP = 230;

export const NorthzoneScene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [580, 600], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [8, 26], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: op }}>
      <style>{GOOGLE_FONTS}</style>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #1a1000 0%, transparent 65%)" }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 60, left: "50%", transform: `translateX(-50%) translateY(${titleY}px)`, textAlign: "center", opacity: titleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 14, fontFamily: FONT_BODY, fontWeight: 600, color: NC.gold, letterSpacing: 6, textTransform: "uppercase", marginBottom: 6 }}>
          Lo que automatizamos para vos
        </div>
        <div style={{ fontSize: 70, fontFamily: FONT_TITLE, color: NC.text, letterSpacing: 4 }}>
          LAS AUTOMATIZACIONES
        </div>
      </div>

      {/* Cards absolute positioned */}
      {AUTOMATIONS.map(({ emoji, name, desc, color }, i) => {
        const row = i < 3 ? 0 : 1;
        const col = i < 3 ? i : i - 3;
        const x = row === 0 ? GRID_LEFT + col * (CARD_W + GAP) : ROW2_LEFT + col * (CARD_W + GAP);
        const y = GRID_TOP + row * (CARD_H + GAP);

        const delay = DELAYS[i];
        const spr = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });
        const cardScale = interpolate(spr, [0, 1], [0.82, 1]);
        const cardOp = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const descOp = interpolate(frame, [delay + 20, delay + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            position: "absolute",
            left: x,
            top: y,
            width: CARD_W,
            height: CARD_H,
            background: color,
            border: `1px solid ${NC.cardBorder}`,
            borderRadius: 16,
            padding: "32px 32px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            transform: `scale(${cardScale})`,
            opacity: cardOp,
            overflow: "hidden",
            boxShadow: `0 20px 50px #00000060`,
          }}>
            {/* Gold top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${NC.gold}80, transparent)` }} />

            <div style={{ fontSize: 48, lineHeight: 1 }}>{emoji}</div>

            <div style={{ fontSize: 24, fontFamily: FONT_BODY, fontWeight: 800, color: NC.text, lineHeight: 1.2 }}>
              {name}
            </div>

            <div style={{ fontSize: 16, fontFamily: FONT_BODY, color: NC.dim, lineHeight: 1.5, opacity: descOp }}>
              {desc}
            </div>

            {/* Gold bottom border line */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: NC.gold,
              transformOrigin: "left",
              transform: `scaleX(${interpolate(frame, [delay + 10, delay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
