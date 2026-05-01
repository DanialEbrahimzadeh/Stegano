/**
 * Steganography Utility Functions
 */

const CONTENT_TYPE_TEXT = '01010100';
const CONTENT_TYPE_IMAGE = '01001001';

export const lsbEncode = async (coverImage: string, secretData: string, isText: boolean): Promise<{ resultImage: string; contentType: 'text' | 'image' }> => {
  if (typeof window === 'undefined') return { resultImage: '', contentType: 'text' };
  
  return new Promise((resolve, reject) => {
    // CRITICAL: Avoid using 'new Image()' constructor which can be shadowed or broken in Next.js
    const img = window.document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = coverImage;
    
    img.onload = () => {
      try {
        const canvas = window.document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No context');
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const binaryData = stringToBinary(secretData);
        const marker = isText ? CONTENT_TYPE_TEXT : CONTENT_TYPE_IMAGE;
        const len = secretData.length.toString(2).padStart(32, '0');
        const msg = marker + len + binaryData;
        
        if (msg.length > (data.length / 4) * 3) throw new Error('Small image');
        
        let bitIdx = 0;
        for (let i = 0; i < data.length && bitIdx < msg.length; i += 4) {
          for (let j = 0; j < 3 && bitIdx < msg.length; j++) {
            data[i + j] = (data[i + j] & ~1) | parseInt(msg[bitIdx]);
            bitIdx++;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve({ resultImage: canvas.toDataURL('image/png'), contentType: isText ? 'text' : 'image' });
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('Load fail'));
  });
};

export const lsbDecode = async (encodedImage: string): Promise<{ contentType: 'text' | 'image'; data: string }> => {
  if (typeof window === 'undefined') return { contentType: 'text', data: '' };
  
  return new Promise((resolve, reject) => {
    const img = window.document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = encodedImage;
    
    img.onload = () => {
      try {
        const canvas = window.document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No context');
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let bin = '';
        for (let i = 0; i < 40 * 4 && bin.length < 40; i += 4) {
          for (let j = 0; j < 3 && bin.length < 40; j++) {
            bin += (data[i + j] & 1).toString();
          }
        }
        
        const type = bin.substring(0, 8) === CONTENT_TYPE_TEXT ? 'text' : 'image';
        const len = parseInt(bin.substring(8, 40), 2);
        if (len <= 0 || len > 10000000) throw new Error('Bad len');
        
        const total = len * 8 + 40;
        bin = '';
        for (let i = 0; i < data.length && bin.length < total; i += 4) {
          for (let j = 0; j < 3 && bin.length < total; j++) {
            bin += (data[i + j] & 1).toString();
          }
        }
        
        resolve({ contentType: type, data: binaryToString(bin.substring(40)) });
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('Load fail'));
  });
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