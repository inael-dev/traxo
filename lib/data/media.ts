// Exercise IDs that have MP4 videos uploaded to R2
const R2_VIDEO_IDS = new Set([
  "a-costas-1",   // Puxador Frente Pronado
  "a-costas-4",   // Extensão de Ombro
  "a-biceps-3",   // Rosca Inversa
  "b-peitoral-1", // Supino Inclinado 45°
  "b-peitoral-2", // Crucifixo
  "b-triceps-1",  // Tríceps Puxador
  "b-triceps-2",  // Tríceps Francês Bilateral
  "b-triceps-3",  // Tríceps Corda
  "b-ombro-1",    // Abdução de Ombro
  "b-ombro-2",    // Desenvolvimento Máquina
  "c-quad-1",     // Leg Press 45°
  "c-post-1",     // Mesa Flexora
  "c-post-2",     // Flexora Vertical
]);

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

export function getVideoUrl(exerciseId: string): string | null {
  if (!R2_BASE || R2_BASE.includes("PLACEHOLDER")) return null;
  if (!R2_VIDEO_IDS.has(exerciseId)) return null;
  return `${R2_BASE}/${exerciseId}.mp4`;
}
