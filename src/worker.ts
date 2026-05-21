import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

let bundleCache: string | null = null

const TEMPLATE_PROMPTS: Record<string, string> = {
  prospecto:  'Presentá Nova Agency a un potencial cliente nuevo. Mostrá credibilidad, resultados y por qué somos la mejor opción. Hook poderoso en el primer slide.',
  proyecto:   'Hacé un video resumen del proyecto del cliente. Mostrá el progreso, logros concretos y próximos pasos.',
  trayecto:   'Contá la historia y evolución de Nova Agency. Nuestro recorrido, valores y visión de futuro.',
  propuesta:  'Presentá la propuesta de precio y servicios al cliente. Sé claro y directo sobre el valor que recibe.',
  onboarding: 'Dale la bienvenida al nuevo cliente. Explicá cómo trabajamos, qué puede esperar y cuáles son los próximos pasos.',
  resultados: 'Mostrá los resultados y métricas concretas obtenidas para el cliente. Números, logros y proyección.',
  servicio:   'Explicá un servicio específico de Nova Agency en detalle. Qué es, cómo funciona y qué beneficios trae.',
}

async function generateSlides(job: Record<string, unknown>, client: Record<string, unknown>, project: Record<string, unknown> | null): Promise<unknown[]> {
  const extraInfo     = (job.props as Record<string, unknown>)?.extra_info as string || ''
  const technicality  = (job.props as Record<string, unknown>)?.technicality as string || 'con'
  const instructions  = (job.props as Record<string, unknown>)?.based_on_job
    ? `INSTRUCCIONES DE EDICIÓN: ${extraInfo}. Tomá como base estos slides anteriores y modificalos: ${JSON.stringify((job.props as Record<string, unknown>)?.previous_slides)}`
    : extraInfo

  // El template "sesion" tiene un prompt completamente distinto — es un resumen profesional, no un video de redes
  const isSesion = job.template === 'sesion'

  const systemPrompt = isSesion
    ? `Sos un asistente de comunicación profesional. Generás resúmenes visuales de reuniones de trabajo para compartir con clientes.

Este resumen se le manda al cliente como actualización — NO es un video de redes sociales. El tono es profesional, claro y directo.

Cada slide tiene estos campos:
- title: título descriptivo y claro (máx 8 palabras). Podés usar *asteriscos* en 1-2 palabras clave.
- body: detalle opcional (máx 20 palabras, información concreta)
- graphic: objeto visual recomendado para listar lo que se hizo (NO en el primer ni último slide)
  Estructura: { "type": "...", "items": [...] }
  Tipos disponibles para sesión:
  - "checklist": tareas completadas con checkmark animado. items: { label, description?: string, icon?: emoji }
    USAR cuando: se completaron tareas, se aprobaron cambios, se terminaron implementaciones
  - "list": lista simple con borde de color. items: { label, icon?: emoji }
    USAR cuando: hay varios temas trabajados sin checkmark implícito
  - "stats": métricas con contador animado. items: { label, value: "+X%" o número, icon?: emoji }
    USAR cuando: hay números, cifras, métricas concretas
  - "cards": grid de tarjetas. items: { label, icon?, description? }
    USAR cuando: hay múltiples temas/áreas trabajadas con descripción

REGLAS CRÍTICAS:
- Basate en lo que el usuario te da. Podés agregar contexto o detalle razonable. No inventes cosas que contradigan lo que dijo.
- Agrupá tareas o decisiones relacionadas en el mismo slide — no hagas un slide por cada cosita mínima.
- PRIORIDAD GRÁFICOS: cada slide del medio debe tener graphic. Si se completaron tareas → checklist. Si hay datos → stats. Si hay múltiples áreas → cards. Si es una lista simple → list.
- Primer slide: título claro de la sesión (qué se trabajó). Sin hook de redes sociales, sin frases exageradas.
- Slides del medio: organizá lo que se hizo agrupando temas relacionados. Priorizá checklist y cards sobre list.
- Último slide: próximos pasos. Si el usuario no los mencionó, escribí algo razonable basado en el contexto.
- NUNCA uses: lenguaje de ventas, ganchos, frases exageradas, "¿arrancamos?", "escribinos", "activamos el siguiente nivel", ni nada que suene a publicidad.
- Español rioplatense (vos, no tú), tono profesional pero cercano.
- Mín 3, máx 5 slides.
- Respondé SOLO con JSON válido, sin markdown: { "slides": [...] }
- NUNCA uses saltos de línea reales dentro de strings JSON.`
    : `Sos un experto en marketing digital y copywriting. Generás scripts de videos cortos para redes sociales.

Cada slide tiene estos campos:
- title: texto impactante (máx 8 palabras). Usá *asteriscos* para resaltar 1-2 palabras clave importantes.
- body: texto secundario opcional (máx 20 palabras, dato concreto o explicación clara)
- highlight: badge corto opcional (3-4 palabras máx, ej: "3X más ventas", "Resultados reales", "¿Lo hacemos?")
- graphic: objeto visual OBLIGATORIO en la mayoría de slides del medio (NO en el primero ni el último)
  Estructura: { "type": "...", "items": [...] }
  Cada item: { "label": "texto", "value": "dato o 'sent'", "icon": "emoji", "description": "texto corto" }

  ═══ TIPOS DISPONIBLES ═══

  "stats" — métricas con contador animado. Máx 3 items.
    Cuándo usarlo: hay números, porcentajes, cifras de crecimiento
    items: { label, value: "+150%" o "×3" o "2.400", icon }
    Ejemplo: ventas +150%, seguidores +2400, ROI ×3

  "bars" — barras de comparación animadas. Máx 4 items.
    Cuándo usarlo: hay antes/después, comparación entre períodos o categorías
    items: { label, value: "número sin símbolo", icon }

  "cards" — grid de tarjetas con ícono + título + descripción. Máx 4 items.
    Cuándo usarlo: hay múltiples servicios, features, automatizaciones o beneficios
    items: { label: "nombre del servicio", icon: "emoji", description: "qué hace en 5 palabras" }
    Ejemplo: { label: "Recupero de carrito", icon: "🛒", description: "Mensajes automáticos al que no compró" }

  "phone" — simulación de chat/WhatsApp animado. Máx 5 mensajes.
    Cuándo usarlo: hay un bot, respuestas automáticas, WhatsApp, atención al cliente, flujo de ventas
    items: { label: "texto del mensaje", value: "sent" (si lo escribe el cliente) o sin value (si lo escribe el bot), icon: opcional }
    Ejemplo: [{ label: "¿Tienen en talle M?", value: "sent" }, { label: "¡Sí! Talle M disponible 🧥 ¿Te reservo uno?" }]

  "checklist" — lista con checkmarks animados. Máx 4 items.
    Cuándo usarlo: hay tareas completadas, servicios incluidos, pasos terminados, logros concretos
    items: { label: "qué se hizo", icon: opcional, description: "detalle opcional" }

  "reveal" — aparición dramática de ítems grandes uno por uno. Máx 4 items.
    Cuándo usarlo: hay nombres de clientes/marcas, hitos importantes, frases de impacto, logros que quieren destacar
    items: { label: "TEXTO GRANDE", icon: opcional, description: "detalle pequeño opcional" }
    Ejemplo: listar clientes, mostrar años de experiencia, mostrar ciudades donde operan

  "list" — lista simple con borde de color. Máx 4 items.
    Cuándo usarlo: cuando ningún otro tipo encaja mejor (es el tipo más básico, preferí los otros)
    items: { label, icon }

REGLAS CRÍTICAS:
- NUNCA uses palabras genéricas como: "implementado", "logrado", "resultado", "conversión", "potencial", "sinergias", "estrategia integral"
- SIEMPRE escribí con palabras concretas y específicas del negocio del cliente
- Agrupá temas relacionados en el mismo slide — si dos ideas se conectan, van juntas
- Podés agregar contexto creativo relevante para enriquecer los slides, siempre dentro del rubro del cliente
- PRIORIDAD GRÁFICOS MÁXIMA: TODOS los slides del medio deben tener graphic. Sin excepción. El único slide sin graphic es el primero y el último.
- VARIÁ los tipos: nunca uses el mismo tipo dos veces seguidas. Si el video tiene 5 slides del medio, intentá usar al menos 3 tipos distintos.
- Criterio de elección: ¿hay números? → stats. ¿hay un bot/chat? → phone. ¿hay servicios/features? → cards. ¿hay tareas o pasos completados? → checklist. ¿hay nombres de marcas o impacto visual? → reveal. ¿hay antes/después? → bars.
- Primer slide: hook que genere curiosidad o duela al lector, sin graphic, sin badge de agencia
- Último slide: CTA específico para el cliente (no genérico), sin graphic
- Español rioplatense (vos, no tú), tono directo y natural
- Mín 4, máx 6 slides
- El video es PARA el cliente o SOBRE el cliente — no promoción de Nova Agency (salvo que el template lo pida)
- Respondé SOLO con JSON válido, sin markdown: { "slides": [...] }
- NUNCA uses saltos de línea reales dentro de strings JSON. Si necesitás salto, usá el espacio normal.
- Todos los strings deben estar en una sola línea, sin caracteres de control.
${technicality === 'sin' ? `
LENGUAJE SIMPLE — SIN TECNICISMO: Escribí como si le explicaras a alguien que no sabe nada de marketing ni de tecnología web.
PALABRAS PROHIBIDAS (no uses ninguna, aunque el usuario las mencione):
- Marketing: CTR, funnel, KPI, ROI, engagement, algoritmo, copy, tráfico, lead, landing page, CTA, pauta, orgánico, pixel, retargeting, A/B test, split test, impresiones, clics, bounce rate, conversión, remarketing, segmentación
- Web/tecnología: home, header, footer, navbar, navegación principal, banner, pop up, popup, toast, widget, plugin, checkout, carrito de compras, scroll, UI, UX, responsive, viewport, snippet, embed
- Ventas: hot sale, liquidación técnica, pipeline, upsell, cross-sell, onboarding

CÓMO REEMPLAZARLOS:
- home / página principal → "tu sitio web" o "cuando entran a tu página"
- pop up / toast / banner → "el aviso que aparece", "el mensaje que sale"
- checkout → "cuando van a pagar"
- hot sale → "oferta especial", "descuento"
- engagement / alcance → "la gente que ve tus posts", "cuántos interactúan"
- tráfico → "las personas que entran a tu sitio"
- conversión → "cuántos terminan comprando"
- CTR / ROI → "qué tan bien funciona el anuncio", "lo que ganás vs lo que gastás"
- carrito → "los productos que eligen antes de pagar"
Si el usuario usó un término técnico en sus instrucciones, reemplazalo por la versión simple en el slide.` : ''}`

  const userMessage = isSesion
    ? `Cliente: ${client.name}
${project ? `Proyecto: "${(project as Record<string, unknown>).name}"` : ''}
Contenido de la sesión (organizá esto en slides):
${instructions || extraInfo || 'No se proporcionó contenido. Creá un slide de cierre genérico.'}

RECORDÁ: usá SOLO lo que está acá arriba. No inventes nada extra.`
    : `Cliente: ${client.name}
Industria/rubro: ${(client as Record<string, unknown>).industry || (client as Record<string, unknown>).business_type || 'No especificado'}
Descripción: ${(client as Record<string, unknown>).description || (client as Record<string, unknown>).notes || 'No especificada'}
${project ? `Proyecto vinculado: "${(project as Record<string, unknown>).name}" — estado: ${(project as Record<string, unknown>).status}${(project as Record<string, unknown>).description ? ` — ${(project as Record<string, unknown>).description}` : ''}` : ''}
Tipo de video: ${job.template} — ${TEMPLATE_PROMPTS[job.template as string] || ''}
${instructions ? `Instrucciones específicas: ${instructions}` : ''}

IMPORTANTE: Este video es para/sobre ${client.name}. Usá su nombre, su rubro y su contexto real. No uses frases genéricas de agencia.`

  const response = await anthropic.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userMessage }],
  })

  const text = (response.content.find(b => b.type === 'text') as { type: 'text'; text: string } | undefined)?.text || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude no devolvió JSON válido. Respuesta: ${text.substring(0, 200)}`)

  // Limpiar caracteres de control dentro de strings JSON (saltos de línea sin escapar, tabs, etc.)
  const cleaned = jsonMatch[0].replace(
    /"((?:[^"\\]|\\.)*)"/g,
    (_match, inner: string) => `"${inner.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim()}"`
  )

  let parsed: { slides?: unknown }
  try {
    parsed = JSON.parse(cleaned)
  } catch (e) {
    throw new Error(`JSON inválido incluso después de limpiar. Error: ${e}. Raw: ${cleaned.substring(0, 300)}`)
  }
  if (!Array.isArray(parsed.slides)) throw new Error('El JSON no tiene un campo "slides" válido')
  return parsed.slides
}

async function processJob(job: Record<string, unknown>) {
  console.log(`\n🎬 Job ${job.id} — template: ${job.template}`)

  await supabase.from('video_jobs').update({ status: 'rendering', progress: 5 }).eq('id', job.id)

  try {
    const { data: client } = await supabase.from('clients').select('*').eq('id', job.client_id).single()
    if (!client) throw new Error('Cliente no encontrado')

    let project = null
    if (job.project_id) {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', job.project_id).single()
      project = proj
    }

    console.log('🤖 Generando slides con Claude...')
    await supabase.from('video_jobs').update({ progress: 15 }).eq('id', job.id)

    const slides = await generateSlides(job, client, project)
    console.log(`✅ ${slides.length} slides generados`)

    // Check cancellation before expensive render
    const { data: statusCheck } = await supabase.from('video_jobs').select('status').eq('id', job.id).single()
    if (statusCheck?.status === 'cancelled') {
      console.log(`⏹️  Job ${job.id} cancelado antes de renderizar`)
      return
    }

    const jobBrandColors = (job.props as Record<string, unknown>)?.brand_colors as string[] | null
    const clientColors = client.has_brand_colors
      ? [client.brand_color1, client.brand_color2].filter(Boolean) as string[]
      : []
    const brandColors = jobBrandColors?.length ? jobBrandColors : clientColors.length ? clientColors : ['#ff8c42', '#6366f1']

    // Leer con Number() para asegurar que sea un número (Supabase JSONB puede devolver string en algunos contextos)
    const rawFPS  = (job.props as Record<string, unknown>)?.frames_per_slide
    const rawTDS  = (job.props as Record<string, unknown>)?.total_duration_seconds
    const framesPerSlide       = rawFPS  ? Number(rawFPS)  : null
    const totalDurationSeconds = rawTDS  ? Number(rawTDS)  : null
    console.log(`⚙️  Props recibidos — frames_per_slide: ${framesPerSlide} (raw: ${rawFPS}), total_duration_seconds: ${totalDurationSeconds} (raw: ${rawTDS}), format: ${(job.props as Record<string, unknown>)?.format}`)
    console.log(`⚙️  Job props completos: ${JSON.stringify(job.props)}`)

    const inputProps = {
      clientName: client.name,
      template: job.template,
      slides,
      brandColors,
      format: ((job.props as Record<string, unknown>)?.format as string) || 'vertical',
      clientImageUrl: (client.photo_url as string) || null,
      ...(totalDurationSeconds ? { totalDurationSeconds } : framesPerSlide ? { framesPerSlide } : {}),
    }
    console.log(`⚙️  inputProps.totalDurationSeconds: ${(inputProps as Record<string, unknown>).totalDurationSeconds ?? 'NO SETEADO'}, framesPerSlide: ${(inputProps as Record<string, unknown>).framesPerSlide ?? 'NO SETEADO'}`)

    await supabase.from('video_jobs').update({
      props: { ...(job.props as Record<string, unknown>), generated_slides: slides, input_props: inputProps },
      progress: 25,
    }).eq('id', job.id)

    // Bundle (cached across jobs)
    if (!bundleCache) {
      console.log('📦 Empaquetando Remotion...')
      bundleCache = await bundle({ entryPoint: path.resolve('./src/Root.tsx'), webpackOverride: c => c })
      console.log('✅ Bundle listo')
    }

    await supabase.from('video_jobs').update({ progress: 40 }).eq('id', job.id)

    const composition = await selectComposition({ serveUrl: bundleCache, id: 'AgencyVideo', inputProps })

    const outDir = path.resolve('./out/jobs')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    const outFile = path.join(outDir, `${job.id}.mp4`)

    console.log(`🎥 Renderizando ${composition.durationInFrames} frames (${composition.durationInFrames / 30}s)...`)
    let lastReportedPct = 0
    await renderMedia({
      composition,
      serveUrl: bundleCache,
      codec:          'h264',
      outputLocation: outFile,
      inputProps,
      onProgress: async ({ progress }) => {
        process.stdout.write(`\r⏳ ${Math.round(progress * 100)}%   `)
        const pct = 40 + Math.round(progress * 45)
        if (pct - lastReportedPct >= 10) {
          lastReportedPct = pct
          await supabase.from('video_jobs').update({ progress: pct }).eq('id', job.id)
        }
      },
    })
    console.log('\n✅ Render completo')

    await supabase.from('video_jobs').update({ progress: 88 }).eq('id', job.id)
    console.log('☁️  Subiendo a Supabase Storage...')

    const fileBuffer = fs.readFileSync(outFile)
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(`${job.id}.mp4`, fileBuffer, { contentType: 'video/mp4', upsert: true })

    if (uploadError) throw new Error(`Upload: ${uploadError.message}`)

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(`${job.id}.mp4`)

    await supabase.from('video_jobs').update({
      status:       'done',
      progress:     100,
      output_url:   urlData.publicUrl,
      completed_at: new Date().toISOString(),
    }).eq('id', job.id)

    console.log(`✅ Listo: ${urlData.publicUrl}`)
    fs.unlinkSync(outFile)

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`❌ Error en job ${job.id}:`, msg)
    await supabase.from('video_jobs').update({ status: 'error', error: msg }).eq('id', job.id)
  }
}

let busy = false

async function poll() {
  if (busy) return
  const { data: jobs } = await supabase
    .from('video_jobs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1)

  if (jobs && jobs.length > 0) {
    busy = true
    await processJob(jobs[0] as Record<string, unknown>)
    busy = false
  }
}

async function main() {
  console.log('🚀 Nova Agency Video Worker')
  console.log(`📡 Supabase: ${process.env.SUPABASE_URL?.substring(0, 35)}...`)
  console.log('⏱️  Polling cada 5s...\n')
  setInterval(poll, 5000)
  poll()
}

main().catch(console.error)
