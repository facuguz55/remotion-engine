import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const CartPopup: React.FC<{ timerText: string; frame: number; fps: number }> = ({ timerText, frame, fps }) => {
  const bannerSpr = spring({ frame: frame - 80, fps, config: { damping: 14, stiffness: 100 } });
  const buttonSpr = spring({ frame: frame - 110, fps, config: { damping: 12, stiffness: 140 } });

  const pulse = interpolate(
    Math.sin((frame * Math.PI) / 20),
    [-1, 1],
    [0.92, 1.0]
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.panel,
        borderTop: `2px solid ${C.border}`,
        borderRadius: "16px 16px 0 0",
        overflow: "hidden",
        boxShadow: `0 -20px 60px #00000080`,
      }}
    >
      {/* Cart header */}
      <div
        style={{
          padding: "16px 16px 10px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: C.white, fontSize: 15, fontFamily: FONT, fontWeight: 800 }}>Tu carrito</div>
        <div style={{ color: C.gray, fontSize: 18 }}>✕</div>
      </div>

      {/* Timer */}
      <div
        style={{
          background: "#1a0a02",
          border: `1px solid ${C.orange}50`,
          margin: "10px 12px",
          borderRadius: 8,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 14 }}>⏱️</div>
        <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Tu carrito se reserva por:</div>
        <div
          style={{
            color: C.orange,
            fontSize: 16,
            fontFamily: FONT,
            fontWeight: 900,
            letterSpacing: 2,
            marginLeft: "auto",
          }}
        >
          {timerText}
        </div>
      </div>

      {/* Product item */}
      <div
        style={{
          margin: "0 12px 10px",
          background: C.card,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          padding: 10,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${C.cyan}30, ${C.orange}20)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          👟
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontSize: 12, fontFamily: FONT, fontWeight: 700 }}>Nike Mercurial Vapor</div>
          <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Talle: 42 — Negro/Cyan</div>
          <div style={{ color: C.cyan, fontSize: 13, fontFamily: FONT, fontWeight: 800, marginTop: 3 }}>$124.999</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <div style={{ background: C.border, width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: C.gray, fontSize: 14 }}>−</div>
          <div style={{ color: C.white, fontSize: 13, fontFamily: FONT, fontWeight: 700 }}>1</div>
          <div style={{ background: C.border, width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: C.gray, fontSize: 14 }}>+</div>
        </div>
      </div>

      {/* Cuotas banner — highlighted */}
      <div
        style={{
          margin: "0 12px 10px",
          background: `linear-gradient(135deg, ${C.cyan}18, ${C.cyan}08)`,
          border: `1px solid ${C.cyan}60`,
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transform: `scale(${interpolate(bannerSpr, [0, 1], [0.9, 1])})`,
          opacity: bannerSpr,
          boxShadow: `0 0 20px ${C.cyan}25`,
        }}
      >
        <div style={{ fontSize: 20 }}>💳</div>
        <div>
          <div style={{ color: C.cyan, fontSize: 13, fontFamily: FONT, fontWeight: 800 }}>3 cuotas sin interés</div>
          <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT }}>Con todas las tarjetas bancarias</div>
        </div>
        <div style={{ color: C.cyan, fontSize: 14, fontFamily: FONT, fontWeight: 900, marginLeft: "auto" }}>
          $41.666/mes
        </div>
      </div>

      {/* Total */}
      <div
        style={{
          margin: "0 12px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: C.gray, fontSize: 13, fontFamily: FONT }}>Total</div>
        <div style={{ color: C.white, fontSize: 18, fontFamily: FONT, fontWeight: 900 }}>$124.999</div>
      </div>

      {/* CTA Button */}
      <div style={{ padding: "4px 12px 16px" }}>
        <div
          style={{
            background: C.orange,
            borderRadius: 10,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transform: `scale(${interpolate(buttonSpr, [0, 1], [0.85, 1]) * pulse})`,
            opacity: buttonSpr,
            boxShadow: `0 8px 24px ${C.orange}50`,
          }}
        >
          <div style={{ color: C.white, fontSize: 15, fontFamily: FONT, fontWeight: 900, letterSpacing: 0.5 }}>
            FINALIZAR COMPRA
          </div>
          <div style={{ color: C.white, fontSize: 16 }}>→</div>
        </div>
      </div>
    </div>
  );
};

export const Scene4Carrito: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [335, 360], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const phoneSpr = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const cartSlide = spring({ frame: frame - 55, fps, config: { damping: 18, stiffness: 100 } });

  // Timer: starts at 10:00, counts down in real time
  const elapsed = Math.max(0, Math.floor((frame - 60) / 30));
  const remaining = 600 - elapsed;
  const mins = Math.max(0, Math.floor(remaining / 60));
  const secs = Math.max(0, remaining % 60);
  const timerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const cartTranslate = interpolate(cartSlide, [0, 1], [400, 0]);

  const titleOp = interpolate(frame, [18, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

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

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          width: 560,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${C.orange}08 0%, transparent 65%)`,
        }}
      />

      {/* Title */}
      <div style={{ position: "absolute", top: 54, left: 80, opacity: titleOp }}>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: FONT, color: C.white }}>El Carrito</div>
        <div style={{ width: 200, height: 4, background: `linear-gradient(90deg, ${C.orange}, ${C.cyan})`, borderRadius: 2, marginTop: 10 }} />
      </div>

      {/* Urgencia text */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 220,
          width: 420,
          opacity: subtitleOp,
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            fontFamily: FONT,
            color: C.white,
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Urgencia que convierte
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "⏱️", text: "Timer de 10 min reserva el producto" },
            { icon: "💳", text: "3 cuotas sin interés destacadas" },
            { icon: "🛒", text: "CTA naranja de alta conversión" },
          ].map(({ icon, text }, i) => {
            const itemOp = interpolate(frame, [140 + i * 20, 160 + i * 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", opacity: itemOp }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: C.panel,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {icon}
                </div>
                <div style={{ color: C.gray, fontSize: 15, fontFamily: FONT }}>{text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phone + Cart */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: "50%",
          transform: `translateY(-50%) scale(${interpolate(phoneSpr, [0, 1], [0.85, 1])})`,
          width: 360,
          height: 700,
          opacity: phoneSpr,
        }}
      >
        {/* Phone frame */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#080e18",
            borderRadius: 42,
            border: `2px solid ${C.border}`,
            boxShadow: `0 0 60px ${C.orange}15, 0 40px 80px #00000080`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Status bar */}
          <div
            style={{
              height: 44,
              background: C.panel,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>9:41</div>
            <div style={{ width: 80, height: 20, background: "#080e18", borderRadius: 10 }} />
            <div style={{ color: C.gray, fontSize: 9 }}>●●● 🔋</div>
          </div>

          {/* Background page (dim) */}
          <div
            style={{
              position: "absolute",
              top: 44,
              left: 0,
              right: 0,
              bottom: 0,
              background: C.bg,
              opacity: 0.6,
            }}
          >
            <div style={{ padding: "16px 16px 0", borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
              <div style={{ color: C.white, fontSize: 14, fontFamily: FONT, fontWeight: 900 }}>Nike Mercurial Vapor</div>
              <div style={{ color: C.cyan, fontSize: 18, fontFamily: FONT, fontWeight: 900, marginTop: 4 }}>$124.999</div>
            </div>
          </div>

          {/* Cart overlay */}
          <div
            style={{
              position: "absolute",
              top: 44,
              left: 0,
              right: 0,
              bottom: 0,
              background: "#00000070",
              transform: `translateY(${interpolate(cartSlide, [0, 1], [100, 0])}%)`,
            }}
          >
            <CartPopup timerText={timerText} frame={frame} fps={fps} />
          </div>
        </div>
      </div>

      {/* Scene dots */}
      <div style={{ position: "absolute", bottom: 54, left: 80, display: "flex", gap: 8, opacity: titleOp }}>
        {[0, 0, 0, 1, 0, 0, 0].map((active, i) => (
          <div key={i} style={{ width: active ? 28 : 8, height: 4, borderRadius: 2, background: active ? C.orange : C.gray, opacity: active ? 1 : 0.3 }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
