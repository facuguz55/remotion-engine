import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

const PHONE_H = 700;

const BG_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 71.3 + 17) % 100),
  y: ((i * 43.7 + 29) % 100),
  size: 1.5 + (i % 3),
  color: i % 3 === 0 ? "#00c8d4" : i % 3 === 1 ? "#ff6b35" : "#8899aa",
  vy: 0.018 + (i % 6) * 0.009,
}));

interface ScreenProps {
  children: React.ReactNode;
}

// MiniScreen con height: 100% para que todos tengan la misma altura
const MiniScreen: React.FC<ScreenProps> = ({ children }) => (
  <div
    style={{
      background: "#080e18",
      borderRadius: 22,
      border: `1.5px solid ${C.border}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: `0 20px 40px #00000060, 0 0 0 1px ${C.cyan}10`,
      height: "100%",
    }}
  >
    {/* Status bar */}
    <div style={{ background: C.panel, height: 26, display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>9:41</div>
      <div style={{ width: 36, height: 10, background: "#080e18", borderRadius: 5 }} />
      <div style={{ color: C.gray, fontSize: 8 }}>●●</div>
    </div>
    {/* Nav */}
    <div style={{ background: C.panel, height: 34, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ color: C.cyan, fontSize: 13, fontFamily: FONT, fontWeight: 900 }}>RIGHT</div>
      <div style={{ flex: 1 }} />
      <div style={{ background: C.cyan, width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🛒</div>
    </div>
    {/* Content fills remaining space */}
    <div style={{ flex: 1, overflow: "hidden", background: C.bg }}>{children}</div>
    {/* Home bar */}
    <div style={{ height: 14, background: "#080e18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: 50, height: 2.5, borderRadius: 2, background: C.gray, opacity: 0.3 }} />
    </div>
  </div>
);

const CatalogContent: React.FC = () => (
  <div style={{ padding: 10, overflow: "hidden" }}>
    <div style={{ background: C.cyan, height: 22, borderRadius: 4, display: "flex", alignItems: "center", padding: "0 8px", marginBottom: 8 }}>
      <div style={{ color: C.bg, fontSize: 9, fontFamily: FONT, fontWeight: 700 }}>🚚 Envío gratis +$150.000</div>
    </div>
    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
      {["Todos", "Nike", "Adidas"].map((f, i) => (
        <div key={f} style={{ background: i === 0 ? C.cyan : C.card, color: i === 0 ? C.bg : C.gray, padding: "3px 7px", borderRadius: 12, fontSize: 8, fontFamily: FONT, fontWeight: 700, border: `1px solid ${i === 0 ? C.cyan : C.border}` }}>{f}</div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      {[["👟", "$124.999"], ["⚽", "$98.000"], ["👟", "$134.500"], ["⚽", "$88.000"], ["👟", "$76.500"], ["⚽", "$112.000"]].map(([em, pr], i) => (
        <div key={i} style={{ background: C.card, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <div style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? C.cyan + "25" : C.orange + "22"})`, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{em}</div>
          <div style={{ padding: "4px 6px 6px" }}>
            <div style={{ color: C.gray, fontSize: 7, fontFamily: FONT }}>Right Botines</div>
            <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 700 }}>{pr}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductContent: React.FC = () => (
  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 7, overflow: "hidden" }}>
    <div style={{ background: `linear-gradient(135deg, ${C.cyan}28, ${C.orange}20)`, borderRadius: 10, height: 110, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>👟</div>
    <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT }}>Nike • Botines de Fútbol</div>
    <div style={{ color: C.white, fontSize: 12, fontFamily: FONT, fontWeight: 800, lineHeight: 1.2 }}>Mercurial Vapor 15 Academy</div>
    <div style={{ color: C.cyan, fontSize: 16, fontFamily: FONT, fontWeight: 900 }}>$124.999</div>
    <div style={{ background: `${C.cyan}15`, border: `1px solid ${C.cyan}50`, borderRadius: 6, padding: "5px 8px" }}>
      <div style={{ color: C.cyan, fontSize: 9, fontFamily: FONT, fontWeight: 700 }}>3 cuotas de $41.666 sin interés</div>
    </div>
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {["39", "40", "41", "42", "43"].map(t => (
        <div key={t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 5, padding: "3px 6px" }}>
          <div style={{ color: C.white, fontSize: 9, fontFamily: FONT }}>{t}</div>
        </div>
      ))}
    </div>
    <div style={{ background: C.orange, borderRadius: 7, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 800 }}>AGREGAR AL CARRITO</div>
    </div>
  </div>
);

const SearchContent: React.FC = () => (
  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 7, overflow: "hidden" }}>
    <div style={{ background: C.card, border: `1px solid ${C.cyan}50`, borderRadius: 8, height: 32, display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
      <div style={{ color: C.gray, fontSize: 12 }}>🔍</div>
      <div style={{ color: C.cyan, fontSize: 10, fontFamily: FONT }}>nike mercurial</div>
      <div style={{ width: 1, height: 14, background: C.cyan }} />
    </div>
    <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>3 resultados encontrados</div>
    {[["Mercurial Vapor 15", "$124.999"], ["Mercurial Superfly", "$148.000"], ["Tiempo Legend 9", "$98.000"]].map(([name, price], i) => (
      <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 36, height: 36, background: `${C.cyan}20`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👟</div>
        <div>
          <div style={{ color: C.white, fontSize: 9, fontFamily: FONT, fontWeight: 700 }}>{name}</div>
          <div style={{ color: C.cyan, fontSize: 10, fontFamily: FONT, fontWeight: 900 }}>{price}</div>
        </div>
      </div>
    ))}
  </div>
);

const NotFoundContent: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, padding: 16 }}>
    <div style={{ fontSize: 52, fontWeight: 900, fontFamily: FONT, background: `linear-gradient(135deg, ${C.cyan}, ${C.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>404</div>
    <div style={{ color: C.gray, fontSize: 10, fontFamily: FONT, textAlign: "center", lineHeight: 1.5 }}>Página no encontrada</div>
    <div style={{ background: C.cyan, borderRadius: 6, padding: "5px 12px" }}>
      <div style={{ color: C.bg, fontSize: 9, fontFamily: FONT, fontWeight: 800 }}>Volver al inicio</div>
    </div>
  </div>
);

const SCREENS = [
  { title: "Catálogo", icon: "🛍️", content: <CatalogContent /> },
  { title: "Producto", icon: "👟", content: <ProductContent /> },
  { title: "Búsqueda", icon: "🔍", content: <SearchContent /> },
  { title: "Error 404", icon: "🚫", content: <NotFoundContent /> },
];

const DELAYS = [12, 30, 48, 66];

export const Scene5Estilo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Escena ahora dura 240 frames (8s)
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [228, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [12, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [100, 126], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [100, 126], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      {/* Partículas de fondo */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {BG_PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 1.6 + 400) % 110) - 5;
          const px = p.x + Math.sin(frame * 0.016 + i * 1.2) * 2;
          return <div key={i} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: 0.16 }} />;
        })}
      </div>

      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.15 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp }}>
        <div style={{ fontSize: 52, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1 }}>El Estilo</div>
        <div style={{ width: 280, height: 4, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 2, margin: "10px auto 0" }} />
      </div>

      {/* Labels row */}
      <div style={{ position: "absolute", top: 150, left: 80, right: 80, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, opacity: titleOp }}>
        {SCREENS.map(({ title, icon }, i) => {
          const spr = spring({ frame: frame - DELAYS[i], fps, config: { damping: 16, stiffness: 90 } });
          return (
            <div key={i} style={{ textAlign: "center", opacity: spr, transform: `translateY(${interpolate(spr, [0, 1], [20, 0])}px)` }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ color: C.gray, fontSize: 13, fontFamily: FONT, fontWeight: 600, marginTop: 4 }}>{title}</div>
            </div>
          );
        })}
      </div>

      {/* Phones grid — todos a la misma altura PHONE_H */}
      <div style={{ position: "absolute", top: 216, left: 80, right: 80, height: PHONE_H, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24 }}>
        {SCREENS.map(({ content }, i) => {
          const spr = spring({ frame: frame - DELAYS[i], fps, config: { damping: 16, stiffness: 90 } });
          return (
            <div key={i} style={{ height: "100%", transform: `translateY(${interpolate(spr, [0, 1], [50, 0])}px)`, opacity: spr }}>
              <MiniScreen>{content}</MiniScreen>
            </div>
          );
        })}
      </div>

      {/* Subtitle */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: `translateX(-50%) translateY(${subtitleY}px)`, textAlign: "center", opacity: subtitleOp }}>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FONT, color: C.white }}>Consistencia en toda la tienda</div>
        <div style={{ fontSize: 15, color: C.gray, fontFamily: FONT, marginTop: 4 }}>Mismo estilo oscuro · Mismos colores · Misma tipografía</div>
      </div>
    </AbsoluteFill>
  );
};
