import React from 'react'
import {
  AbsoluteFill,
  Audio,
  type CalculateMetadataFunction,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { FRAMES_PER_SLIDE, TRANSITION_FRAMES, GOOGLE_FONTS, FORMAT_DIMENSIONS, type VideoFormat } from './constants'

export interface SlideGraphicItem {
  label: string
  value?: string
  icon?: string
}

export interface SlideGraphic {
  type: 'stats' | 'bars' | 'list'
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
  brandColor1: string
  brandColor2: string
  format?: VideoFormat
  clientImageUrl?: string | null
}

export const DEFAULT_AGENCY_PROPS: AgencyVideoProps = {
  clientName: 'Cliente Demo',
  template: 'resultados',
  brandColor1: '#ff8c42',
  brandColor2: '#6366f1',
  format: 'vertical',
  slides: [
    { title: '*Resultados reales* en 90 días', body: 'Lo que logramos juntos — con datos concretos', highlight: 'NOVA AGENCY' },
    {
      title: '*+150%* de engagement',
      body: 'Más alcance, más interacciones, más conversiones',
      graphic: { type: 'stats', items: [{ label: 'Engagement', value: '+150%', icon: '📈' }, { label: 'Seguidores', value: '+2.400', icon: '👥' }, { label: 'ROI', value: '×3', icon: '💰' }] }
    },
    {
      title: 'Servicios que usamos',
      body: 'Estrategia integral para tu marca',
      graphic: { type: 'list', items: [{ label: 'Contenido diario', icon: '✅' }, { label: 'Ads optimizados', icon: '✅' }, { label: 'Reportes semanales', icon: '✅' }, { label: 'Estrategia de marca', icon: '✅' }] }
    },
    { title: '¿Querés *estos resultados*?', body: 'Escribinos y lo armamos en 24hs', highlight: '¿Arrancamos?' },
  ],
}

export const calculateMetadata: CalculateMetadataFunction<AgencyVideoProps> = ({ props }) => {
  const dims = FORMAT_DIMENSIONS[props.format ?? 'vertical']
  return {
    durationInFrames: props.slides.length * FRAMES_PER_SLIDE,
    fps: 30,
    width: dims.width,
    height: dims.height,
  }
}

const POP_VOL = 0.25 // -12 dB

// ── Animated number counter ─────────────────────────────────────────────────
function parseValueParts(raw: string): { prefix: string; num: number | null; suffix: string; formatted: string } {
  const match = raw.match(/(.*?)([\d.,]+)(.*)/)
  if (!match) return { prefix: '', num: null, suffix: '', formatted: raw }
  const numStr = match[2].replace(',', '.')
  const num = parseFloat(numStr)
  return { prefix: match[1], num, suffix: match[3], formatted: raw }
}

const AnimatedValue: React.FC<{ raw: string; frame: number; delay: number; duration: number; color: string; fontSize: number }> = ({
  raw, frame, delay, duration, color, fontSize,
}) => {
  const { prefix, num, suffix } = parseValueParts(raw)
  if (num === null) return <span style={{ color, fontSize, fontWeight: 800 }}>{raw}</span>
  const animated = interpolate(frame - delay, [0, duration], [0, num], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const display = num % 1 === 0 ? Math.round(animated).toLocaleString('es-AR') : animated.toFixed(1)
  return <span style={{ color, fontSize, fontWeight: 800 }}>{prefix}{display}{suffix}</span>
}

// ── Stats panel (metric cards) ───────────────────────────────────────────────
const StatsPanel: React.FC<{
  items: SlideGraphicItem[]
  brandColor1: string
  brandColor2: string
  startFrame: number
  sc: number
}> = ({ items, brandColor1, brandColor2, startFrame, sc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', gap: Math.round(10 * sc), justifyContent: 'center', flexWrap: 'wrap' }}>
      {items.map((item, i) => {
        const delay = startFrame + i * 7
        const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 130 } })
        const cardOp = interpolate(spr, [0, 1], [0, 1])
        const cardSc = interpolate(spr, [0, 1], [0.6, 1])
        const cardY  = interpolate(spr, [0, 1], [30, 0])
        const accent = i % 2 === 0 ? brandColor1 : brandColor2

        return (
          <div key={i} style={{
            background: `${accent}10`,
            border: `1px solid ${accent}30`,
            borderRadius: Math.round(16 * sc),
            padding: `${Math.round(18 * sc)}px ${Math.round(22 * sc)}px`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(6 * sc),
            opacity: cardOp,
            transform: `scale(${cardSc}) translateY(${cardY}px)`,
            minWidth: Math.round(130 * sc),
            boxShadow: `0 0 ${Math.round(30 * sc)}px ${accent}15`,
          }}>
            {item.icon && <span style={{ fontSize: Math.round(30 * sc) }}>{item.icon}</span>}
            {item.value && (
              <AnimatedValue
                raw={item.value}
                frame={frame}
                delay={delay}
                duration={20}
                color={accent}
                fontSize={Math.round(48 * sc)}
              />
            )}
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: Math.round(18 * sc),
              color: '#4a6080',
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── List panel (feature checklist) ──────────────────────────────────────────
const ListPanel: React.FC<{
  items: SlideGraphicItem[]
  brandColor1: string
  startFrame: number
  sc: number
}> = ({ items, brandColor1, startFrame, sc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(10 * sc) }}>
      {items.map((item, i) => {
        const delay = startFrame + i * 8
        const spr = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 110 } })
        const op = interpolate(spr, [0, 1], [0, 1])
        const x  = interpolate(spr, [0, 1], [-30, 0])

        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: Math.round(14 * sc),
            opacity: op,
            transform: `translateX(${x}px)`,
          }}>
            <span style={{
              fontSize: Math.round(28 * sc),
              width: Math.round(40 * sc),
              textAlign: 'center',
              flexShrink: 0,
            }}>
              {item.icon || '▸'}
            </span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: Math.round(28 * sc),
              color: '#94a3b8',
              fontWeight: 500,
            }}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Bars panel (comparison bars) ─────────────────────────────────────────────
const BarsPanel: React.FC<{
  items: SlideGraphicItem[]
  brandColor1: string
  brandColor2: string
  startFrame: number
  sc: number
}> = ({ items, brandColor1, brandColor2, startFrame, sc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const maxNum = Math.max(...items.map(it => parseValueParts(it.value ?? '0').num ?? 0), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(16 * sc), width: '100%' }}>
      {items.map((item, i) => {
        const delay = startFrame + i * 10
        const { num } = parseValueParts(item.value ?? '0')
        const pct = ((num ?? 0) / maxNum) * 100
        const barW = interpolate(frame - delay, [0, 25], [0, pct], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const op = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const accent = i % 2 === 0 ? brandColor1 : brandColor2

        return (
          <div key={i} style={{ opacity: op }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: Math.round(5 * sc) }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(22 * sc), color: '#94a3b8', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(22 * sc), color: accent, fontWeight: 700 }}>{item.value}</span>
            </div>
            <div style={{ height: Math.round(10 * sc), background: '#0e1a2e', borderRadius: 999 }}>
              <div style={{
                height: '100%', width: `${barW}%`,
                background: `linear-gradient(90deg, ${accent}, ${accent}90)`,
                borderRadius: 999,
                boxShadow: `0 0 ${Math.round(10 * sc)}px ${accent}50`,
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Slide scene ──────────────────────────────────────────────────────────────
const SlideScene: React.FC<{
  slide: Slide
  isFirst: boolean
  isLast: boolean
  brandColor1: string
  brandColor2: string
  slideIndex: number
  totalSlides: number
  clientImageUrl?: string | null
}> = ({ slide, isFirst, isLast, brandColor1, brandColor2, slideIndex, totalSlides, clientImageUrl }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  const sc = Math.min(width, height) / 1080
  const isLandscape = width > height

  const fadeIn  = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(frame, [FRAMES_PER_SLIDE - TRANSITION_FRAMES, FRAMES_PER_SLIDE], [1, 0], { extrapolateLeft: 'clamp' })

  const words = slide.title.split(' ')
  const textStartFrame = isFirst || isLast ? 22 : 14
  const highlightFrame = 8
  const bodyFrame = textStartFrame + words.length * 9
  const graphicFrame = bodyFrame + (slide.body ? 20 : 8)
  const ctaFrame = graphicFrame + (slide.graphic ? (slide.graphic.items.length * 10) : 0)

  const baseFontSize = words.length <= 3 ? 114 : words.length <= 5 ? 96 : words.length <= 7 ? 82 : 68
  const fontSize    = Math.round(baseFontSize * sc)
  const bodySize    = Math.round(36 * sc)
  const badgeSize   = Math.round(26 * sc)
  const padH        = Math.round(72 * sc)
  const padBottom   = Math.round((isLandscape ? 60 : 150) * sc)
  const dotsBottom  = Math.round(80 * sc)
  const gap         = Math.round(24 * sc)

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>

      {/* ── Pop sounds ── */}
      {(isFirst || isLast) && (
        <Sequence from={6} durationInFrames={8}><Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} /></Sequence>
      )}
      {slide.highlight && !isFirst && !isLast && (
        <Sequence from={highlightFrame} durationInFrames={8}><Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} /></Sequence>
      )}
      {words.map((_, i) => (
        <Sequence key={`pop-w-${i}`} from={textStartFrame + i * 9} durationInFrames={8}>
          <Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} />
        </Sequence>
      ))}
      {slide.body && (
        <Sequence from={bodyFrame} durationInFrames={8}><Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} /></Sequence>
      )}
      {slide.graphic && (
        <Sequence from={graphicFrame} durationInFrames={8}><Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} /></Sequence>
      )}
      {isLast && slide.highlight && (
        <Sequence from={ctaFrame} durationInFrames={8}><Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} /></Sequence>
      )}

      {/* ── Backgrounds ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#050c14' }} />

      {/* Client image as subtle background */}
      {clientImageUrl && (
        <Img
          src={clientImageUrl}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: isFirst || isLast ? 0.1 : 0.06,
            filter: 'blur(18px) saturate(1.8)',
          }}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: isFirst || isLast
          ? `radial-gradient(ellipse at 50% 35%, ${brandColor1}28 0%, #050c14 60%)`
          : 'linear-gradient(180deg, #050c14cc 0%, #050c14aa 50%, #050c14cc 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)',
        backgroundSize: `${Math.round(72 * sc)}px ${Math.round(72 * sc)}px`,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,12,20,0.75) 100%)' }} />

      {/* ── Accent glow line (top) ── */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: Math.round(2 * sc),
        background: `linear-gradient(90deg, transparent, ${brandColor1}60, ${brandColor2}60, transparent)`,
        opacity: interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }} />

      {/* ── Progress dots ── */}
      <div style={{
        position: 'absolute', bottom: dotsBottom, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: Math.round(10 * sc),
        opacity: interpolate(frame, [14, 28], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} style={{
            width: i === slideIndex ? Math.round(28 * sc) : Math.round(8 * sc),
            height: Math.round(8 * sc),
            borderRadius: 4,
            background: i === slideIndex ? brandColor1 : '#1e3a5f',
            transition: 'width 0.3s',
          }} />
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        alignItems: isLandscape ? 'center' : 'flex-start',
        textAlign: isLandscape ? 'center' : 'left',
        padding: `0 ${padH}px`,
        paddingBottom: padBottom,
        gap,
      }}>

        {/* Nova badge */}
        {(isFirst || isLast) && (
          <div style={{
            background: `${brandColor1}18`, border: `1px solid ${brandColor1}40`, borderRadius: 999,
            padding: `${Math.round(9 * sc)}px ${Math.round(28 * sc)}px`,
            opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [6, 20], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeSize, color: brandColor1, fontWeight: 700, letterSpacing: 3 }}>
              NOVA AGENCY
            </span>
          </div>
        )}

        {/* Highlight pill */}
        {slide.highlight && !isFirst && !isLast && (
          <div style={{
            background: `${brandColor1}12`, border: `1px solid ${brandColor1}28`, borderRadius: Math.round(10 * sc),
            padding: `${Math.round(7 * sc)}px ${Math.round(20 * sc)}px`,
            opacity: interpolate(frame, [highlightFrame, highlightFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [highlightFrame, highlightFrame + 12], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeSize, color: brandColor1, fontWeight: 700 }}>
              {slide.highlight}
            </span>
          </div>
        )}

        {/* Title words */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: isLandscape ? 'center' : 'flex-start', gap: `${Math.round(8 * sc)}px ${Math.round(14 * sc)}px` }}>
          {words.map((word, i) => {
            const isAccent = word.startsWith('*') && word.endsWith('*')
            const displayWord = isAccent ? word.slice(1, -1) : word
            const delay = textStartFrame + i * 9
            const spr = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 105 } })
            return (
              <span key={i} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize,
                fontWeight: 800,
                color: isAccent ? brandColor1 : '#f0f6ff',
                lineHeight: 1.06,
                letterSpacing: -2,
                transform: `translateY(${interpolate(spr, [0, 1], [46 * sc, 0])}px) scale(${interpolate(spr, [0, 1], [0.88, 1])})`,
                transformOrigin: isLandscape ? 'center bottom' : 'left bottom',
                opacity: interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                textShadow: isAccent ? `0 0 60px ${brandColor1}50, 0 2px 20px rgba(0,0,0,0.6)` : '0 2px 30px rgba(0,0,0,0.5)',
              }}>
                {displayWord}
              </span>
            )
          })}
        </div>

        {/* Body */}
        {slide.body && (
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: bodySize, color: '#6a8099',
            lineHeight: 1.5, maxWidth: Math.round(860 * sc), margin: 0, fontWeight: 400,
            opacity: interpolate(frame, [bodyFrame, bodyFrame + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [bodyFrame, bodyFrame + 16], [16 * sc, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            {slide.body}
          </p>
        )}

        {/* Graphic panel */}
        {slide.graphic && (
          <div style={{
            width: '100%',
            opacity: interpolate(frame, [graphicFrame, graphicFrame + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            {slide.graphic.type === 'stats' && (
              <StatsPanel items={slide.graphic.items} brandColor1={brandColor1} brandColor2={brandColor2} startFrame={graphicFrame} sc={sc} />
            )}
            {slide.graphic.type === 'list' && (
              <ListPanel items={slide.graphic.items} brandColor1={brandColor1} startFrame={graphicFrame} sc={sc} />
            )}
            {slide.graphic.type === 'bars' && (
              <BarsPanel items={slide.graphic.items} brandColor1={brandColor1} brandColor2={brandColor2} startFrame={graphicFrame} sc={sc} />
            )}
          </div>
        )}

        {/* CTA pill (last slide) */}
        {isLast && slide.highlight && (
          <div style={{
            background: `${brandColor1}18`, border: `1px solid ${brandColor1}50`, borderRadius: Math.round(14 * sc),
            padding: `${Math.round(13 * sc)}px ${Math.round(36 * sc)}px`,
            opacity: interpolate(frame, [ctaFrame, ctaFrame + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [ctaFrame, ctaFrame + 18], [14 * sc, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(34 * sc), color: brandColor1, fontWeight: 700 }}>
              {slide.highlight}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

// ── Main composition ─────────────────────────────────────────────────────────
export const AgencyVideo: React.FC<AgencyVideoProps> = ({
  clientName, template, slides, brandColor1, brandColor2, format = 'vertical', clientImageUrl,
}) => {
  return (
    <AbsoluteFill style={{ background: '#050c14' }}>
      <style>{GOOGLE_FONTS}</style>

      {/* Whoosh on every slide transition */}
      {slides.map((_, i) => (
        <Sequence key={`whoosh-${i}`} from={i * FRAMES_PER_SLIDE} durationInFrames={20}>
          <Audio src={staticFile('sounds/whoosh.mp3')} volume={i === 0 ? 0.38 : 0.52} />
        </Sequence>
      ))}

      {/* Slides */}
      {slides.map((slide, i) => (
        <Sequence key={i} from={i * FRAMES_PER_SLIDE} durationInFrames={FRAMES_PER_SLIDE}>
          <SlideScene
            slide={slide}
            isFirst={i === 0}
            isLast={i === slides.length - 1}
            brandColor1={brandColor1}
            brandColor2={brandColor2}
            slideIndex={i}
            totalSlides={slides.length}
            clientImageUrl={clientImageUrl}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
