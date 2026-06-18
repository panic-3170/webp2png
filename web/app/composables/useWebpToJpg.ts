/**
 * useWebpToJpg — browser-side WebP → JPG conversion.
 *
 * Pipeline (composites alpha onto white, per PRD §8.4):
 *   1. createImageBitmap() decodes WebP natively (no <img> round-trip)
 *   2. OffscreenCanvas fills with white, then rasterizes the bitmap on top
 *      (JPG has no alpha channel; transparent areas become white)
 *   3. canvas.convertToBlob() yields a Blob with type 'image/jpeg'
 *
 * Note: JPEG is lossy and discards alpha. This is the tradeoff for
 * smaller file sizes and universal compatibility.
 */

import { WebpConversionError } from './useWebpToPng'

export interface ConvertedJpg {
  blob: Blob
  width: number
  height: number
  sizeKB: number
  originalName: string
  originalSizeKB: number
  originalUrl: string
  jpgUrl: string
}

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB
const DEFAULT_QUALITY = 0.92

function isWebpFile(file: File): boolean {
  if (file.type && file.type.includes('webp')) return true
  return /\.webp$/i.test(file.name)
}

/** Core conversion: File → JPG Blob. Returns dims alongside the blob. */
export async function webpFileToJpgBlob(
  file: File,
  quality = DEFAULT_QUALITY,
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
    // Fill with white first: JPG has no alpha, so transparent pixels
    // would otherwise render as black.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, bitmap.width, bitmap.height)
    ctx.drawImage(bitmap, 0, 0)

    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality })
    if (!blob) throw new WebpConversionError('ENCODE_FAILED', 'No JPG output')
    return { blob, width: bitmap.width, height: bitmap.height }
  } catch (e) {
    if (e instanceof WebpConversionError) throw e
    throw new WebpConversionError('ENCODE_FAILED')
  } finally {
    bitmap.close()
  }
}

/** Turn a File into a ready-to-render ConvertedJpg (with object URLs). */
export async function convertWebpFileToJpg(
  file: File,
  quality = DEFAULT_QUALITY,
): Promise<ConvertedJpg> {
  const { blob, width, height } = await webpFileToJpgBlob(file, quality)
  const originalUrl = URL.createObjectURL(file)
  const jpgUrl = URL.createObjectURL(blob)
  return {
    blob,
    width,
    height,
    sizeKB: Math.round(blob.size / 1024),
    originalName: file.name,
    originalSizeKB: Math.round(file.size / 1024),
    originalUrl,
    jpgUrl,
  }
}

/** Produce the recommended download filename: foo.webp → foo.jpg */
export function deriveJpgName(originalName: string): string {
  return originalName.replace(/\.webp$/i, '') + '.jpg'
}
