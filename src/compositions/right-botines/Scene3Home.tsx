import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

// Checks más rápidos y scroll más veloz
const CHECK_TIMES = [38, 80, 140, 205];

const SECTION_LABELS = [
  { icon: "🚚", label: "Ticker de envíos" },
  { icon: "🔥", label: "Hot Sale + Countdown" },
  { icon: "👟", label: "Grilla de Productos" },
  { icon: "⭐", label: "Carrusel de Jugadores" },
];

// Scroll con easing — transiciones más cortas y ágiles
const getScrollY = (f: number): number => {
  if (f < 42) return 0;
  if (f < 68)
    return interpolate(f, [42, 68], [0, -75], {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  if (f < 90) return -75;
  if (f < 118)
    return interpolate(f, [90, 118], [-75, -170], {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  if (f < 148) return -170;
  if (f < 174)
    return interpolate(f, [148, 174], [-170, -215], {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return -215;
};

const PhoneContent: React.FC<{ scrollY: number }> = ({ scrollY }) => (
  <div style={{ transform: `translateY(${scrollY}px)`, width: "100%", display: "flex", flexDirection: "column" }}>

    {/* Nav: 52px */}
    <div style={{ height: 52, background: C.panel, display: "flex", alignItems: "center", padding: "0 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ color: C.cyan, fontSize: 18, fontFamily: FONT, fontWeight: 900, letterSpacing: 1 }}>RIGHT</div>
      <div style={{ flex: 1 }} />
      <div style={{ background: C.cyan, width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🛒</div>
    </div>

    {/* Ticker: 36px — total 88px */}
    <div style={{ height: 36, background: C.cyan, display: "flex", alignItems: "center", padding: "0 14px", flexShrink: 0 }}>
      <div style={{ color: C.bg, fontSize: 12, fontFamily: FONT, fontWeight: 700 }}>🚚 Envío gratis a partir de $150.000 — Retiro en sucursal gratis</div>
    </div>

    {/* Hot Sale: ~266px — total ~354px */}
    <div style={{ background: `linear-gradient(160deg, ${C.panel}, #0e1e33)`, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      {/* Hero banner: 80px */}
      <div style={{ height: 80, background: `linear-gradient(135deg, #0f1f35, #1a0d05)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderBottom: `1px solid ${C.border}30` }}>
        <div style={{ color: C.orange, fontSize: 28, fontFamily: FONT, fontWeight: 900, letterSpacing: -1 }}>HOT SALE</div>
        <div style={{ fontSize: 26 }}>🔥</div>
      </div>
      {/* Content */}
      <div style={{ padding: "14px 14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: C.gray, fontSize: 12, fontFamily: FONT }}>Oferta válida por tiempo limitado</div>
        {/* Countdown */}
        <div style={{ display: "flex", gap: 6 }}>
          {[{ label: "HS", val: "02" }, { label: "MIN", val: "47" }, { label: "SEG", val: "31" }].map(({ label, val }) => (
            <div key={label} style={{ background: C.card, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ color: C.white, fontSize: 20, fontFamily: FONT, fontWeight: 900, lineHeight: 1 }}>{val}</div>
              <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT, fontWeight: 700, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div style={{ background: C.orange, borderRadius: 7, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: C.white, fontSize: 12, fontFamily: FONT, fontWeight: 800 }}>VER TODAS LAS OFERTAS →</div>
        </div>
        {/* Cuotas */}
        <div style={{ color: C.cyan, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>💳 3 cuotas sin interés en todos los modelos</div>
      </div>
    </div>

    {/* Products: ~376px — total ~730px */}
    <div style={{ flexShrink: 0, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ color: C.white, fontSize: 15, fontFamily: FONT, fontWeight: 800, marginBottom: 8 }}>Nuevos Ingresos</div>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {["Todos", "Nike", "Adidas", "Puma"].map((f, i) => (
            <div key={f} style={{ background: i === 0 ? C.cyan : C.card, color: i === 0 ? C.bg : C.gray, padding: "3px 8px", borderRadius: 12, fontSize: 9, fontFamily: FONT, fontWeight: 700, border: `1px solid ${i === 0 ? C.cyan : C.border}` }}>
              {f}
            </div>
          ))}
        </div>
      </div>
      {/* Grid 9 products — 3 rows */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, padding: "0 14px 14px" }}>
        {[
          { name: "Mizuno Morelia", price: "$89.999", accent: C.cyan + "35" },
          { name: "Nike Mercurial", price: "$124.999", accent: C.orange + "30" },
          { name: "Puma Future 7", price: "$76.500", accent: C.cyan + "25" },
          { name: "Adidas Predator", price: "$98.000", accent: C.orange + "25" },
          { name: "New Balance 442", price: "$112.000", accent: C.cyan + "28" },
          { name: "Topper Tevez", price: "$64.999", accent: C.orange + "20" },
          { name: "Penalty Storm", price: "$72.000", accent: C.cyan + "22" },
          { name: "Umbro Velocita", price: "$68.000", accent: C.orange + "22" },
          { name: "Joma Mundial", price: "$81.000", accent: C.cyan + "20" },
        ].map(({ name, price, accent }, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ background: accent, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👟</div>
            <div style={{ padding: "5px 7px 7px" }}>
              <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT, lineHeight: 1.2 }}>{name}</div>
              <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 700, marginTop: 2 }}>{price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Players: ~161px — total ~891px */}
    <div style={{ padding: "12px 14px 18px", flexShrink: 0 }}>
      <div style={{ color: C.white, fontSize: 15, fontFamily: FONT, fontWeight: 800, marginBottom: 10 }}>Usados por los Mejores ⭐</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { name: "Mateo del Blanco", team: "Unión de Santa Fe" },
          { name: "Matías Aguirre", team: "Unión de Santa Fe" },
          { name: "Corvalán", team: "Unión de Santa Fe" },
        ].map(({ name, team }, i) => (
          <div key={i} style={{ background: C.panel, borderRadius: 10, border: `1px solid ${C.border}`, padding: "12px 10px", flex: 1, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.cyan}40, ${C.orange}40)`, margin: "0 auto 6px", border: `2px solid ${C.cyan}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚽</div>
            <div style={{ color: C.white, fontSize: 9, fontFamily: FONT, fontWeight: 700, lineHeight: 1.2 }}>{name}</div>
            <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT, marginTop: 2 }}>{team}</div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

const PhoneMockup: React.FC<{ scrollY: number; opacity: number; scale: number }> = ({ scrollY, opacity, scale }) => (
  <div style={{ position: "absolute", right: 120, top: "50%", transform: `translateY(-50%) scale(${scale})`, width: 360, height: 720, opacity }}>
    <div style={{ width: "100%", height: "100%", background: "#080e18", borderRadius: 42, border: `2px solid ${C.border}`, boxShadow: `0 0 60px ${C.cyan}20, 0 40px 80px #00000080, inset 0 0 0 1px ${C.cyan}10`, overflow: "hidden", position: "relative" }}>
      {/* Status bar */}
      <div style={{ height: 44, background: C.panel, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ color: C.gray, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>9:41</div>
        <div style={{ width: 80, height: 20, background: "#080e18", borderRadius: 10 }} />
        <div style={{ color: C.gray, fontSize: 9 }}>●●● 🔋</div>
      </div>
      {/* Scrollable content */}
      <div style={{ overflow: "hidden", height: "calc(100% - 44px)", position: "relative" }}>
        <PhoneContent scrollY={scrollY} />
      </div>
      {/* Home bar */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, borderRadius: 2, background: C.gray, opacity: 0.4 }} />
    </div>
  </div>
);

const CheckItem: React.FC<{ icon: string; label: string; frame: number; checkAt: number; fps: number }> = ({ icon, label, frame, checkAt, fps }) => {
  if (frame < checkAt - 15) return null;

  const spr = spring({ frame: frame - (checkAt - 15), fps, config: { damping: 14, stiffness: 120 } });
  const checkSpr = spring({ frame: frame - checkAt, fps, config: { damping: 12, stiffness: 200 } });
  const isChecked = frame >= checkAt;
  const op = interpolate(frame, [checkAt - 15, checkAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: op, transform: `translateX(${interpolate(spr, [0, 1], [-30, 0])}px)`, marginBottom: 22 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isChecked ? C.cyan : "transparent", border: `2px solid ${isChecked ? C.cyan : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${interpolate(checkSpr, [0, 1], [0.5, 1])})` }}>
        {isChecked && <div style={{ color: C.bg, fontSize: 16, fontWeight: 900, lineHeight: 1, opacity: checkSpr }}>✓</div>}
      </div>
      <div>
        <div style={{ fontSize: 11, color: C.gray, fontFamily: FONT }}>{icon}</div>
        <div style={{ fontSize: 17, color: isChecked ? C.white : C.gray, fontFamily: FONT, fontWeight: isChecked ? 700 : 500 }}>{label}</div>
      </div>
    </div>
  );
};

export const Scene3Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [438, 450], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const phoneSpr = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const scrollY = getScrollY(frame);
  const titleOp = interpolate(frame, [14, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.15 }} />

      {/* Phone glow */}
      <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", width: 500, height: 800, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.cyan}10 0%, transparent 65%)`, opacity: phoneSpr }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 54, left: 80, opacity: titleOp }}>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1 }}>La Home</div>
        <div style={{ width: 220, height: 4, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 2, marginTop: 10 }} />
      </div>

      {/* Checklist */}
      <div style={{ position: "absolute", left: 80, top: 200, width: 400 }}>
        {SECTION_LABELS.map((s, i) => (
          <CheckItem key={i} icon={s.icon} label={s.label} frame={frame} checkAt={CHECK_TIMES[i]} fps={fps} />
        ))}
      </div>

      {/* Phone */}
      <PhoneMockup scrollY={scrollY} opacity={phoneSpr} scale={interpolate(phoneSpr, [0, 1], [0.85, 1])} />

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 54, left: 80, display: "flex", gap: 8, opacity: titleOp }}>
        {[0, 0, 1, 0, 0, 0, 0].map((active, i) => (
          <div key={i} style={{ width: active ? 28 : 8, height: 4, borderRadius: 2, background: active ? C.cyan : C.gray, opacity: active ? 1 : 0.3 }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
