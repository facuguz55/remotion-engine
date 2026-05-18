import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./constants";

interface ScreenProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const MiniScreen: React.FC<ScreenProps> = ({ title, icon, children }) => (
  <div
    style={{
      background: "#080e18",
      borderRadius: 22,
      border: `1.5px solid ${C.border}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: `0 20px 40px #00000060, 0 0 0 1px ${C.cyan}10`,
    }}
  >
    {/* Mini status bar */}
    <div
      style={{
        background: C.panel,
        height: 28,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>9:41</div>
      <div style={{ width: 36, height: 10, background: "#080e18", borderRadius: 5 }} />
      <div style={{ color: C.gray, fontSize: 8 }}>●●</div>
    </div>

    {/* Nav */}
    <div
      style={{
        background: C.panel,
        height: 36,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ color: C.cyan, fontSize: 13, fontFamily: FONT, fontWeight: 900 }}>RIGHT</div>
      <div style={{ flex: 1 }} />
      <div style={{ background: C.cyan, width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🛒</div>
    </div>

    {/* Content */}
    <div style={{ flex: 1, overflow: "hidden", background: C.bg }}>
      {children}
    </div>

    {/* Bottom bar */}
    <div style={{ height: 16, background: "#080e18", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 50, height: 2.5, borderRadius: 2, background: C.gray, opacity: 0.3 }} />
    </div>
  </div>
);

const CatalogScreen: React.FC = () => (
  <div style={{ padding: 10 }}>
    {/* Ticker */}
    <div style={{ background: C.cyan, height: 20, borderRadius: 4, display: "flex", alignItems: "center", padding: "0 8px", marginBottom: 8 }}>
      <div style={{ color: C.bg, fontSize: 9, fontFamily: FONT, fontWeight: 700 }}>🚚 Envío gratis +$150.000</div>
    </div>
    {/* Filter chips */}
    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
      {["Todos", "Nike", "Adidas"].map((f, i) => (
        <div key={f} style={{
          background: i === 0 ? C.cyan : C.card,
          color: i === 0 ? C.bg : C.gray,
          padding: "3px 8px",
          borderRadius: 12,
          fontSize: 9,
          fontFamily: FONT,
          fontWeight: 700,
          border: `1px solid ${i === 0 ? C.cyan : C.border}`,
        }}>{f}</div>
      ))}
    </div>
    {/* Grid */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      {[
        { emoji: "👟", name: "Mercurial", price: "$124.999" },
        { emoji: "⚽", name: "Predator", price: "$98.000" },
        { emoji: "👟", name: "Vapor 14", price: "$134.500" },
        { emoji: "⚽", name: "Tiempo", price: "$88.000" },
      ].map(({ emoji, name, price }, i) => (
        <div key={i} style={{ background: C.card, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <div style={{ background: `linear-gradient(135deg, ${C.cyan}25, ${C.orange}15)`, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{emoji}</div>
          <div style={{ padding: "4px 6px 6px" }}>
            <div style={{ color: C.gray, fontSize: 8, fontFamily: FONT }}>{name}</div>
            <div style={{ color: C.white, fontSize: 10, fontFamily: FONT, fontWeight: 700 }}>{price}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductScreen: React.FC = () => (
  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ background: `linear-gradient(135deg, ${C.cyan}25, ${C.orange}18)`, borderRadius: 10, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👟</div>
    <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>Nike • Botines de Fútbol</div>
    <div style={{ color: C.white, fontSize: 13, fontFamily: FONT, fontWeight: 800, lineHeight: 1.2 }}>Mercurial Vapor 15 Academy</div>
    <div style={{ color: C.cyan, fontSize: 16, fontFamily: FONT, fontWeight: 900 }}>$124.999</div>
    <div style={{ background: `${C.cyan}15`, border: `1px solid ${C.cyan}50`, borderRadius: 6, padding: "5px 8px" }}>
      <div style={{ color: C.cyan, fontSize: 9, fontFamily: FONT, fontWeight: 700 }}>3 cuotas de $41.666 sin interés</div>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      {["39","40","41","42","43"].map(t => (
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

const SearchScreen: React.FC = () => (
  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
    {/* Search input */}
    <div style={{ background: C.card, border: `1px solid ${C.cyan}50`, borderRadius: 8, height: 32, display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
      <div style={{ color: C.gray, fontSize: 12 }}>🔍</div>
      <div style={{ color: C.cyan, fontSize: 10, fontFamily: FONT }}>nike mercurial</div>
      <div style={{ width: 1, height: 14, background: C.cyan, animation: "blink 1s infinite" }} />
    </div>
    {/* Results */}
    <div style={{ color: C.gray, fontSize: 9, fontFamily: FONT }}>3 resultados</div>
    {[
      { name: "Mercurial Vapor 15", price: "$124.999" },
      { name: "Mercurial Superfly", price: "$148.000" },
      { name: "Tiempo Legend 9", price: "$98.000" },
    ].map(({ name, price }, i) => (
      <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 36, height: 36, background: `${C.cyan}20`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👟</div>
        <div>
          <div style={{ color: C.white, fontSize: 9, fontFamily: FONT, fontWeight: 700 }}>{name}</div>
          <div style={{ color: C.cyan, fontSize: 10, fontFamily: FONT, fontWeight: 900 }}>{price}</div>
        </div>
      </div>
    ))}
  </div>
);

const NotFoundScreen: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, padding: 16 }}>
    <div
      style={{
        fontSize: 48,
        fontWeight: 900,
        fontFamily: FONT,
        background: `linear-gradient(135deg, ${C.cyan}, ${C.orange})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
      }}
    >
      404
    </div>
    <div style={{ color: C.gray, fontSize: 10, fontFamily: FONT, textAlign: "center", lineHeight: 1.4 }}>
      Página no encontrada
    </div>
    <div style={{ background: C.cyan, borderRadius: 6, padding: "5px 12px" }}>
      <div style={{ color: C.bg, fontSize: 9, fontFamily: FONT, fontWeight: 800 }}>Volver al inicio</div>
    </div>
  </div>
);

const SCREENS = [
  { title: "Catálogo", icon: "🛍️", component: <CatalogScreen /> },
  { title: "Producto", icon: "👟", component: <ProductScreen /> },
  { title: "Búsqueda", icon: "🔍", component: <SearchScreen /> },
  { title: "Error 404", icon: "🚫", component: <NotFoundScreen /> },
];

export const Scene5Estilo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [335, 360], [1, 0], { extrapolateLeft: "clamp" });
  const op = fadeIn * fadeOut;

  const titleOp = interpolate(frame, [18, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [130, 160], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const DELAYS = [15, 35, 55, 75];

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

      {/* Title */}
      <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: titleOp }}>
        <div style={{ fontSize: 52, fontWeight: 900, fontFamily: FONT, color: C.white, lineHeight: 1 }}>El Estilo</div>
        <div style={{ width: 280, height: 4, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, borderRadius: 2, margin: "10px auto 0" }} />
      </div>

      {/* 2x2 grid of screens */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          right: 80,
          bottom: 100,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 24,
        }}
      >
        {SCREENS.map(({ title, icon, component }, i) => {
          const spr = spring({ frame: frame - DELAYS[i], fps, config: { damping: 16, stiffness: 90 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transform: `translateY(${interpolate(spr, [0, 1], [60, 0])}px)`,
                opacity: spr,
              }}
            >
              {/* Label */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ color: C.gray, fontSize: 12, fontFamily: FONT, fontWeight: 600, marginTop: 2 }}>{title}</div>
              </div>
              {/* Screen */}
              <div style={{ flex: 1 }}>
                <MiniScreen title={title} icon={icon}>
                  {component}
                </MiniScreen>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: "50%",
          transform: `translateX(-50%) translateY(${subtitleY}px)`,
          textAlign: "center",
          opacity: subtitleOp,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FONT, color: C.white }}>
          Consistencia en toda la tienda
        </div>
        <div style={{ fontSize: 15, color: C.gray, fontFamily: FONT, marginTop: 4 }}>
          Mismo estilo oscuro · Mismos colores · Misma tipografía
        </div>
      </div>
    </AbsoluteFill>
  );
};
