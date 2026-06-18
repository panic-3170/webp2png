/**
 * useWebpToPng — browser-side WebP → PNG conversion.
 *
 * Pipeline (preserves alpha, per PRD §4.3):
 *   1. createImageBitmap() decodes WebP natively (no <img> round-trip)
 *   2. OffscreenCanvas rasterizes to a PNG-friendly bitmap
 *   3. canvas.convertToBlob() yields a Blob with type 'image/png'
 *
 * Fallback: if createImageBitmap throws (rare; old Safari), the caller
 * can catch and try the WASM path (@jsquash/webp) — wired in the page.
 */

export interface ConvertedPng {
  blob: Blob
  width: number
  height: number
  sizeKB: number
  originalName: string
  originalSizeKB: number
  originalUrl: string
  pngUrl: string
}

export class WebpConversionError extends Error {
  code: 'NOT_WEBP' | 'TOO_LARGE' | 'DECODE_FAILED' | 'ENCODE_FAILED'
  constructor(code: WebpConversionError['code'], message?: string) {
    super(message ?? code)
    this.code = code
  }
}

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

function isWebpFile(file: File): boolean {
  if (file.type && file.type.includes('webp')) return true
  return /\.webp$/i.test(file.name)
}

/** Core conversion: File → PNG Blob. Returns dims alongside the blob. */
export async function webpFileToPngBlob(
  file: File,
): Promise<{ blob: Blob; width: number; height: number }> {
  if (!isWebpFile(file)) throw new WebpConversionError('NOT_WEBP')
  if (file.size > MAX_BYTES) throw new WebpConversionError('TOO_LARGE')

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new WebpConversionError('DECODE_FAILED', 'Failed to decode WebP')
  }

  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new WebpConversionError('ENCODE_FAILED', 'No 2D context')
    ctx.drawImage(bitmap, 0, 0)

    const blob = await canvas.convertToBlob({ type: 'image/png' })
    if (!blob) throw new WebpConversionError('ENCODE_FAILED', 'No PNG output')
    return { blob, width: bitmap.width, height: bitmap.height }
  } catch (e) {
    if (e instanceof WebpConversionError) throw e
    throw new WebpConversionError('ENCODE_FAILED')
  } finally {
    bitmap.close()
  }
}

/** Turn a File into a ready-to-render ConvertedPng (with object URLs). */
export async function convertWebpFile(file: File): Promise<ConvertedPng> {
  const { blob, width, height } = await webpFileToPngBlob(file)
  const originalUrl = URL.createObjectURL(file)
  const pngUrl = URL.createObjectURL(blob)
  return {
    blob,
    width,
    height,
    sizeKB: Math.round(blob.size / 1024),
    originalName: file.name,
    originalSizeKB: Math.round(file.size / 1024),
    originalUrl,
    pngUrl,
  }
}

/** Produce the recommended download filename: foo.webp → foo.png */
export function derivePngName(originalName: string): string {
  return originalName.replace(/\.webp$/i, '') + '.png'
}
