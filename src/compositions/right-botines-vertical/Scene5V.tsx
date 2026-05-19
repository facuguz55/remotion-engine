import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../right-botines/constants";

const BG_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 71.3 + 17) % 100),
  y: ((i * 43.7 + 29) % 100),
  size: 1.5 + (i % 3),
  color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.orange : C.gray,
  vy: 0.018 + (i % 6) * 0.009,
}));

const MiniScreenV: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: "#080e18", borderRadius: 20, border: `1.5px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", boxShadow: `0 16px 32px #00000060, 0 0 0 1px ${C.cyan}08` }}>
    <div style={{ background: C.panel, height: 24, display: "flex", alignItems: "center", padding: "0 10px", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT }}>9:41</div>
      <div style={{ width: 32, height: 9, background: "#080e18", borderRadius: 5 }} />
      <div style={{ color: C.gray, fontSize: 7 }}>●●</div>
    </div>
    <div style={{ background: C.panel, height: 32, display: "flex", alignItems: "center", padding: "0 10px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ color: C.cyan, fontSize: 12, fontFamily: FONT, fontWeight: 900 }}>RIGHT</div>
      <div style={{ flex: 1 }} />
      <div style={{ background: C.cyan, width: 18, height: 18, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>🛒</div>
    </div>
    <div style={{ flex: 1, overflow: "hidden", background: C.bg }}>{children}</div>
    <div style={{ height: 12, background: "#080e18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: 44, height: 2, borderRadius: 1, background: C.gray, opacity: 0.3 }} />
    </div>
  </div>
);

const CatalogV: React.FC = () => (
  <div style={{ padding: 8, overflow: "hidden" }}>
    <div style={{ background: C.cyan, height: 18, borderRadius: 3, display: "flex", alignItems: "center", padding: "0 7px", marginBottom: 7 }}>
      <div style={{ color: C.bg, fontSize: 8, fontFamily: FONT, fontWeight: 700 }}>🚚 Envío gratis +$150.000</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
      {[[C.cyan + "25", "👟", "$124.999"], [C.orange + "22", "⚽", "$98.000"], [C.cyan + "20", "👟", "$76.500"], [C.orange + "20", "⚽", "$88.000"], [C.cyan + "22", "👟", "$112.000"], [C.orange + "18", "⚽", "$64.999"]].map(([bg, em, pr], i) => (
        <div key={i} style={{ background: C.card, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <div style={{ background: bg, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{em}</div>
          <div style={{ padding: "3px 5px 4px" }}>
            <div style={{ color: C.gray, fontSize: 6, fontFamily: FONT }}>Right Botines</div>
            <div style={{ color: C.white, fontSize: 8, fontFamily: FONT, fontWeight: 700 }}>{pr}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductV: React.FC = () => (
  <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 5, overflow: "hidden" }}>
    <div style={{ background: `linear-gradient(135deg, ${C.cyan}28, ${C.orange}20)`, borderRadius: 8, height: 90, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>👟</div>
    <div style={{ color: C.gray, fontSize: 7, fontFamily: FONT }}>Nike • Botines de Fútbol</div>
    <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 800, lineHeight: 1.2 }}>Mercurial Vapor 15 Academy</div>
    <div style={{ color: C.cyan, fontSize: 14, fontFamily: FONT, fontWeight: 900 }}>$124.999</div>
    <div style={{ background: `${C.cyan}15`, border: `1px solid ${C.cyan}50`, borderRadius: 5, padding: "4px 7px" }}>
      <div style={{ color: C.cyan, fontSize: 8, fontFamily: FONT, fontWeight: 700 }}>3 cuotas de $41.666 sin interés</div>
    </div>
    <div style={{ display: "flex", gap: 3 }}>
      {["39", "40", "41", "42", "43"].map(t => <div key={t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 5px" }}><div style={{ color: C.white, fontSize: 8, fontFamily: FONT }}>{t}</div></div>)}
    </div>
    <div style={{ background: C.orange, borderRadius: 6, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.white, fontSize: 8, fontFamily: FONT, fontWeight: 800 }}>AGREGAR AL CARRITO</div>
    </div>
  </div>
);

const SearchV: React.FC = () => (
  <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
    <div style={{ background: C.card, border: `1px solid ${C.cyan}50`, borderRadius: 7, height: 28, display: "flex", alignItems: "center", padding: "0 9px", gap: 5 }}>
      <div style={{ color: C.gray, fontSize: 10 }}>🔍</div>
      <div style={{ color: C.cyan, fontSize: 9, fontFamily: FONT }}>nike mercurial</div>
    </div>
    <div style={{ color: C.gray, fontSize: 7, fontFamily: FONT }}>3 resultados encontrados</div>
    {[["Mercurial Vapor 15", "$124.999"], ["Mercurial Superfly", "$148.000"], ["Tiempo Legend 9", "$98.000"]].map(([n, p], i) => (
      <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: 7, display: "flex", gap: 7, alignItems: "center" }}>
        <div style={{ width: 30, height: 30, background: `${C.cyan}20`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👟</div>
        <div><div style={{ color: C.white, fontSize: 8, fontFamily: FONT, fontWeight: 700 }}>{n}</div><div style={{ color: C.cyan, fontSize: 9, fontFamily: FONT, fontWeight: 900 }}>{p}</div></div>
      </div>
    ))}
  </div>
);

const NotFoundV: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, padding: 14 }}>
    <div style={{ fontSize: 44, fontWeight: 900, fontFamily: FONT, background: `linear-gradient(135deg, ${C.cyan}, ${C.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>404</div>
    <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT, textAlign: "center", lineHeight: 1.4 }}>Página no encontrada</div>
    <div style={{ background: C.cyan, borderRadius: 5, padding: "4px 10px" }}><div style={{ color: C.bg, fontSize: 8, fontFamily: FONT, fontWeight: 800 }}>Volver al inicio</div></div>
  </div>
);

const SCREENS = [
  { title: "Catálogo", icon: "🛍️", content: <CatalogV /> },
  { title: "Producto", icon: "👟", content: <ProductV /> },
  { title: "Búsqueda", icon: "🔍", content: <SearchV /> },
  { title: "Error 404", icon: "🚫", content: <NotFoundV /> },
];

const DELAYS = [12, 28, 44, 60];

export const Scene5V: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [228, 240], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [95, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [95, 120], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 2×2 grid layout
  // Canvas 1080×1920, margins 60px, gap 20px
  // Cell width: (960-20)/2 = 470px
  // Grid y: 200 to 1730 = 1530px height, 2 rows: (1530-20)/2 = 755px per row
  const CELL_W = 470;
  const CELL_H = 755;
  const GRID_X = 60;
  const GRID_Y = 200;
  const GAP = 20;

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: op }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');`}</style>

      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {BG_PARTICLES.map((p, i) => {
          const py = ((p.y - frame * p.vy * 1.6 + 400) % 110) - 5;
          return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${py}%`, width: p.size, height: p.size, borderRadius: "50%", background: p.color, opacity: 0.14 }} />;
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.14 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 58, fontWeight: 900, fontFamily: FONT, color: C.white }}>El Estilo</div>
        <div style={{ width: 300, height: 5, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 2, margin: "12px auto 0" }} />
      </div>

      {/* 2×2 grid */}
      {SCREENS.map(({ title, icon, content }, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = GRID_X + col * (CELL_W + GAP);
        const y = GRID_Y + row * (CELL_H + GAP);
        const spr = spring({ frame: frame - DELAYS[i], fps, config: { damping: 16, stiffness: 90 } });

        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: CELL_W, height: CELL_H, transform: `translateY(${interpolate(spr, [0, 1], [50, 0])}px)`, opacity: spr }}>
            {/* Label dentro del cell */}
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ color: C.gray, fontSize: 18, fontFamily: FONT, fontWeight: 600 }}>{icon} {title}</div>
            </div>
            <div style={{ height: `calc(100% - 38px)` }}>
              <MiniScreenV>{content}</MiniScreenV>
            </div>
          </div>
        );
      })}

      {/* Subtitle */}
      <div style={{ position: "absolute", bottom: 52, left: "50%", transform: `translateX(-50%) translateY(${subtitleY}px)`, textAlign: "center", opacity: subtitleOp, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: FONT, color: C.white }}>Consistencia en toda la tienda</div>
        <div style={{ fontSize: 18, color: C.gray, fontFamily: FONT, marginTop: 6 }}>Mismo estilo · Mismos colores · Misma tipografía</div>
      </div>
    </AbsoluteFill>
  );
};
