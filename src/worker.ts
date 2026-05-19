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
  const extraInfo = (job.props as Record<string, unknown>)?.extra_info as string || ''
  const instructions = (job.props as Record<string, unknown>)?.based_on_job
    ? `INSTRUCCIONES DE EDICIÓN: ${extraInfo}. Tomá como base estos slides anteriores y modificalos: ${JSON.stringify((job.props as Record<string, unknown>)?.previous_slides)}`
    : extraInfo

  const systemPrompt = `Sos un experto en marketing digital. Generás scripts de videos cortos y poderosos para Instagram/TikTok (4-6 slides, video vertical 1080x1920).

Cada slide tiene:
- title: texto impactante (máx 8 palabras). Usá *asteriscos* para resaltar 1-2 palabras clave con el color de la marca.
- body: texto secundario opcional (máx 18 palabras, dato o explicación concisa)
- highlight: texto corto opcional para badge (ej: "3X ROI", "RESULTADOS", "@novaagency")

Reglas:
- Primer slide: hook poderoso que engancha en 2 segundos
- Último slide: CTA claro ("¿Arrancamos?", "Escribinos hoy", etc.)
- Español rioplatense (vos, no tú)
- Máx 6 slides, mín 4
- Respondé SOLO con JSON válido, sin markdown: { "slides": [...] }`

  const userMessage = `Agencia: Nova Agency
Cliente: ${client.name}
Descripción del cliente: ${client.description || client.business_type || 'No especificada'}
${project ? `Proyecto: ${(project as Record<string, unknown>).name} (${(project as Record<string, unknown>).status}) — ${(project as Record<string, unknown>).description || ''}` : ''}
Tipo de video: ${job.template} — ${TEMPLATE_PROMPTS[job.template as string] || ''}
${instructions ? `Info extra / instrucciones: ${instructions}` : ''}`

  const response = await anthropic.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userMessage }],
  })

  const text = (response.content.find(b => b.type === 'text') as { type: 'text'; text: string } | undefined)?.text || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude no devolvió JSON válido. Respuesta: ${text.substring(0, 200)}`)

  const parsed = JSON.parse(jsonMatch[0])
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

    const brandColor1 = client.has_brand_colors && client.brand_color1 ? client.brand_color1 : '#ff8c42'
    const brandColor2 = client.has_brand_colors && client.brand_color2 ? client.brand_color2 : '#f97316'

    const inputProps = { clientName: client.name, template: job.template, slides, brandColor1, brandColor2, format: (job.format as string) || 'vertical' }

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
