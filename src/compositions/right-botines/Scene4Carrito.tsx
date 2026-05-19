import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const BG_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: ((i * 73.7 + 11.3) % 100),
  y: ((i * 47.3 + 23.7) % 100),
  size: 1.5 + (i % 3),
  color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.orange : C.gray,
  vy: 0.022 + (i % 5) * 0.01,
}));

// Frame en que el carrito empieza a salirse (botón "presionado")
const SUCCESS_START = 232;
const GREEN = "#22c55e";

const CartPopup: React.FC<{ frame: number; fps: number; timerText: string }> = ({ frame, fps, timerText }) => {
  const bannerSpr = spring({ frame: frame - 75, fps, config: { damping: 14, stiffness: 100 } });
  const buttonSpr = spring({ frame: frame - 100, fps, config: { damping: 12, stiffness: 140 } });

  // Pulso normal antes de la pulsación
  const pulse = frame < SUCCESS_START - 20
    ? interpolate(Math.sin((frame * Math.PI) / 20), [-1, 1], [0.93, 1.0])
    : 1;

  // Efecto tap: escala baja y sube antes de que el carrito salga
  const tapScale = (() => {
    if (frame < SUCCESS_START - 20 || frame > SUCCESS_START) return 1;
    return interpolate(
      frame,
      [SUCCESS_START - 20, SUCCESS_START - 12, SUCCESS_START - 4, SUCCESS_START],
      [1, 0.88, 0.88, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  })();

  // Color del botón: naranja → verde al presionar
  const btnGreenAmount = interpolate(
    frame,
    [SUCCESS_START - 14, SUCCESS_START - 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const btnR = Math.round(255 * (1 - btnGreenAmount) + 34 * btnGreenAmount);
  const btnG = Math.round(107 * (1 - btnGreenAmount) + 197 * btnGreenAmount);
  const btnB = Math.round(53 * (1 - btnGreenAmount) + 94 * btnGreenAmount);
  const btnColor = `rgb(${btnR},${btnG},${btnB})`;

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.panel, borderTop: `2px solid ${C.border}`, borderRadius: "16px 16px 0 0", overflow: "hidden", boxShadow: `0 -20px 60px #00000080` }}>
      <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: C.white, fontSize: 15, fontFamily: FONT, fontWeight: 800 }}>Tu carrito</div>
        <div style={{ color: C.gray, fontSize: 18 }}>✕</div>
      </div>

      {/* Timer */}
      <div style={{ background: "#1a0a02", border: `1px solid ${C.orange}50`, margin: "10px 12px", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 14 }}>⏱️</div>
        <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Tu carrito se reserva por:</div>
        <div style={{ color: C.orange, fontSize: 16, fontFamily: FONT, fontWeight: 900, letterSpacing: 2, marginLeft: "auto" }}>{timerText}</div>
      </div>

      {/* Product */}
      <div style={{ margin: "0 12px 10px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, padding: 10, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 8, background: `linear-gradient(135deg, ${C.cyan}30, ${C.orange}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👟</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontSize: 12, fontFamily: FONT, fontWeight: 700 }}>Nike Mercurial Vapor</div>
          <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Talle: 42 — Negro/Cyan</div>
          <div style={{ color: C.cyan, fontSize: 13, fontFamily: FONT, fontWeight: 800, marginTop: 3 }}>$124.999</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          {["−", "1", "+"].map((t, i) => (
            <div key={i} style={{ background: i === 1 ? "transparent" : C.border, width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: i === 1 ? C.white : C.gray, fontSize: i === 1 ? 13 : 14, fontFamily: FONT, fontWeight: i === 1 ? 700 : 400 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Cuotas */}
      <div style={{ margin: "0 12px 10px", background: `linear-gradient(135deg, ${C.cyan}18, ${C.cyan}08)`, border: `1px solid ${C.cyan}60`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transform: `scale(${interpolate(bannerSpr, [0, 1], [0.9, 1])})`, opacity: bannerSpr, boxShadow: `0 0 20px ${C.cyan}25` }}>
        <div style={{ fontSize: 20 }}>💳</div>
        <div>
          <div style={{ color: C.cyan, fontSize: 13, fontFamily: FONT, fontWeight: 800 }}>3 cuotas sin interés</div>
          <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Con todas las tarjetas bancarias</div>
        </div>
        <div style={{ color: C.cyan, fontSize: 14, fontFamily: FONT, fontWeight: 900, marginLeft: "auto" }}>$41.666/mes</div>
      </div>

      {/* Total */}
      <div style={{ margin: "0 12px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: C.gray, fontSize: 13, fontFamily: FONT }}>Total</div>
        <div style={{ color: C.white, fontSize: 18, fontFamily: FONT, fontWeight: 900 }}>$124.999</div>
      </div>

      {/* CTA Button */}
      <div style={{ padding: "4px 12px 16px" }}>
        <div style={{
          background: btnColor,
          borderRadius: 10,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transform: `scale(${interpolate(buttonSpr, [0, 1], [0.85, 1]) * pulse * tapScale})`,
          opacity: buttonSpr,
          boxShadow: `0 8px 24px ${btnColor}55`,
        }}>
          <div style={{ color: C.white, fontSize: 15, fontFamily: FONT, fontWeight: 900, letterSpacing: 0.5 }}>FINALIZAR COMPRA</div>
          <div style={{ color: C.white, fontSize: 16 }}>→</div>
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
    <div style={{
      position: "absolute",
      top: 44,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#040f08",
      opacity: entrySpr,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      zIndex: 20,
    }}>
      {/* Glow verde de fondo */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 200, borderRadius: "50%", background: `radial-gradient(ellipse, ${GREEN}18 0%, transparent 65%)` }} />

      {/* Checkmark */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: GREEN,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${interpolate(checkSpr, [0, 1], [0.2, 1])})`,
        boxShadow: `0 0 50px ${GREEN}70`,
        position: "relative",
      }}>
        <div style={{ color: "#fff", fontSize: 36, fontWeight: 900, lineHeight: 1 }}>✓</div>
      </div>

      {/* Compra realizada */}
      <div style={{ color: GREEN, fontSize: 20, fontFamily: FONT, fontWeight: 900, opacity: textOp }}>
        ¡Compra realizada!
      </div>

      {/* Orden */}
      <div style={{ color: "#6b7280", fontSize: 12, fontFamily: FONT, opacity: subOp }}>
        N° de orden: #12847
      </div>

      {/* Mensaje */}
      <div style={{ color: "#6b7280", fontSize: 11, fontFamily: FONT, textAlign: "center", padding: "0 24px", lineHeight: 1.6, opacity: confirmOp }}>
        Tu pago fue acreditado.{"\n"}
        Te avisaremos cuando tu pedido esté en camino.
      </div>

      {/* Línea inferior verde */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(0deg, ${GREEN}18, transparent)` }} />
    </div>
  );
};

export const Scene4Carrito: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [350, 360], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const phoneSpr = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const cartSlide = spring({ frame: frame - 45, fps, config: { damping: 18, stiffness: 100 } });

  // Timer en tiempo real
  const elapsed = Math.max(0, Math.floor((frame - 55) / 30));
  const remaining = 600 - elapsed;
  const mins = Math.max(0, Math.floor(remaining / 60));
  const secs = Math.max(0, remaining % 60);
  const timerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // El carrito entra con spring, y sale cuando empieza SUCCESS_START
  const cartEntryY = interpolate(cartSlide, [0, 1], [100, 0]);
  const cartExitY = interpolate(frame, [SUCCESS_START, SUCCESS_START + 28], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cartTranslateY = frame < SUCCESS_START ? cartEntryY : cartExitY;

  // Fondo oscuro del overlay del carrito se va con el carrito
  const overlayOp = interpolate(frame, [SUCCESS_START, SUCCESS_START + 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgPageOp = interpolate(frame, [SUCCESS_START, SUCCESS_START + 20], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleOp = interpolate(frame, [14, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [110, 138], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [110, 138], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowX = Math.sin(frame * 0.018) * 4;
  const glowY = Math.cos(frame * 0.013) * 4;

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      {/* Partículas de fondo */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {BG_PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 1.8 + 400) % 110) - 5;
          const px = p.x + Math.sin(frame * 0.018 + i * 1.3) * 1.5;
          return <div key={i} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: 0.14 }} />;
        })}
      </div>

      {/* Globos de luz */}
      <div style={{ position: "absolute", left: `${38 + glowX}%`, top: `${42 + glowY}%`, width: 700, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.orange}07 0%, transparent 60%)`, transform: "translate(-50%, -50%)" }} />
      <div style={{ position: "absolute", left: `${62 - glowX * 0.5}%`, top: `${55 - glowY * 0.5}%`, width: 500, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.cyan}06 0%, transparent 60%)`, transform: "translate(-50%, -50%)" }} />

      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.12 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 54, left: 80, opacity: titleOp }}>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: FONT, color: C.white }}>El Carrito</div>
        <div style={{ width: 200, height: 4, background: `linear-gradient(90deg, ${C.orange}, ${C.cyan})`, borderRadius: 2, marginTop: 10 }} />
      </div>

      {/* Copy izquierdo */}
      <div style={{ position: "absolute", left: 80, top: 215, width: 440, opacity: subtitleOp, transform: `translateY(${subtitleY}px)` }}>
        <div style={{ fontSize: 38, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1.2, marginBottom: 18 }}>Urgencia que convierte</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "⏱️", text: "Timer de 10 min reserva el producto" },
            { icon: "💳", text: "3 cuotas sin interés destacadas" },
            { icon: "🛒", text: "CTA naranja de alta conversión" },
          ].map(({ icon, text }, i) => {
            const itemOp = interpolate(frame, [128 + i * 18, 148 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", opacity: itemOp }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.panel, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{icon}</div>
                <div style={{ color: C.gray, fontSize: 15, fontFamily: FONT }}>{text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phone */}
      <div style={{ position: "absolute", right: 120, top: "50%", transform: `translateY(-50%) scale(${interpolate(phoneSpr, [0, 1], [0.85, 1])})`, width: 360, height: 700, opacity: phoneSpr }}>
        <div style={{ width: "100%", height: "100%", background: "#080e18", borderRadius: 42, border: `2px solid ${C.border}`, boxShadow: `0 0 60px ${C.orange}15, 0 40px 80px #00000080`, overflow: "hidden", position: "relative" }}>

          {/* Status bar */}
          <div style={{ height: 44, background: C.panel, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: `1px solid ${C.border}`, position: "relative", zIndex: 30 }}>
            <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>9:41</div>
            <div style={{ width: 80, height: 20, background: "#080e18", borderRadius: 10 }} />
            <div style={{ color: C.gray, fontSize: 9 }}>●●● 🔋</div>
          </div>

          {/* Página de fondo (producto) */}
          <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: C.bg, opacity: bgPageOp }}>
            <div style={{ padding: "16px 16px 0", borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
              <div style={{ color: C.white, fontSize: 14, fontFamily: FONT, fontWeight: 900 }}>Nike Mercurial Vapor</div>
              <div style={{ color: C.cyan, fontSize: 18, fontFamily: FONT, fontWeight: 900, marginTop: 4 }}>$124.999</div>
            </div>
          </div>

          {/* Overlay oscuro + carrito */}
          <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: `#00000070`, opacity: overlayOp, transform: `translateY(${cartTranslateY}%)` }}>
            <CartPopup frame={frame} fps={fps} timerText={timerText} />
          </div>

          {/* Success overlay — aparece después del carrito */}
          {frame >= SUCCESS_START + 15 && (
            <SuccessOverlay frame={frame} fps={fps} />
          )}
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 54, left: 80, display: "flex", gap: 8, opacity: titleOp }}>
        {[0, 0, 0, 1, 0, 0, 0].map((active, i) => (
          <div key={i} style={{ width: active ? 28 : 8, height: 4, borderRadius: 2, background: active ? C.orange : C.gray, opacity: active ? 1 : 0.3 }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
