export const FRAMES_PER_SLIDE = 90 // 3s at 30fps
export const TRANSITION_FRAMES = 12

export const DEFAULT_BRAND_COLOR_1 = '#ff8c42'
export const DEFAULT_BRAND_COLOR_2 = '#f97316'

export const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap');`

export const TEMPLATE_LABELS: Record<string, string> = {
  prospecto: 'Prospecto',
  proyecto: 'Proyecto',
  trayecto: 'Trayecto Nova',
  propuesta: 'Propuesta de precio',
  onboarding: 'Onboarding',
  resultados: 'Resultados',
  servicio: 'Servicio',
}

export type VideoFormat = 'vertical' | 'square' | 'horizontal'

export const FORMAT_DIMENSIONS: Record<VideoFormat, { width: number; height: number }> = {
  vertical:   { width: 1080, height: 1920 },
  square:     { width: 1080, height: 1080 },
  horizontal: { width: 1920, height: 1080 },
}

export const FORMAT_LABELS: Record<VideoFormat, string> = {
  vertical:   'Vertical 9:16 (Reels/TikTok)',
  square:     'Cuadrado 1:1 (Feed)',
  horizontal: 'Horizontal 16:9 (YouTube)',
}
