import React from 'react'
import {
  AbsoluteFill,
  Audio,
  type CalculateMetadataFunction,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { FRAMES_PER_SLIDE, TRANSITION_FRAMES, GOOGLE_FONTS, FORMAT_DIMENSIONS, type VideoFormat } from './constants'

export interface Slide {
  title: string
  body?: string
  highlight?: string
}

export interface AgencyVideoProps {
  clientName: string
  template: string
  slides: Slide[]
  brandColor1: string
  brandColor2: string
  format?: VideoFormat
}

export const DEFAULT_AGENCY_PROPS: AgencyVideoProps = {
  clientName: 'Cliente Demo',
  template: 'prospecto',
  brandColor1: '#ff8c42',
  brandColor2: '#f97316',
  format: 'vertical',
  slides: [
    { title: '*Nova Agency* arranca con vos', body: 'Agencia de marketing digital de alto impacto', highlight: 'NOVA AGENCY' },
    { title: '¿Tu marca *no está creciendo*?', body: 'El 80% de las marcas pierden ventas por no tener una presencia sólida' },
    { title: 'Nosotros lo *solucionamos*', body: 'Contenido, estrategia y resultados reales — sin excusas', highlight: 'RESULTADOS' },
    { title: '¿Arrancamos *hoy*?', body: 'Escribinos y te armamos un plan en 24hs', highlight: '@novaagency' },
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

// -12 dB in linear scale
const POP_VOL = 0.25

const SlideScene: React.FC<{
  slide: Slide
  isFirst: boolean
  isLast: boolean
  brandColor1: string
  brandColor2: string
  slideIndex: number
  totalSlides: number
}> = ({ slide, isFirst, isLast, brandColor1, brandColor2, slideIndex, totalSlides }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  // Scale everything relative to the smaller canvas dimension
  const scale = Math.min(width, height) / 1080
  const isLandscape = width > height

  const fadeIn  = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(frame, [FRAMES_PER_SLIDE - TRANSITION_FRAMES, FRAMES_PER_SLIDE], [1, 0], { extrapolateLeft: 'clamp' })
  const opacity = fadeIn * fadeOut

  const words = slide.title.split(' ')
  const textStartFrame = isFirst || isLast ? 22 : 14

  // Adaptive font size
  const baseFontSize = words.length <= 3 ? 114 : words.length <= 5 ? 96 : words.length <= 7 ? 82 : 68
  const fontSize = Math.round(baseFontSize * scale)
  const bodyFontSize = Math.round(38 * scale)
  const badgeFontSize = Math.round(28 * scale)
  const padH = Math.round(80 * scale)
  const padBottom = Math.round((isLandscape ? 80 : 160) * scale)
  const dotsBottom = Math.round(90 * scale)
  const contentGap = Math.round(30 * scale)

  // Frames when each element appears
  const highlightFrame = 8
  const bodyFrame = textStartFrame + words.length * 9
  const ctaFrame = bodyFrame + 20

  return (
    <AbsoluteFill style={{ opacity }}>

      {/* ── Pop sounds per text element ── */}

      {/* Badge / Nova label */}
      {(isFirst || isLast) && (
        <Sequence from={6} durationInFrames={8}>
          <Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} />
        </Sequence>
      )}

      {/* Highlight pill */}
      {slide.highlight && !isFirst && !isLast && (
        <Sequence from={highlightFrame} durationInFrames={8}>
          <Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} />
        </Sequence>
      )}

      {/* Pop per word in title */}
      {words.map((_, i) => (
        <Sequence key={`pop-w-${i}`} from={textStartFrame + i * 9} durationInFrames={8}>
          <Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} />
        </Sequence>
      ))}

      {/* Body text */}
      {slide.body && (
        <Sequence from={bodyFrame} durationInFrames={8}>
          <Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} />
        </Sequence>
      )}

      {/* CTA pill (last slide) */}
      {isLast && slide.highlight && (
        <Sequence from={ctaFrame} durationInFrames={8}>
          <Audio src={staticFile('sounds/pop.mp3')} volume={POP_VOL} />
        </Sequence>
      )}

      {/* ── Background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isFirst || isLast
          ? `radial-gradient(ellipse at 50% 38%, ${brandColor1}22 0%, #050c14 65%)`
          : '#050c14',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)',
        backgroundSize: `${Math.round(72 * scale)}px ${Math.round(72 * scale)}px`,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(5,12,20,0.7) 100%)',
      }} />

      {/* ── Progress dots ── */}
      <div style={{
        position: 'absolute', bottom: dotsBottom, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: Math.round(10 * scale),
        opacity: interpolate(frame, [14, 28], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} style={{
            width: i === slideIndex ? Math.round(28 * scale) : Math.round(8 * scale),
            height: Math.round(8 * scale),
            borderRadius: 4,
            background: i === slideIndex ? brandColor1 : '#1e3a5f',
          }} />
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: isLandscape ? 'center' : 'center',
        alignItems: isLandscape ? 'center' : 'flex-start',
        textAlign: isLandscape ? 'center' : 'left',
        padding: `0 ${padH}px`,
        paddingBottom: padBottom,
        gap: contentGap,
      }}>

        {/* Nova badge */}
        {(isFirst || isLast) && (
          <div style={{
            background: `${brandColor1}20`,
            border: `1px solid ${brandColor1}48`,
            borderRadius: 100,
            padding: `${Math.round(10 * scale)}px ${Math.round(30 * scale)}px`,
            opacity: interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [6, 22], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeFontSize, color: brandColor1, fontWeight: 700, letterSpacing: 3 }}>
              NOVA AGENCY
            </span>
          </div>
        )}

        {/* Highlight pill */}
        {slide.highlight && !isFirst && !isLast && (
          <div style={{
            background: `${brandColor1}14`,
            border: `1px solid ${brandColor1}32`,
            borderRadius: 10,
            padding: `${Math.round(8 * scale)}px ${Math.round(22 * scale)}px`,
            opacity: interpolate(frame, [highlightFrame, highlightFrame + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [highlightFrame, highlightFrame + 14], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: badgeFontSize, color: brandColor1, fontWeight: 700, letterSpacing: 1 }}>
              {slide.highlight}
            </span>
          </div>
        )}

        {/* Title words */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: isLandscape ? 'center' : 'flex-start', gap: `${Math.round(8 * scale)}px ${Math.round(16 * scale)}px` }}>
          {words.map((word, i) => {
            const isAccent = word.startsWith('*') && word.endsWith('*')
            const displayWord = isAccent ? word.slice(1, -1) : word
            const delay = textStartFrame + i * 9
            const spr = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 100 } })
            const wordY  = interpolate(spr, [0, 1], [48 * scale, 0])
            const wordSc = interpolate(spr, [0, 1], [0.88, 1])
            const wordOp = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

            return (
              <span key={i} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize,
                fontWeight: 800,
                color: isAccent ? brandColor1 : '#f0f6ff',
                lineHeight: 1.06,
                letterSpacing: -3,
                transform: `translateY(${wordY}px) scale(${wordSc})`,
                transformOrigin: isLandscape ? 'center bottom' : 'left bottom',
                opacity: wordOp,
                textShadow: isAccent
                  ? `0 0 80px ${brandColor1}55, 0 2px 30px rgba(0,0,0,0.6)`
                  : '0 2px 40px rgba(0,0,0,0.5)',
              }}>
                {displayWord}
              </span>
            )
          })}
        </div>

        {/* Body text */}
        {slide.body && (
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: bodyFontSize,
            color: '#6a8099',
            lineHeight: 1.55,
            maxWidth: Math.round(880 * scale),
            margin: 0,
            fontWeight: 400,
            opacity: interpolate(frame, [bodyFrame, bodyFrame + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [bodyFrame, bodyFrame + 18], [18 * scale, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            {slide.body}
          </p>
        )}

        {/* CTA pill (last slide) */}
        {isLast && slide.highlight && (
          <div style={{
            background: `${brandColor1}20`,
            border: `1px solid ${brandColor1}55`,
            borderRadius: Math.round(14 * scale),
            padding: `${Math.round(14 * scale)}px ${Math.round(38 * scale)}px`,
            opacity: interpolate(frame, [ctaFrame, ctaFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [ctaFrame, ctaFrame + 20], [16 * scale, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: Math.round(36 * scale), color: brandColor1, fontWeight: 700 }}>
              {slide.highlight}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

export const AgencyVideo: React.FC<AgencyVideoProps> = ({
  clientName, template, slides, brandColor1, brandColor2, format = 'vertical',
}) => {
  return (
    <AbsoluteFill style={{ background: '#050c14' }}>
      <style>{GOOGLE_FONTS}</style>

      {/* Whoosh on every slide transition */}
      {slides.map((_, i) => (
        <Sequence key={`whoosh-${i}`} from={i * FRAMES_PER_SLIDE} durationInFrames={20}>
          <Audio src={staticFile('sounds/whoosh.mp3')} volume={i === 0 ? 0.4 : 0.55} />
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
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
