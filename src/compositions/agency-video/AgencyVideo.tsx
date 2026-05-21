import React from 'react'
import {
  AbsoluteFill,
  type CalculateMetadataFunction,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { FRAMES_PER_SLIDE as DEFAULT_FPS, TRANSITION_FRAMES, GOOGLE_FONTS, FORMAT_DIMENSIONS, type VideoFormat } from './constants'

export interface SlideGraphicItem {
  label: string
  value?: string        // número en stats/bars, "sent" en phone
  icon?: string
  description?: string  // texto secundario en cards y checklist
}

export interface SlideGraphic {
  type: 'stats' | 'bars' | 'list' | 'cards' | 'phone' | 'checklist' | 'reveal'
  items: SlideGraphicItem[]
}

export interface Slide {
  title: string
  body?: string
  highlight?: string
  graphic?: SlideGraphic
}

export interface AgencyVideoProps {
  clientName: string
  template: string
  slides: Slide[]
  brandColors: string[]
  format?: VideoFormat
  clientImageUrl?: string | null
  framesPerSlide?: number
  totalDurationSeconds?: number
}

export const DEFAULT_AGENCY_PROPS: AgencyVideoProps = {
  clientName: 'Cliente Demo',
  template: 'resultados',
  brandColors: ['#ff8c42', '#6366f1'],
  format: 'vertical',
  slides: [
    { title: '*Resultados reales* en 90 días', body: 'Lo que logramos juntos — con datos concretos', highlight: 'NOVA AGENCY' },
    {
      title: '*+150%* de ventas',
      body: 'Números reales del primer trimestre',
      graphic: { type: 'stats', items: [{ label: 'Ventas', value: '+150%', icon: '📈' }, { label: 'Clientes', value: '+2.400', icon: '👥' }, { label: 'ROI', value: '×3', icon: '💰' }] }
    },
    {
      title: 'Todo lo que activamos',
      graphic: { type: 'cards', items: [{ label: 'Ads en Meta', icon: '🎯', description: 'Campañas que generan ventas reales' }, { label: 'WhatsApp Bot', icon: '💬', description: 'Responde solo mientras dormís' }, { label: 'Email flows', icon: '📧', description: 'Secuencias automáticas' }, { label: 'Reportes', icon: '📊', description: 'Cada semana en tu celular' }] }
    },
    { title: '¿Querés *estos resultados*?', body: 'Escribinos y lo armamos en 24hs', highlight: '¿Arrancamos?' },
  ],
}

// ── Duración dinámica ──────────────────────────────────────────────────────────
export function calcSlideDuration(slide: Slide): number {
  const wordCount  = slide.title.replace(/\*/g, '').split(/\s+/).filter(Boolean).length
  const hasBody    = !!slide.body
  const itemCount  = slide.graphic?.items.length ?? 0
  const gtype      = slide.graphic?.type

  const TEXT_START      = 12
  const WORD_DELAY      = 5
  const TITLE_VISIBLE   = 14
  const BODY_OFFSET     = 8
  const BODY_FADE       = 18
  const GFX_OFFSET      = 20
  const GFX_OFFSET_NONE = 6

  const ITEM_STAGGER = gtype === 'phone' ? 16 : gtype === 'reveal' ? 20 : gtype === 'stats' ? 8 : 10
  const SPRING_SETTLE = gtype === 'phone' ? 18 : gtype === 'reveal' ? 14 : 28
  const COUNTER_ANIM  = gtype === 'stats' ? 22 : 0
  const DWELL         = gtype === 'phone' ? 55 : gtype === 'reveal' ? 50 : 42

  let lastEnd = TEXT_START + wordCount * WORD_DELAY + TITLE_VISIBLE
  if (hasBody) lastEnd = lastEnd + BODY_OFFSET + BODY_FADE
  if (itemCount > 0) {
    const gfxStart = lastEnd + (hasBody ? GFX_OFFSET : GFX_OFFSET_NONE)
    const lastItem = gfxStart + (itemCount - 1) * ITEM_STAGGER
    lastEnd = lastItem + SPRING_SETTLE + COUNTER_ANIM
  }
  return lastEnd + DWELL + TRANSITION_FRAMES
}

export function getSlideDurations(slides: Slide[], totalDurationSeconds?: number): number[] {
  const natural = slides.map(calcSlideDuration)
  if (!totalDurationSeconds) return natural
  const totalFrames  = Math.round(totalDurationSeconds * 30)
  const naturalTotal = natural.reduce((a, b) => a + b, 0)
  const scaled       = natural.map(d => Math.max(Math.round((d / naturalTotal) * totalFrames), 45))
  const diff = totalFrames - scaled.reduce((a, b) => a + b, 0)
  scaled[scaled.length - 1] += diff
  return scaled
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateMetadata: CalculateMetadataFunction<any> = ({ props }: { props: AgencyVideoProps }) => {
  const dims      = FORMAT_DIMENSIONS[props.format ?? 'vertical']
  const durations = getSlideDurations(props.slides, props.totalDurationSeconds)
  const total     = durations.reduce((a, b) => a + b, 0)
  return { durationInFrames: total, fps: 30, ...dims }
}

const NOVA_TEMPLATES = new Set(['prospecto', 'trayecto'])

type AnimStyle = 'rise' | 'focus' | 'pop'
function getAnimStyle(clientName: string, template: string): AnimStyle {
  const seed = Array.from(clientName + template).reduce((a, c) => a + c.charCodeAt(0), 0)
  return (['rise', 'focus', 'pop'] as AnimStyle[])[seed % 3]
}
const ANIM_CONFIGS: Record<AnimStyle, { damping: number; stiffness: number }> = {
  rise:  { damping: 26, stiffness: 95 },
  focus: { damping: 22, stiffness: 90 },
  pop:   { damping: 14, stiffness: 240 },
}
function wordTransform(style: AnimStyle, spr: number, sc: number): React.CSSProperties {
  switch (style) {
    case 'rise':  return { transform: `translateY(${interpolate(spr, [0, 1], [14 * sc, 0])}px)` }
    case 'focus': return { transform: `scale(${interpolate(spr, [0, 1], [0.86, 1])})`, filter: `blur(${interpolate(spr, [0, 1], [6, 0])}px)`, transformOrigin: 'left center' }
    case 'pop':   return { transform: `scale(${interpolate(spr, [0, 1], [0.4, 1])})`, transformOrigin: 'left center' }
  }
}

function parseTitleTokens(title: string): Array<{ text: string; accent: boolean }> {
  const normalized = title.replace(/\*\*([^*]+)\*\*/g, '*$1*')
  const tokens: Array<{ text: string; accent: boolean }> = []
  const parts = normalized.split(/(\*[^*]+\*)/)
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('*') && part.endsWith('*')) {
      for (const w of part.slice(1, -1).split(/\s+/)) {
        if (w) tokens.push({ text: w, accent: true })
      }
    } else {
      for (const w of part.split(/\s+/)) {
        if (w) tokens.push({ text: w, accent: false })
      }
    }
  }
  return tokens
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r},${g},${b}`
}

function parseValueParts(raw: string): { prefix: string; num: number | null; suffix: string } {
  const match = raw.match(/(.*?)([\d.,]+)(.*)/)
  if (!match) return { prefix: '', num: null, suffix: '' }
  return { prefix: match[1], num: parseFloat(match[2].replace(',', '.')), suffix: match[3] }
}

// ── Animated counter ──────────────────────────────────────────────────────────
const AnimatedValue: React.FC<{ raw: string; frame: number; delay: number; duration: number; color: string; fontSize: number }> = ({
  raw, frame, delay, duration, color, fontSize,
}) => {
  const { prefix, num, suffix } = parseValueParts(raw)
  if (num === null) return <span style={{ color, fontSize, fontWeight: 800 }}>{raw}</span>
  const animated = interpolate(frame - delay, [0, duration], [0, num], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const display  = num % 1 === 0 ? Math.round(animated).toLocaleString('es-AR') : animated.toFixed(1)
  return <span style={{ color, fontSize, fontWeight: 800 }}>{prefix}{display}{suffix}</span>
}

// ── Stats panel ────────────────────────────────────────────────────────────────
const StatsPanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number }> = ({ items, brandColors, startFrame, sc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const c1 = brandColors[0] ?? '#ff8c42'
  const c2 = brandColors[1] ?? '#6366f1'
  return (
    <div style={{ display: 'flex', gap: Math.round(16 * sc), justifyContent: 'center', flexWrap: 'wrap' }}>
      {items.map((item, i) => {
        const accent = i === 0 ? c1 : i === 1 ? c2 : c1
        const delay  = startFrame + i * 8
        const spr    = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } })
        return (
          <div key={i} style={{
            position: 'relative',
            background: `linear-gradient(145deg, rgba(${hexToRgb(accent)},0.14), rgba(${hexToRgb(accent)},0.04))`,
            border: `1.5px solid rgba(${hexToRgb(accent)},0.35)`,
            borderRadius: Math.round(20 * sc),
            padding: `${Math.round(22 * sc)}px ${Math.round(28 * sc)}px`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(8 * sc),
            opacity: interpolate(spr, [0, 1], [0, 1]),
            transform: `scale(${interpolate(spr, [0, 1], [0.7, 1])}) translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
            minWidth: Math.round(150 * sc),
            boxShadow: `0 8px 32px rgba(${hexToRgb(accent)},0.15)`,
          }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: Math.round(2 * sc), background: accent, borderRadius: '0 0 4px 4px', opacity: 0.7 }} />
            {item.icon && <span style={{ fontSize: Math.round(32 * sc) }}>{item.icon}</span>}
            {item.value && <AnimatedValue raw={item.value} frame={frame} delay={delay} duration={22} color={accent} fontSize={Math.round(52 * sc)} />}
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(20 * sc), color: 'rgba(255,255,255,0.5)', fontWeight: 600, textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── List panel ────────────────────────────────────────────────────────────────
const ListPanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number }> = ({ items, brandColors, startFrame, sc }) => {
  const c1    = brandColors[0] ?? '#ff8c42'
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(14 * sc), width: '100%' }}>
      {items.map((item, i) => {
        const delay = startFrame + i * 10
        const spr   = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100 } })
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: Math.round(16 * sc),
            opacity: interpolate(spr, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(spr, [0, 1], [-40, 0])}px)`,
            background: `rgba(${hexToRgb(c1)},0.06)`,
            borderRadius: Math.round(12 * sc),
            padding: `${Math.round(14 * sc)}px ${Math.round(18 * sc)}px`,
            borderLeft: `${Math.round(3 * sc)}px solid ${c1}`,
          }}>
            {item.icon && <span style={{ fontSize: Math.round(30 * sc), flexShrink: 0 }}>{item.icon}</span>}
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(30 * sc), color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Bars panel ────────────────────────────────────────────────────────────────
const BarsPanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number }> = ({ items, brandColors, startFrame, sc }) => {
  const c1     = brandColors[0] ?? '#ff8c42'
  const c2     = brandColors[1] ?? '#6366f1'
  const frame  = useCurrentFrame()
  const { fps } = useVideoConfig()
  const maxNum = Math.max(...items.map(it => parseValueParts(it.value ?? '0').num ?? 0), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(20 * sc), width: '100%' }}>
      {items.map((item, i) => {
        const accent = i % 2 === 0 ? c1 : c2
        const delay  = startFrame + i * 12
        const { num } = parseValueParts(item.value ?? '0')
        const barW   = interpolate(frame - delay, [0, 28], [0, ((num ?? 0) / maxNum) * 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const spr    = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 90 } })
        return (
          <div key={i} style={{ opacity: interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(spr, [0, 1], [20, 0])}px)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: Math.round(8 * sc) }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(24 * sc), color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(24 * sc), color: accent, fontWeight: 700 }}>{item.value}</span>
            </div>
            <div style={{ height: Math.round(12 * sc), background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${barW}%`, background: `linear-gradient(90deg, ${accent}, ${accent}bb)`, borderRadius: 999, boxShadow: `0 0 14px rgba(${hexToRgb(accent)},0.5)` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Cards panel ── grid de tarjetas con ícono + título + descripción ────────
const CardsPanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number }> = ({ items, brandColors, startFrame, sc }) => {
  const c1    = brandColors[0] ?? '#ff8c42'
  const c2    = brandColors[1] ?? '#6366f1'
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const cols  = items.length <= 2 ? items.length : 2

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: Math.round(14 * sc), width: '100%' }}>
      {items.map((item, i) => {
        const accent = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c1
        const delay  = startFrame + i * 8
        const spr    = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 130 } })
        return (
          <div key={i} style={{
            background: `linear-gradient(145deg, rgba(${hexToRgb(accent)},0.12) 0%, rgba(${hexToRgb(accent)},0.03) 100%)`,
            border: `1.5px solid rgba(${hexToRgb(accent)},0.28)`,
            borderTop: `2.5px solid rgba(${hexToRgb(accent)},0.7)`,
            borderRadius: Math.round(18 * sc),
            padding: `${Math.round(20 * sc)}px ${Math.round(18 * sc)}px`,
            display: 'flex', flexDirection: 'column', gap: Math.round(8 * sc),
            opacity: interpolate(spr, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(spr, [0, 1], [32, 0])}px) scale(${interpolate(spr, [0, 1], [0.88, 1])})`,
            boxShadow: `0 8px 28px rgba(${hexToRgb(accent)},0.12)`,
          }}>
            {item.icon && (
              <span style={{ fontSize: Math.round(34 * sc), lineHeight: 1 }}>{item.icon}</span>
            )}
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(24 * sc), fontWeight: 700, color: '#eef4ff', lineHeight: 1.2 }}>
              {item.label}
            </span>
            {item.description && (
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(18 * sc), color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, fontWeight: 400 }}>
                {item.description}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Phone panel ── simulación de chat/WhatsApp ────────────────────────────────
const PhonePanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number; clientName?: string }> = ({ items, brandColors, startFrame, sc, clientName }) => {
  const c1    = brandColors[0] ?? '#ff8c42'
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const phoneW = Math.round(520 * sc)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{
        width: phoneW,
        background: 'rgba(8,12,22,0.95)',
        borderRadius: Math.round(28 * sc),
        border: `1.5px solid rgba(${hexToRgb(c1)},0.35)`,
        overflow: 'hidden',
        boxShadow: `0 0 80px rgba(${hexToRgb(c1)},0.12), 0 24px 60px rgba(0,0,0,0.6)`,
      }}>
        {/* Header */}
        <div style={{
          padding: `${Math.round(14 * sc)}px ${Math.round(18 * sc)}px`,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
          background: `rgba(${hexToRgb(c1)},0.06)`,
          display: 'flex', alignItems: 'center', gap: Math.round(10 * sc),
        }}>
          <div style={{
            width: Math.round(36 * sc), height: Math.round(36 * sc), borderRadius: '50%',
            background: `linear-gradient(135deg, ${c1}, rgba(${hexToRgb(c1)},0.5))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(16 * sc),
            flexShrink: 0,
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(18 * sc), fontWeight: 700, color: '#eef4ff' }}>
              {clientName || 'Bot'}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(13 * sc), color: '#4ade80', fontWeight: 500 }}>
              ● en línea
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ padding: `${Math.round(14 * sc)}px ${Math.round(14 * sc)}px`, display: 'flex', flexDirection: 'column', gap: Math.round(10 * sc) }}>
          {items.map((msg, i) => {
            const isSent = msg.value === 'sent'
            const delay  = startFrame + i * 16
            const spr    = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 160 } })
            return (
              <div key={i} style={{
                display: 'flex',
                justifyContent: isSent ? 'flex-end' : 'flex-start',
                opacity: interpolate(spr, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(spr, [0, 1], [isSent ? 24 : -24, 0])}px)`,
              }}>
                <div style={{
                  background: isSent
                    ? `rgba(${hexToRgb(c1)},0.22)`
                    : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${isSent ? `rgba(${hexToRgb(c1)},0.5)` : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: isSent
                    ? `${Math.round(16 * sc)}px ${Math.round(16 * sc)}px ${Math.round(4 * sc)}px ${Math.round(16 * sc)}px`
                    : `${Math.round(16 * sc)}px ${Math.round(16 * sc)}px ${Math.round(16 * sc)}px ${Math.round(4 * sc)}px`,
                  padding: `${Math.round(10 * sc)}px ${Math.round(14 * sc)}px`,
                  maxWidth: '82%',
                }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: Math.round(19 * sc),
                    color: isSent ? `rgba(${hexToRgb(c1)},1)` : 'rgba(255,255,255,0.78)',
                    lineHeight: 1.4, fontWeight: 400,
                  }}>
                    {msg.icon && `${msg.icon} `}{msg.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Checklist panel ── ítems con checkmark animado ───────────────────────────
const ChecklistPanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number }> = ({ items, brandColors, startFrame, sc }) => {
  const c1    = brandColors[0] ?? '#ff8c42'
  const c2    = brandColors[1] ?? '#6366f1'
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(16 * sc), width: '100%' }}>
      {items.map((item, i) => {
        const accent = i % 2 === 0 ? c1 : c2
        const delay  = startFrame + i * 10
        const spr    = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 110 } })
        const checkProgress = interpolate(frame - delay - 6, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: Math.round(16 * sc),
            opacity: interpolate(spr, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(spr, [0, 1], [-30, 0])}px)`,
          }}>
            {/* Animated check circle */}
            <div style={{
              width: Math.round(36 * sc), height: Math.round(36 * sc), borderRadius: '50%',
              border: `2px solid ${accent}`,
              background: `rgba(${hexToRgb(accent)}, ${checkProgress * 0.18})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: Math.round(2 * sc),
              boxShadow: checkProgress > 0.5 ? `0 0 16px rgba(${hexToRgb(accent)},0.4)` : 'none',
              transition: 'box-shadow 0.3s',
            }}>
              <span style={{
                fontSize: Math.round(18 * sc),
                opacity: checkProgress,
                transform: `scale(${interpolate(checkProgress, [0, 1], [0.3, 1])})`,
                display: 'inline-block',
                color: accent,
                fontWeight: 900,
              }}>✓</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(28 * sc), fontWeight: 700, color: '#eef4ff', lineHeight: 1.2 }}>
                {item.icon && `${item.icon} `}{item.label}
              </div>
              {item.description && (
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(20 * sc), color: 'rgba(255,255,255,0.4)', lineHeight: 1.3, marginTop: Math.round(3 * sc), fontWeight: 400 }}>
                  {item.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Reveal panel ── aparición dramática de ítems grandes ─────────────────────
const RevealPanel: React.FC<{ items: SlideGraphicItem[]; brandColors: string[]; startFrame: number; sc: number }> = ({ items, brandColors, startFrame, sc }) => {
  const c1    = brandColors[0] ?? '#ff8c42'
  const c2    = brandColors[1] ?? '#6366f1'
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(10 * sc), width: '100%' }}>
      {items.map((item, i) => {
        const accent = i % 2 === 0 ? c1 : c2
        const delay  = startFrame + i * 20
        const spr    = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 200 } })
        const lineW  = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: Math.round(20 * sc),
            opacity: interpolate(spr, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(spr, [0, 1], [-50, 0])}px)`,
          }}>
            {/* Colored accent number / line */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: Math.round(10 * sc), flexShrink: 0,
            }}>
              <div style={{
                width: Math.round(4 * sc), height: Math.round(52 * sc),
                background: `linear-gradient(to bottom, ${accent}, transparent)`,
                borderRadius: 2, opacity: lineW,
              }} />
            </div>
            <div style={{ flex: 1 }}>
              {item.icon && (
                <span style={{ fontSize: Math.round(28 * sc), marginRight: Math.round(8 * sc) }}>{item.icon}</span>
              )}
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: Math.round(44 * sc),
                fontWeight: 800,
                color: i % 2 === 0 ? '#eef4ff' : accent,
                letterSpacing: -1,
                lineHeight: 1.1,
              }}>
                {item.label}
              </span>
              {item.description && (
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(20 * sc), color: 'rgba(255,255,255,0.4)', marginTop: Math.round(2 * sc) }}>
                  {item.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Background patterns ───────────────────────────────────────────────────────
const BG_PATTERNS = [
  (c1: string, c2: string) => `radial-gradient(ellipse at 50% 40%, rgba(${hexToRgb(c1)},0.28) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(${hexToRgb(c2)},0.18) 0%, transparent 45%)`,
  (c1: string, c2: string) => `radial-gradient(ellipse at 15% 20%, rgba(${hexToRgb(c1)},0.32) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(${hexToRgb(c2)},0.22) 0%, transparent 48%)`,
  (c1: string, c2: string) => `radial-gradient(ellipse at 50% 85%, rgba(${hexToRgb(c1)},0.30) 0%, transparent 52%), radial-gradient(ellipse at 20% 20%, rgba(${hexToRgb(c2)},0.16) 0%, transparent 42%)`,
  (c1: string, c2: string) => `radial-gradient(ellipse at 85% 45%, rgba(${hexToRgb(c1)},0.28) 0%, transparent 50%), radial-gradient(ellipse at 10% 60%, rgba(${hexToRgb(c2)},0.20) 0%, transparent 45%)`,
  (c1: string, c2: string) => `radial-gradient(ellipse at 25% 30%, rgba(${hexToRgb(c1)},0.26) 0%, transparent 48%), radial-gradient(ellipse at 75% 70%, rgba(${hexToRgb(c2)},0.24) 0%, transparent 48%)`,
]

// ── Slide scene ───────────────────────────────────────────────────────────────
const SlideScene: React.FC<{
  slide: Slide
  isFirst: boolean
  isLast: boolean
  brandColors: string[]
  slideIndex: number
  totalSlides: number
  template: string
  clientName: string
  clientImageUrl?: string | null
  framesPerSlide: number
  animStyle: AnimStyle
}> = ({ slide, isFirst, isLast, brandColors, slideIndex, totalSlides, template, clientName, clientImageUrl, framesPerSlide, animStyle }) => {
  const c1    = brandColors[0] ?? '#ff8c42'
  const c2    = brandColors[1] ?? '#6366f1'
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  const sc          = Math.min(width, height) / 1080
  const isLandscape = width > height
  const showNovaBadge = NOVA_TEMPLATES.has(template)

  const fadeIn  = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(frame, [framesPerSlide - TRANSITION_FRAMES, framesPerSlide], [1, 0], { extrapolateLeft: 'clamp' })

  const tokens         = parseTitleTokens(slide.title)
  const wordCount      = tokens.length
  const textStartFrame = isFirst ? 8 : 12
  const wordDelay      = 5
  const bodyFrame      = textStartFrame + wordCount * wordDelay + 8
  const graphicFrame   = bodyFrame + (slide.body ? 20 : 6)
  const ctaFrame       = graphicFrame + (slide.graphic ? (slide.graphic.items.length * 10) : 0)

  const baseFontSize = isFirst || isLast
    ? (wordCount <= 4 ? 118 : wordCount <= 6 ? 102 : 86)
    : (wordCount <= 3 ? 108 : wordCount <= 5 ? 90 : wordCount <= 7 ? 76 : 64)
  const fontSize  = Math.round(baseFontSize * sc)
  const bodySize  = Math.round(36 * sc)
  const badgeSize = Math.round(24 * sc)
  const padH      = Math.round((isLandscape ? 100 : 72) * sc)
  const padBottom = Math.round((isLast ? 180 : isLandscape ? 60 : 140) * sc)
  const gap       = Math.round(22 * sc)

  const bgGrad   = BG_PATTERNS[slideIndex % BG_PATTERNS.length](c1, c2)
  const hasDecoNum = !isFirst && !isLast && slide.graphic?.type === 'stats' && slide.graphic.items[0]?.value

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>

      <div style={{ position: 'absolute', inset: 0, background: '#06080f' }} />

      {clientImageUrl && (
        <Img src={clientImageUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07, filter: 'blur(24px) saturate(1.4)' }} />
      )}

      <div style={{ position: 'absolute', inset: 0, background: bgGrad }} />

      {isFirst && (
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(${hexToRgb(c1)},0.18) 0%, transparent 60%)` }} />
      )}
      {isLast && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: `linear-gradient(to top, rgba(${hexToRgb(c1)},0.12) 0%, transparent 100%)` }} />
      )}

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)', backgroundSize: `${Math.round(80 * sc)}px ${Math.round(80 * sc)}px` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 35%, rgba(6,8,15,0.88) 100%)' }} />

      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: Math.round(2 * sc), background: `linear-gradient(90deg, transparent, ${c1}, ${c2}80, transparent)`, opacity: interpolate(frame, [2, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />

      {/* Slide counter */}
      <div style={{ position: 'absolute', top: Math.round(52 * sc), right: Math.round(56 * sc), opacity: interpolate(frame, [8, 22], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(22 * sc), fontWeight: 600, color: c1, letterSpacing: 2 }}>
        {String(slideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </div>

      {/* Progress dots */}
      <div style={{ position: 'absolute', bottom: Math.round(60 * sc), left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: Math.round(10 * sc), opacity: interpolate(frame, [10, 22], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} style={{ width: i === slideIndex ? Math.round(32 * sc) : Math.round(7 * sc), height: Math.round(7 * sc), borderRadius: 4, background: i === slideIndex ? c1 : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>

      {/* Decorative large number */}
      {hasDecoNum && (
        <div style={{ position: 'absolute', right: Math.round(-20 * sc), bottom: Math.round(160 * sc), fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(380 * sc), fontWeight: 800, color: c1, opacity: 0.04, lineHeight: 1, letterSpacing: -10, pointerEvents: 'none' }}>
          {slide.graphic!.items[0]!.value}
        </div>
      )}

      {/* Main content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: isFirst ? 'center' : isLast ? 'flex-end' : 'center', alignItems: isLandscape ? 'center' : 'flex-start', textAlign: isLandscape ? 'center' : 'left', padding: `${Math.round(100 * sc)}px ${padH}px`, paddingBottom: padBottom, gap }}>

        {/* Nombre del cliente — primer slide */}
        {isFirst && clientName && !showNovaBadge && !tokens.map(t => t.text).join(' ').toLowerCase().includes(clientName.toLowerCase()) && (
          <div style={{ opacity: interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [4, 18], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`, display: 'flex', alignItems: 'center', gap: Math.round(8 * sc), alignSelf: isLandscape ? 'center' : 'flex-start' }}>
            <div style={{ width: Math.round(6 * sc), height: Math.round(6 * sc), borderRadius: '50%', background: c1 }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeSize, color: `rgba(${hexToRgb(c1)},0.9)`, fontWeight: 700, letterSpacing: 1 }}>
              {clientName}
            </span>
          </div>
        )}

        {/* Nova badge */}
        {showNovaBadge && (isFirst || isLast) && (
          <div style={{ background: `rgba(${hexToRgb(c1)},0.12)`, border: `1px solid rgba(${hexToRgb(c1)},0.4)`, borderRadius: 999, padding: `${Math.round(8 * sc)}px ${Math.round(26 * sc)}px`, opacity: interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [4, 18], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`, alignSelf: isLandscape ? 'center' : 'flex-start' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeSize, color: c1, fontWeight: 700, letterSpacing: 3 }}>NOVA AGENCY</span>
          </div>
        )}

        {/* Highlight pill */}
        {slide.highlight && !isFirst && !isLast && (
          <div style={{ background: `rgba(${hexToRgb(c1)},0.1)`, border: `1px solid rgba(${hexToRgb(c1)},0.28)`, borderRadius: Math.round(8 * sc), padding: `${Math.round(6 * sc)}px ${Math.round(18 * sc)}px`, opacity: interpolate(frame, [6, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [6, 18], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`, alignSelf: isLandscape ? 'center' : 'flex-start' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeSize, color: c1, fontWeight: 700 }}>{slide.highlight}</span>
          </div>
        )}

        {/* Title */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: isLandscape ? 'center' : 'flex-start', gap: `${Math.round(5 * sc)}px ${Math.round(12 * sc)}px` }}>
          {tokens.map((token, i) => {
            const delay  = textStartFrame + i * wordDelay
            const spr    = spring({ frame: frame - delay, fps, config: ANIM_CONFIGS[animStyle] })
            const opFrom = animStyle === 'pop' ? 4 : 10
            return (
              <span key={i} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize, fontWeight: 800,
                color: token.accent ? c1 : '#eef4ff',
                lineHeight: 1.05, letterSpacing: -2,
                ...wordTransform(animStyle, spr, sc),
                opacity: interpolate(frame - delay, [0, opFrom], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                textShadow: token.accent ? `0 0 80px rgba(${hexToRgb(c1)},0.6), 0 2px 24px rgba(0,0,0,0.8)` : '0 2px 32px rgba(0,0,0,0.55)',
              }}>
                {token.text}
              </span>
            )
          })}
        </div>

        {/* Separator */}
        {(isFirst || isLast) && (
          <div style={{ width: interpolate(frame, [textStartFrame + wordCount * wordDelay, textStartFrame + wordCount * wordDelay + 26], [0, Math.round(120 * sc)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), height: Math.round(3 * sc), background: `linear-gradient(90deg, ${c1}, ${c2})`, borderRadius: 2, alignSelf: isLandscape ? 'center' : 'flex-start' }} />
        )}

        {/* Body */}
        {slide.body && (
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: bodySize, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: Math.round(900 * sc), margin: 0, fontWeight: 400, opacity: interpolate(frame, [bodyFrame, bodyFrame + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [bodyFrame, bodyFrame + 18], [16 * sc, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` }}>
            {slide.body}
          </p>
        )}

        {/* Graphic */}
        {slide.graphic && (
          <div style={{ width: '100%', opacity: interpolate(frame, [graphicFrame, graphicFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [graphicFrame, graphicFrame + 12], [20 * sc, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` }}>
            {slide.graphic.type === 'stats'     && <StatsPanel     items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} />}
            {slide.graphic.type === 'list'      && <ListPanel      items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} />}
            {slide.graphic.type === 'bars'      && <BarsPanel      items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} />}
            {slide.graphic.type === 'cards'     && <CardsPanel     items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} />}
            {slide.graphic.type === 'phone'     && <PhonePanel     items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} clientName={clientName} />}
            {slide.graphic.type === 'checklist' && <ChecklistPanel items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} />}
            {slide.graphic.type === 'reveal'    && <RevealPanel    items={slide.graphic.items} brandColors={brandColors} startFrame={graphicFrame} sc={sc} />}
          </div>
        )}

        {/* CTA pill */}
        {isLast && slide.highlight && (
          <div style={{ background: `linear-gradient(135deg, rgba(${hexToRgb(c1)},0.22), rgba(${hexToRgb(c2)},0.18))`, border: `1.5px solid rgba(${hexToRgb(c1)},0.6)`, borderRadius: Math.round(16 * sc), padding: `${Math.round(18 * sc)}px ${Math.round(44 * sc)}px`, opacity: interpolate(frame, [ctaFrame, ctaFrame + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [ctaFrame, ctaFrame + 22], [18 * sc, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`, boxShadow: `0 0 50px rgba(${hexToRgb(c1)},0.25)`, alignSelf: isLandscape ? 'center' : 'flex-start' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(40 * sc), color: c1, fontWeight: 700 }}>{slide.highlight}</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

// ── Main composition ──────────────────────────────────────────────────────────
export const AgencyVideo: React.FC<AgencyVideoProps> = ({
  clientName, template, slides, brandColors, format: _format = 'vertical', clientImageUrl, framesPerSlide, totalDurationSeconds,
}) => {
  const colors    = brandColors?.length ? brandColors : ['#ff8c42', '#6366f1']
  const animStyle = getAnimStyle(clientName, template)
  const durations = getSlideDurations(slides, totalDurationSeconds)

  const finalDurations = totalDurationSeconds
    ? durations
    : framesPerSlide
      ? slides.map(() => framesPerSlide)
      : durations

  const starts = finalDurations.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + finalDurations[i - 1])
    return acc
  }, [])

  return (
    <AbsoluteFill style={{ background: '#06080f' }}>
      <style>{GOOGLE_FONTS}</style>
      {slides.map((slide, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={finalDurations[i]}>
          <SlideScene
            slide={slide}
            isFirst={i === 0}
            isLast={i === slides.length - 1}
            brandColors={colors}
            slideIndex={i}
            totalSlides={slides.length}
            template={template}
            clientName={clientName}
            clientImageUrl={clientImageUrl}
            framesPerSlide={finalDurations[i]}
            animStyle={animStyle}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
