const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.82;

export interface ProcessedImage {
  file: Blob;
  base64: string;
  mimeType: string;
}

export async function resizeImageFile(file: File): Promise<ProcessedImage> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not process image');
  }
  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
  );
  if (!blob) {
    throw new Error('Could not process image');
  }

  const base64 = await blobToBase64(blob);

  return { file: blob, base64, mimeType: 'image/jpeg' };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = () => reject(new Error('Could not encode image'));
    reader.readAsDataURL(blob);
  });
}
