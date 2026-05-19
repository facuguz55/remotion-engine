import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../right-botines/constants";

const BG_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: ((i * 73.7 + 11) % 100),
  y: ((i * 47.3 + 23) % 100),
  size: 1.5 + (i % 3),
  color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.orange : C.gray,
  vy: 0.022 + (i % 5) * 0.01,
}));

const SUCCESS_START = 232;
const GREEN = "#22c55e";
const PHONE_W = 420;
const PHONE_H = 820;

const CartPopup: React.FC<{ frame: number; fps: number; timerText: string }> = ({ frame, fps, timerText }) => {
  const bannerSpr = spring({ frame: frame - 75, fps, config: { damping: 14, stiffness: 100 } });
  const buttonSpr = spring({ frame: frame - 100, fps, config: { damping: 12, stiffness: 140 } });
  const pulse = frame < SUCCESS_START - 20 ? interpolate(Math.sin((frame * Math.PI) / 20), [-1, 1], [0.93, 1.0]) : 1;

  const tapScale = frame >= SUCCESS_START - 20 && frame <= SUCCESS_START
    ? interpolate(frame, [SUCCESS_START - 20, SUCCESS_START - 12, SUCCESS_START - 4, SUCCESS_START], [1, 0.88, 0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const btnGreen = interpolate(frame, [SUCCESS_START - 14, SUCCESS_START - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnR = Math.round(255 * (1 - btnGreen) + 34 * btnGreen);
  const btnG = Math.round(107 * (1 - btnGreen) + 197 * btnGreen);
  const btnB = Math.round(53 * (1 - btnGreen) + 94 * btnGreen);

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.panel, borderTop: `2px solid ${C.border}`, borderRadius: "16px 16px 0 0", boxShadow: `0 -20px 60px #00000080` }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: C.white, fontSize: 14, fontFamily: FONT, fontWeight: 800 }}>Tu carrito</div>
        <div style={{ color: C.gray, fontSize: 16 }}>✕</div>
      </div>
      <div style={{ background: "#1a0a02", border: `1px solid ${C.orange}50`, margin: "8px 12px", borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 13 }}>⏱️</div>
        <div style={{ color: C.gray, fontSize: 10, fontFamily: FONT }}>Tu carrito se reserva por:</div>
        <div style={{ color: C.orange, fontSize: 14, fontFamily: FONT, fontWeight: 900, letterSpacing: 2, marginLeft: "auto" }}>{timerText}</div>
      </div>
      <div style={{ margin: "0 12px 8px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, padding: 9, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 8, background: `linear-gradient(135deg, ${C.cyan}30, ${C.orange}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👟</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>Nike Mercurial Vapor</div>
          <div style={{ color: C.gray, fontSize: 10, fontFamily: FONT }}>Talle: 42 — Negro/Cyan</div>
          <div style={{ color: C.cyan, fontSize: 12, fontFamily: FONT, fontWeight: 800, marginTop: 2 }}>$124.999</div>
        </div>
      </div>
      <div style={{ margin: "0 12px 8px", background: `${C.cyan}15`, border: `1px solid ${C.cyan}60`, borderRadius: 8, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10, transform: `scale(${interpolate(bannerSpr, [0, 1], [0.9, 1])})`, opacity: bannerSpr }}>
        <div style={{ fontSize: 18 }}>💳</div>
        <div>
          <div style={{ color: C.cyan, fontSize: 12, fontFamily: FONT, fontWeight: 800 }}>3 cuotas sin interés</div>
          <div style={{ color: C.gray, fontSize: 10, fontFamily: FONT }}>Con todas las tarjetas</div>
        </div>
        <div style={{ color: C.cyan, fontSize: 12, fontFamily: FONT, fontWeight: 900, marginLeft: "auto" }}>$41.666/mes</div>
      </div>
      <div style={{ padding: "4px 12px 14px" }}>
        <div style={{ background: `rgb(${btnR},${btnG},${btnB})`, borderRadius: 10, height: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${interpolate(buttonSpr, [0, 1], [0.85, 1]) * pulse * tapScale})`, opacity: buttonSpr, boxShadow: `0 8px 24px rgb(${btnR},${btnG},${btnB})55` }}>
          <div style={{ color: C.white, fontSize: 14, fontFamily: FONT, fontWeight: 900 }}>FINALIZAR COMPRA</div>
          <div style={{ color: C.white, fontSize: 15 }}>→</div>
        </div>
      </div>
    </div>
  );
};

const SuccessOverlay: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const entrySpr = spring({ frame: frame - (SUCCESS_START + 18), fps, config: { damping: 14, stiffness: 90 } });
  const checkSpr = spring({ frame: frame - (SUCCESS_START + 30), fps, config: { damping: 10, stiffness: 180 } });
  const textOp = interpolate(frame, [SUCCESS_START + 45, SUCCESS_START + 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [SUCCESS_START + 58, SUCCESS_START + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const confirmOp = interpolate(frame, [SUCCESS_START + 70, SUCCESS_START + 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: "#040f08", opacity: entrySpr, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, zIndex: 20 }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 200, borderRadius: "50%", background: `radial-gradient(ellipse, ${GREEN}18 0%, transparent 65%)` }} />
      <div style={{ width: 84, height: 84, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(checkSpr, [0, 1], [0.2, 1])})`, boxShadow: `0 0 50px ${GREEN}70` }}>
        <div style={{ color: "#fff", fontSize: 40, fontWeight: 900, lineHeight: 1 }}>✓</div>
      </div>
      <div style={{ color: GREEN, fontSize: 22, fontFamily: FONT, fontWeight: 900, opacity: textOp }}>¡Compra realizada!</div>
      <div style={{ color: "#6b7280", fontSize: 13, fontFamily: FONT, opacity: subOp }}>N° de orden: #12847</div>
      <div style={{ color: "#6b7280", fontSize: 12, fontFamily: FONT, textAlign: "center", padding: "0 24px", lineHeight: 1.6, opacity: confirmOp }}>Tu pago fue acreditado. Te avisaremos cuando tu pedido esté en camino.</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(0deg, ${GREEN}18, transparent)` }} />
    </div>
  );
};

export const Scene4V: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [350, 360], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const phoneSpr = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const cartSlide = spring({ frame: frame - 45, fps, config: { damping: 18, stiffness: 100 } });

  const elapsed = Math.max(0, Math.floor((frame - 55) / 30));
  const remaining = 600 - elapsed;
  const timerText = `${String(Math.max(0, Math.floor(remaining / 60))).padStart(2, "0")}:${String(Math.max(0, remaining % 60)).padStart(2, "0")}`;

  const cartEntryY = interpolate(cartSlide, [0, 1], [100, 0]);
  const cartExitY = interpolate(frame, [SUCCESS_START, SUCCESS_START + 28], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cartTranslateY = frame < SUCCESS_START ? cartEntryY : cartExitY;
  const overlayOp = interpolate(frame, [SUCCESS_START, SUCCESS_START + 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgPageOp = interpolate(frame, [SUCCESS_START, SUCCESS_START + 20], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleOp = interpolate(frame, [12, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const copyOp = interpolate(frame, [110, 138], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const PHONE_X = (1080 - PHONE_W) / 2;
  const PHONE_Y = 250;
  const glowX = Math.sin(frame * 0.018) * 4;
  const glowY = Math.cos(frame * 0.013) * 4;

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {BG_PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 1.8 + 400) % 110) - 5;
          return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${py}%`, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: 0.14 }} />;
        })}
      </div>

      <div style={{ position: "absolute", left: `${38 + glowX}%`, top: `${45 + glowY}%`, width: 700, height: 600, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.orange}07 0%, transparent 60%)`, transform: "translate(-50%, -50%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.12 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 56, fontWeight: 900, fontFamily: FONT, color: C.white }}>El Carrito</div>
        <div style={{ width: 220, height: 5, background: `linear-gradient(90deg, ${C.orange}, ${C.cyan})`, borderRadius: 2, margin: "12px auto 0" }} />
      </div>

      {/* Phone */}
      <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y, width: PHONE_W, height: PHONE_H, transform: `scale(${interpolate(phoneSpr, [0, 1], [0.88, 1])})`, opacity: phoneSpr }}>
        <div style={{ width: "100%", height: "100%", background: "#080e18", borderRadius: 44, border: `2px solid ${C.border}`, boxShadow: `0 0 60px ${C.orange}15, 0 40px 80px #00000080`, overflow: "hidden", position: "relative" }}>
          <div style={{ height: 44, background: C.panel, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: `1px solid ${C.border}`, position: "relative", zIndex: 30 }}>
            <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>9:41</div>
            <div style={{ width: 80, height: 20, background: "#080e18", borderRadius: 10 }} />
            <div style={{ color: C.gray, fontSize: 9 }}>●●● 🔋</div>
          </div>
          <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: C.bg, opacity: bgPageOp }}>
            <div style={{ padding: 16 }}>
              <div style={{ color: C.white, fontSize: 16, fontFamily: FONT, fontWeight: 900 }}>Nike Mercurial Vapor</div>
              <div style={{ color: C.cyan, fontSize: 22, fontFamily: FONT, fontWeight: 900, marginTop: 6 }}>$124.999</div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: `#00000070`, opacity: overlayOp, transform: `translateY(${cartTranslateY}%)` }}>
            <CartPopup frame={frame} fps={fps} timerText={timerText} />
          </div>
          {frame >= SUCCESS_START + 15 && <SuccessOverlay frame={frame} fps={fps} />}
        </div>
      </div>

      {/* Copy debajo del phone */}
      <div style={{ position: "absolute", left: 80, right: 80, top: PHONE_Y + PHONE_H + 44, opacity: copyOp }}>
        <div style={{ fontSize: 34, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1.2, marginBottom: 24, textAlign: "center" }}>
          Urgencia que convierte
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { icon: "⏱️", text: "Timer de 10 min que reserva el producto" },
            { icon: "💳", text: "3 cuotas sin interés bien visibles" },
            { icon: "🛒", text: "CTA naranja de alta conversión" },
          ].map(({ icon, text }, i) => {
            const itemOp = interpolate(frame, [130 + i * 18, 150 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", opacity: itemOp }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.panel, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
                <div style={{ color: C.gray, fontSize: 20, fontFamily: FONT }}>{text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
