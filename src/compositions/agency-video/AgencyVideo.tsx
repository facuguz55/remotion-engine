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
  const { fps } = useVideoConfig()

  const fadeIn  = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(frame, [FRAMES_PER_SLIDE - TRANSITION_FRAMES, FRAMES_PER_SLIDE], [1, 0], { extrapolateLeft: 'clamp' })
  const opacity = fadeIn * fadeOut

  const words = slide.title.split(' ')

  // Frame at which the first title word starts animating
  const textStartFrame = isFirst || isLast ? 22 : 14

  const barOpacity = interpolate(frame, [10, 26], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Pop sound when text appears */}
      <Sequence from={textStartFrame} durationInFrames={10}>
        <Audio src={staticFile('sounds/pop.mp3')} volume={0.55} />
      </Sequence>

      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isFirst || isLast
          ? `radial-gradient(ellipse at 50% 38%, ${brandColor1}22 0%, #050c14 65%)`
          : '#050c14',
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(5,12,20,0.7) 100%)',
      }} />

      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4,
        background: `linear-gradient(180deg, transparent, ${brandColor1}, ${brandColor2}, transparent)`,
        opacity: barOpacity,
      }} />

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 90, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 10,
        opacity: interpolate(frame, [14, 28], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} style={{
            width: i === slideIndex ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background: i === slideIndex ? brandColor1 : '#1e3a5f',
          }} />
        ))}
      </div>

      {/* Content area */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: '0 80px',
        paddingBottom: 160,
        gap: 30,
      }}>
        {/* Nova Agency badge (intro / outro) */}
        {(isFirst || isLast) && (
          <div style={{
            background: `${brandColor1}20`,
            border: `1px solid ${brandColor1}48`,
            borderRadius: 100,
            padding: '10px 30px',
            opacity: interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [6, 22], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: brandColor1, fontWeight: 700, letterSpacing: 3 }}>
              NOVA AGENCY
            </span>
          </div>
        )}

        {/* Highlight pill (content slides only) */}
        {slide.highlight && !isFirst && !isLast && (
          <div style={{
            background: `${brandColor1}14`,
            border: `1px solid ${brandColor1}32`,
            borderRadius: 10,
            padding: '8px 22px',
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [8, 22], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, color: brandColor1, fontWeight: 700, letterSpacing: 1 }}>
              {slide.highlight}
            </span>
          </div>
        )}

        {/* Title words */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px 16px' }}>
          {words.map((word, i) => {
            const isAccent = word.startsWith('*') && word.endsWith('*')
            const displayWord = isAccent ? word.slice(1, -1) : word
            const delay = textStartFrame + i * 9
            const spr = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 100 } })
            const wordY  = interpolate(spr, [0, 1], [48, 0])
            const wordSc = interpolate(spr, [0, 1], [0.88, 1])
            const wordOp = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            const fontSize = words.length <= 3 ? 114 : words.length <= 5 ? 96 : words.length <= 7 ? 82 : 68

            return (
              <span key={i} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize,
                fontWeight: 800,
                color: isAccent ? brandColor1 : '#f0f6ff',
                lineHeight: 1.06,
                letterSpacing: -3,
                transform: `translateY(${wordY}px) scale(${wordSc})`,
                transformOrigin: 'left bottom',
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
            fontSize: 38,
            color: '#6a8099',
            lineHeight: 1.55,
            maxWidth: 880,
            margin: 0,
            fontWeight: 400,
            opacity: interpolate(frame, [textStartFrame + words.length * 9, textStartFrame + words.length * 9 + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [textStartFrame + words.length * 9, textStartFrame + words.length * 9 + 18], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            {slide.body}
          </p>
        )}

        {/* Outro CTA pill */}
        {isLast && slide.highlight && (
          <div style={{
            background: `${brandColor1}20`,
            border: `1px solid ${brandColor1}55`,
            borderRadius: 14,
            padding: '14px 38px',
            opacity: interpolate(frame, [textStartFrame + words.length * 9 + 18, textStartFrame + words.length * 9 + 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [textStartFrame + words.length * 9 + 18, textStartFrame + words.length * 9 + 38], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, color: brandColor1, fontWeight: 700 }}>
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

      {/* Whoosh on every slide transition (including the first) */}
      {slides.map((_, i) => (
        <Sequence key={`whoosh-${i}`} from={i * FRAMES_PER_SLIDE} durationInFrames={20}>
          <Audio src={staticFile('sounds/whoosh.mp3')} volume={i === 0 ? 0.4 : 0.55} />
        </Sequence>
      ))}

      {/* Slide sequences */}
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
