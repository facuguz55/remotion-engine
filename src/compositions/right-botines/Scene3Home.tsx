import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const CHECK_TIMES = [90, 185, 278, 365];

const SECTION_LABELS = [
  { icon: "🚚", label: "Ticker de envíos" },
  { icon: "🔥", label: "Hot Sale + Countdown" },
  { icon: "👟", label: "Grilla de Productos" },
  { icon: "⭐", label: "Carrusel de Jugadores" },
];

const PhoneContent: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const now = new Date();
  return (
    <div
      style={{
        transform: `translateY(${scrollY}px)`,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Nav */}
      <div
        style={{
          background: C.panel,
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ color: C.cyan, fontSize: 20, fontFamily: FONT, fontWeight: 900, letterSpacing: 1 }}>RIGHT</div>
        <div style={{ flex: 1 }} />
        <div style={{ background: C.cyan, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: C.bg, fontSize: 14, fontWeight: 700 }}>🛒</div>
        </div>
      </div>

      {/* Ticker */}
      <div
        style={{
          background: C.cyan,
          height: 36,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ color: C.bg, fontSize: 13, fontFamily: FONT, fontWeight: 700 }}>
          🚚 Envío gratis a partir de $150.000 — Retiro gratis en sucursal
        </div>
      </div>

      {/* Hot Sale Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.panel}, #0f1f35)`,
          padding: "20px 16px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ color: C.orange, fontSize: 28, fontFamily: FONT, fontWeight: 900, marginBottom: 6 }}>
          HOT SALE 🔥
        </div>
        <div style={{ color: C.gray, fontSize: 13, fontFamily: FONT, marginBottom: 14 }}>
          Oferta válida por tiempo limitado
        </div>
        {/* Countdown */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "HS", val: "02" },
            { label: "MIN", val: "47" },
            { label: "SEG", val: "31" },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: "center", background: C.card, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.border}` }}>
              <div style={{ color: C.white, fontSize: 22, fontFamily: FONT, fontWeight: 900, lineHeight: 1 }}>{val}</div>
              <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT, fontWeight: 700, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div style={{ padding: "18px 16px 10px", flexShrink: 0 }}>
        <div style={{ color: C.white, fontSize: 16, fontFamily: FONT, fontWeight: 800, marginBottom: 12 }}>
          Nuevos Ingresos
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { name: "Mizuno", price: "$89.999", color: C.cyan + "30" },
            { name: "Nike", price: "$124.999", color: C.orange + "25" },
            { name: "Puma", price: "$76.500", color: C.cyan + "20" },
            { name: "Adidas", price: "$98.000", color: C.orange + "20" },
            { name: "New Bal.", price: "$112.000", color: C.cyan + "25" },
            { name: "Topper", price: "$64.999", color: C.orange + "22" },
          ].map(({ name, price, color }, i) => (
            <div
              key={i}
              style={{
                background: C.card,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
              }}
            >
              <div style={{ background: color, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 22 }}>👟</div>
              </div>
              <div style={{ padding: "6px 6px 8px" }}>
                <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>{name}</div>
                <div style={{ color: C.white, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Players Section */}
      <div style={{ padding: "10px 16px 18px", flexShrink: 0 }}>
        <div style={{ color: C.white, fontSize: 16, fontFamily: FONT, fontWeight: 800, marginBottom: 12 }}>
          Usados por los Mejores ⭐
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "hidden" }}>
          {[
            { name: "Messi", team: "Inter Miami" },
            { name: "Mbappé", team: "Real Madrid" },
            { name: "Haaland", team: "Man City" },
          ].map(({ name, team }, i) => (
            <div
              key={i}
              style={{
                background: C.panel,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                padding: "14px 16px",
                flexShrink: 0,
                width: 90,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.cyan}40, ${C.orange}40)`,
                  margin: "0 auto 8px",
                  border: `2px solid ${C.cyan}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                ⚽
              </div>
              <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 700 }}>{name}</div>
              <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT }}>{team}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PhoneMockup: React.FC<{ scrollY: number; opacity: number; scale: number }> = ({
  scrollY,
  opacity,
  scale,
}) => (
  <div
    style={{
      position: "absolute",
      right: 120,
      top: "50%",
      transform: `translateY(-50%) scale(${scale})`,
      width: 360,
      height: 720,
      opacity,
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
        boxShadow: `0 0 60px ${C.cyan}20, 0 40px 80px #00000080, inset 0 0 0 1px ${C.cyan}10`,
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
        {/* Notch */}
        <div
          style={{
            width: 80,
            height: 20,
            background: "#080e18",
            borderRadius: 10,
          }}
        />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ color: C.gray, fontSize: 9 }}>●●●</div>
          <div style={{ color: C.gray, fontSize: 11 }}>🔋</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          overflow: "hidden",
          height: "calc(100% - 44px)",
          position: "relative",
        }}
      >
        <PhoneContent scrollY={scrollY} />
      </div>

      {/* Bottom home bar */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 4,
          borderRadius: 2,
          background: C.gray,
          opacity: 0.4,
        }}
      />
    </div>
  </div>
);

const CheckItem: React.FC<{ icon: string; label: string; frame: number; checkAt: number; fps: number; index: number }> = ({
  icon, label, frame, checkAt, fps, index,
}) => {
  const appeared = frame >= checkAt - 15;
  const isChecked = frame >= checkAt;

  const spr = spring({
    frame: frame - (checkAt - 15),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const checkSpr = spring({
    frame: frame - checkAt,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const op = interpolate(frame, [checkAt - 15, checkAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!appeared) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: op,
        transform: `translateX(${interpolate(spr, [0, 1], [-30, 0])}px)`,
        marginBottom: 20,
      }}
    >
      {/* Check circle */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: isChecked ? C.cyan : "transparent",
          border: `2px solid ${isChecked ? C.cyan : C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${interpolate(checkSpr, [0, 1], [0.5, 1])})`,
          transition: "background 0.2s",
        }}
      >
        {isChecked && (
          <div
            style={{
              color: C.bg,
              fontSize: 16,
              fontWeight: 900,
              lineHeight: 1,
              opacity: checkSpr,
            }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Label */}
      <div>
        <div style={{ fontSize: 11, color: C.gray, fontFamily: FONT, fontWeight: 600 }}>{icon}</div>
        <div
          style={{
            fontSize: 17,
            color: isChecked ? C.white : C.gray,
            fontFamily: FONT,
            fontWeight: isChecked ? 700 : 500,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export const Scene3Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [425, 450], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const phoneSpr = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const phoneScale = interpolate(phoneSpr, [0, 1], [0.85, 1]);
  const phoneOp = phoneSpr;

  // Scroll positions: each section comes into view
  const scrollY = interpolate(
    frame,
    [0, 88, 115, 183, 215, 276, 308, 363, 430],
    [0, 0, -92, -92, -300, -300, -560, -560, -560],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleOp = interpolate(frame, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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

      {/* Glow behind phone */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 500,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${C.cyan}10 0%, transparent 65%)`,
          opacity: phoneOp,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 80,
          opacity: titleOp,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1 }}>
          La Home
        </div>
        <div
          style={{
            width: 220,
            height: 4,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`,
            borderRadius: 2,
            marginTop: 10,
          }}
        />
      </div>

      {/* Section checklist */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 200,
          width: 380,
        }}
      >
        {SECTION_LABELS.map((s, i) => (
          <CheckItem
            key={i}
            icon={s.icon}
            label={s.label}
            frame={frame}
            checkAt={CHECK_TIMES[i]}
            fps={fps}
            index={i}
          />
        ))}
      </div>

      {/* Phone */}
      <PhoneMockup scrollY={scrollY} opacity={phoneOp} scale={phoneScale} />

      {/* Scene dots */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: 80,
          display: "flex",
          gap: 8,
          opacity: titleOp,
        }}
      >
        {[0, 0, 1, 0, 0, 0, 0].map((active, i) => (
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
  );
};
