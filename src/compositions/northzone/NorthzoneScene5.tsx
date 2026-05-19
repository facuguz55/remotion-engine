import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NC, FONT_BODY, GOOGLE_FONTS } from "./constants";

// Typing indicator con 3 dots bouncing
const TypingDots: React.FC<{ frame: number; visible: boolean }> = ({ frame, visible }) => {
  if (!visible) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
      {/* Avatar */}
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: NC.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>🏪</div>
      <div style={{ background: "#1c1c1c", borderRadius: "4px 18px 18px 18px", padding: "14px 18px", display: "flex", gap: 6, alignItems: "center", border: "1px solid #2a2a2a" }}>
        {[0, 1, 2].map(i => {
          const bounceY = Math.sin((frame * 0.28 + i * 0.9) * Math.PI) * 5;
          return (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#666", transform: `translateY(${bounceY}px)` }} />
          );
        })}
      </div>
    </div>
  );
};

interface BubbleProps {
  text: string;
  isUser: boolean;
  frame: number;
  startFrame: number;
  fps: number;
  showAvatar?: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ text, isUser, frame, startFrame, fps, showAvatar = false }) => {
  if (frame < startFrame - 8) return null;

  const spr = spring({ frame: frame - startFrame, fps, config: { damping: 20, stiffness: 180 } });
  const slideX = interpolate(spr, [0, 1], [isUser ? 50 : -30, 0]);
  const scl = interpolate(spr, [0, 1], [0.92, 1]);
  const bOp = interpolate(frame - startFrame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 10,
      transform: `translateX(${slideX}px) scale(${scl})`,
      opacity: bOp,
    }}>
      {!isUser && showAvatar && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: NC.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, marginTop: 2 }}>🏪</div>
      )}
      {!isUser && !showAvatar && <div style={{ width: 36, flexShrink: 0 }} />}

      <div style={{
        maxWidth: "72%",
        background: isUser ? "#1a2e1a" : "#1c1c1c",
        borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        padding: "13px 18px",
        border: isUser ? `1px solid ${NC.gold}40` : "1px solid #2a2a2a",
        boxShadow: isUser ? `0 4px 20px ${NC.gold}15` : "0 4px 12px #00000040",
      }}>
        <div style={{ fontSize: 17, fontFamily: FONT_BODY, color: NC.text, lineHeight: 1.55 }}>{text}</div>
      </div>

      {isUser && <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, marginTop: 2 }}>👤</div>}
    </div>
  );
};

// Chat messages timeline (within 450 frames = 15s)
const MESSAGES = [
  { text: "Hola! Quería consultar si tienen la campera de cuero en talle M, y si hacen envíos a Córdoba 🙏", isUser: true, start: 22, showAvatar: false },
  { text: "¡Hola! Sí, tenemos la campera de cuero en talle M disponible 👍", isUser: false, start: 110, showAvatar: true },
  { text: "Hacemos envíos a Córdoba con Andreani, llega en 48hs 🚀 El costo es de $4.500 y podés pagar con cualquier tarjeta en 3 cuotas sin interés 💳", isUser: false, start: 210, showAvatar: false },
  { text: "¿Te la reservo? Quedan pocas unidades en ese talle 👀", isUser: false, start: 330, showAvatar: false },
];

const TYPING_SHOWS = [
  { start: 45, end: 108 },
  { start: 155, end: 208 },
  { start: 270, end: 328 },
];

const AUTO_LABEL_START = 375;
const LAST_MSG_START = 400;

export const NorthzoneScene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [432, 450], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const chatOp = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isTyping = TYPING_SHOWS.some(t => frame >= t.start && frame < t.end);
  const activeTypingFrame = frame;

  const autoLabelOp = interpolate(frame, [AUTO_LABEL_START, AUTO_LABEL_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lastMsgOp = frame >= LAST_MSG_START - 8;

  return (
    <AbsoluteFill style={{ background: NC.bg, opacity: op }}>
      <style>{GOOGLE_FONTS}</style>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 40%, #0a1500 0%, transparent 55%)" }} />

      {/* Left label */}
      <div style={{
        position: "absolute",
        left: 80,
        top: "50%",
        transform: "translateY(-50%)",
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 14, fontFamily: FONT_BODY, fontWeight: 600, color: NC.gold, letterSpacing: 5, textTransform: "uppercase", marginBottom: 12 }}>Tu bot en acción</div>
        <div style={{ fontSize: 52, fontFamily: "'Bebas Neue', Impact, sans-serif", color: NC.text, letterSpacing: 3, lineHeight: 1, marginBottom: 16 }}>
          {"ASÍ\nATIENDE\nSOLO.".split("\n").map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div style={{ fontSize: 15, fontFamily: FONT_BODY, color: NC.dim, lineHeight: 1.6, maxWidth: 280 }}>
          Sin que vos<br />hagas nada.
        </div>
      </div>

      {/* Chat window */}
      <div style={{
        position: "absolute",
        right: 80,
        top: 50,
        width: 740,
        height: 980,
        background: "#111111",
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid #222",
        boxShadow: "0 40px 100px #00000080",
        opacity: chatOp,
      }}>
        {/* Chat header */}
        <div style={{ background: "#1a1a1a", padding: "18px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #222" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: NC.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏪</div>
          <div>
            <div style={{ fontSize: 18, fontFamily: FONT_BODY, fontWeight: 700, color: NC.text }}>NorthZone Indumentaria</div>
            <div style={{ fontSize: 13, fontFamily: FONT_BODY, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
              en línea
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            {["🔍", "⋮"].map((ic, i) => <div key={i} style={{ fontSize: 18, color: NC.dim }}>{ic}</div>)}
          </div>
        </div>

        {/* Messages area */}
        <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", height: "calc(100% - 136px)", overflowY: "hidden" }}>
          {/* Date label */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontFamily: FONT_BODY, color: "#555", background: "#1a1a1a", display: "inline-block", padding: "4px 12px", borderRadius: 10 }}>HOY</div>
          </div>

          {MESSAGES.map((msg, i) => (
            <Bubble key={i} {...msg} frame={frame} fps={fps} startFrame={msg.start} />
          ))}

          <TypingDots frame={activeTypingFrame} visible={isTyping} />

          {/* Auto label */}
          {frame >= AUTO_LABEL_START - 8 && (
            <div style={{ textAlign: "center", marginTop: 4, marginBottom: 8, opacity: autoLabelOp }}>
              <div style={{ fontSize: 11, fontFamily: FONT_BODY, color: NC.gold, background: `${NC.gold}18`, display: "inline-block", padding: "4px 14px", borderRadius: 10, border: `1px solid ${NC.gold}30` }}>
                ⚡ Respondido automáticamente por Nova Agency
              </div>
            </div>
          )}

          {/* Final user message */}
          {lastMsgOp && (
            <Bubble text="Sí!! Reservame una por favor 🙌 Te mando el pago en un momento" isUser={true} frame={frame} startFrame={LAST_MSG_START} fps={fps} />
          )}
        </div>

        {/* Input bar */}
        <div style={{ background: "#1a1a1a", height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderTop: "1px solid #222" }}>
          <div style={{ flex: 1, background: "#252525", borderRadius: 20, height: 40, display: "flex", alignItems: "center", padding: "0 16px" }}>
            <div style={{ fontSize: 14, fontFamily: FONT_BODY, color: "#444" }}>Escribí un mensaje...</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: NC.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>➤</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
