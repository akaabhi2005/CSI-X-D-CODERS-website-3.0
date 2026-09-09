/**
 * Client-side Canvas Image Compressor
 * Resizes and compresses images to WebP format to drastically reduce payload size (e.g. from 3MB down to ~30KB-50KB).
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressBase64Image(
  base64Str: string,
  options: CompressOptions = {}
): Promise<string> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.75 } = options;

  if (typeof window === "undefined" || !base64Str || !base64Str.startsWith("data:image")) {
    return base64Str;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate scale ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP format
      const compressedDataUrl = canvas.toDataURL("image/webp", quality);
      resolve(compressedDataUrl.length < base64Str.length ? compressedDataUrl : base64Str);
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
}

export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (!base64) {
        reject(new Error("Failed to read image file"));
        return;
      }
      try {
        const compressed = await compressBase64Image(base64, options);
        resolve(compressed);
      } catch (err) {
        resolve(base64);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
