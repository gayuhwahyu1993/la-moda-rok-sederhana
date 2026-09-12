/**
 * Client-Side Image Optimizer
 * Compresses and resizes pattern diagram and measurement guide images
 * before uploading to Firebase Storage to ensure fast load times and minimal storage usage.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.88 for crisp pattern lines)
  targetFormat?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Optimizes an image File using HTML5 Canvas.
 * Automatically scales down oversized dimensions while preserving aspect ratio
 * and encodes to lightweight, high-fidelity format (defaults to WebP when supported).
 */
export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<File> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.88,
    targetFormat = 'image/webp'
  } = options;

  // Don't attempt to optimize non-images, SVGs, or in non-browser environments
  if (typeof document === 'undefined' || typeof Image === 'undefined' || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise<File>((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            // Calculate resized dimensions if exceeding maxWidth or maxHeight
            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.warn('[ImageOptimizer] Could not get 2D canvas context, using original file.');
              resolve(file);
              return;
            }

            // High-quality downsampling smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Determine output mime type
            // If original was PNG with transparency, keep PNG or use WebP
            const outputType = targetFormat;

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  console.warn('[ImageOptimizer] Canvas toBlob returned null, using original file.');
                  resolve(file);
                  return;
                }

                // If optimized blob is actually larger than original (rare, e.g. very small files), use original
                if (blob.size >= file.size && file.type === outputType) {
                  resolve(file);
                  return;
                }

                // Create new optimized File object
                const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const extension = outputType === 'image/webp' ? '.webp' : outputType === 'image/jpeg' ? '.jpg' : '.png';
                const optimizedFileName = `${originalNameWithoutExt}${extension}`;

                const optimizedFile = new File([blob], optimizedFileName, {
                  type: outputType,
                  lastModified: Date.now(),
                });

                const originalKb = (file.size / 1024).toFixed(1);
                const optimizedKb = (optimizedFile.size / 1024).toFixed(1);
                console.info(
                  `[ImageOptimizer] Optimized image: ${file.name} (${originalKb} KB) -> ${optimizedFileName} (${optimizedKb} KB, ${width}x${height})`
                );

                resolve(optimizedFile);
              },
              outputType,
              quality
            );
          } catch (canvasErr) {
            console.warn('[ImageOptimizer] Canvas processing failed, falling back to original file:', canvasErr);
            resolve(file);
          }
        };

        img.onerror = () => {
          console.warn('[ImageOptimizer] Image loading error, falling back to original file.');
          resolve(file);
        };

        if (typeof event.target?.result === 'string') {
          img.src = event.target.result;
        } else {
          resolve(file);
        }
      };

      reader.onerror = () => {
        console.warn('[ImageOptimizer] FileReader error, falling back to original file.');
        resolve(file);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('[ImageOptimizer] Unexpected error during optimization, using original file:', err);
      resolve(file);
    }
  });
}
