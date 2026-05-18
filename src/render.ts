import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

const compositionId = process.argv[2] || "HelloWorld";
const outputFile = process.argv[3] || `out/${compositionId}.mp4`;

async function main() {
  console.log(`\n🎬 Empaquetando composición "${compositionId}"...`);

  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/Root.tsx"),
    webpackOverride: (config) => config,
  });

  console.log("📦 Bundle listo. Obteniendo composición...");

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
  });

  console.log(`🎥 Renderizando: ${composition.width}x${composition.height} @ ${composition.fps}fps — ${composition.durationInFrames} frames`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputFile,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r⏳ Progreso: ${Math.round(progress * 100)}%`);
    },
  });

  console.log(`\n✅ Video guardado en: ${outputFile}\n`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
