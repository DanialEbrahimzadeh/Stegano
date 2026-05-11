/**
 * Steganography Utility Functions
 * LSB (Least Significant Bit) encoding and decoding for hiding text and images.
 */

const CONTENT_TYPE_TEXT = '01010100';
const CONTENT_TYPE_IMAGE = '01001001';

/**
 * Calculate the maximum number of characters that can be hidden in a carrier image.
 * Each pixel provides 3 usable bits (R, G, B channels), and we need 8 bits per character.
 * We also need 40 bits for the header (8 for type marker + 32 for length).
 */
export function calculateCapacity(width: number, height: number): number {
  const totalBits = width * height * 3;
  const headerBits = 40; // 8 marker + 32 length
  const availableBits = totalBits - headerBits;
  return Math.floor(availableBits / 8);
}

/**
 * Convert a canvas to a Blob URL (much more reliable than data URLs for large images).
 */
function canvasToBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Failed to create blob from canvas'));
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}

/**
 * Load an image from any source (data URL, blob URL, or regular URL) into an ImageData.
 * Returns the canvas context and image data for manipulation.
 */
function loadImageToCanvas(src: string): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = window.document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = window.document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({ canvas, ctx, imageData, width: canvas.width, height: canvas.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Resize a data URL image to fit within given max dimensions.
 * Returns a new data URL with the resized image (PNG format).
 */
export function resizeImageDataUrl(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = window.document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;

    img.onload = () => {
      let w = img.width;
      let h = img.height;

      // Only downscale, never upscale
      if (w > maxWidth || h > maxHeight) {
        const ratio = Math.min(maxWidth / w, maxHeight / h);
        w = Math.floor(w * ratio);
        h = Math.floor(h * ratio);
      }

      const canvas = window.document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));

      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
  });
}

/**
 * LSB Encode: Hide secret data inside a cover image.
 * 
 * Binary format:
 *   [8 bits: content type marker] [32 bits: data length in chars] [N*8 bits: data]
 * 
 * Returns a Blob URL (not a data URL) to avoid browser corruption of large data URLs.
 */
export const lsbEncode = async (
  coverImage: string,
  secretData: string,
  isText: boolean
): Promise<{ resultImage: string; contentType: 'text' | 'image' }> => {
  if (typeof window === 'undefined') return { resultImage: '', contentType: 'text' };

  const { canvas, ctx, imageData } = await loadImageToCanvas(coverImage);
  const data = imageData.data;

  const binaryData = stringToBinary(secretData);
  const marker = isText ? CONTENT_TYPE_TEXT : CONTENT_TYPE_IMAGE;
  const len = secretData.length.toString(2).padStart(32, '0');
  const msg = marker + len + binaryData;

  // Capacity check with helpful error message
  const maxBits = (data.length / 4) * 3;
  if (msg.length > maxBits) {
    const maxChars = Math.floor((maxBits - 40) / 8);
    const neededPixels = Math.ceil(msg.length / 3);
    const neededDim = Math.ceil(Math.sqrt(neededPixels));
    throw new Error(
      `Secret data is too large for this carrier image. ` +
      `Carrier capacity: ${Math.floor(maxChars / 1024)} KB (${canvas.width}×${canvas.height}). ` +
      `Secret data size: ${Math.floor(secretData.length / 1024)} KB. ` +
      `Try a larger carrier (minimum ~${neededDim}×${neededDim} pixels) or a smaller secret.`
    );
  }

  // CRITICAL: Force all alpha values to 255 (fully opaque).
  // Browser canvas uses alpha premultiplication: when alpha < 255,
  // RGB values get silently rounded during PNG export/import,
  // which destroys the LSB data. Setting alpha=255 disables this.
  for (let i = 3; i < data.length; i += 4) {
    data[i] = 255;
  }

  let bitIdx = 0;
  for (let i = 0; i < data.length && bitIdx < msg.length; i += 4) {
    for (let j = 0; j < 3 && bitIdx < msg.length; j++) {
      data[i + j] = (data[i + j] & ~1) | parseInt(msg[bitIdx]);
      bitIdx++;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // CRITICAL: Use Blob URL instead of data URL to avoid browser corruption with large images
  const blobUrl = await canvasToBlobUrl(canvas);
  return { resultImage: blobUrl, contentType: isText ? 'text' : 'image' };
};

/**
 * LSB Decode: Extract hidden data from a stego image.
 * 
 * Reads the binary header to determine content type and length,
 * then extracts the full payload.
 */
export const lsbDecode = async (encodedImage: string): Promise<{ contentType: 'text' | 'image'; data: string }> => {
  if (typeof window === 'undefined') return { contentType: 'text', data: '' };

  const { imageData } = await loadImageToCanvas(encodedImage);
  const data = imageData.data;

  // First, extract the 40-bit header (8 type + 32 length)
  let headerBin = '';
  for (let i = 0; i < data.length && headerBin.length < 40; i += 4) {
    for (let j = 0; j < 3 && headerBin.length < 40; j++) {
      headerBin += (data[i + j] & 1).toString();
    }
  }

  if (headerBin.length < 40) {
    throw new Error('Image is too small to contain hidden data');
  }

  const typeMarker = headerBin.substring(0, 8);
  const type = typeMarker === CONTENT_TYPE_TEXT ? 'text' : 'image';
  const len = parseInt(headerBin.substring(8, 40), 2);

  if (len <= 0 || len > 10000000) {
    throw new Error('No hidden data found or data is corrupted');
  }

  // Now extract the full message
  const totalBits = len * 8 + 40;
  let fullBin = '';
  for (let i = 0; i < data.length && fullBin.length < totalBits; i += 4) {
    for (let j = 0; j < 3 && fullBin.length < totalBits; j++) {
      fullBin += (data[i + j] & 1).toString();
    }
  }

  const payloadBin = fullBin.substring(40);
  const decoded = binaryToString(payloadBin);

  return { contentType: type, data: decoded };
};

export function stringToBinary(str: string): string {
  let b = '';
  for (let i = 0; i < str.length; i++) b += str.charCodeAt(i).toString(2).padStart(8, '0');
  return b;
}

function binaryToString(bin: string): string {
  let r = '';
  for (let i = 0; i < bin.length; i += 8) {
    const byte = bin.substring(i, i + 8);
    if (byte.length === 8) r += String.fromCharCode(parseInt(byte, 2));
  }
  return r;
}

export function getAlgorithmName(id: string): string { return 'LSB'; }
export function getAlgorithmDescription(id: string): string { return 'LSB Steganography'; }

export const ALGORITHMS = [
  { id: 'lsb', name: 'LSB', encode: lsbEncode, decode: lsbDecode },
];