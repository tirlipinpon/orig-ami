import { Injectable } from '@angular/core';
import { IMAGE_CONSTRAINTS, ImageFormat } from '../constants/image-constraints.const';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageInfo {
  type: string;
  size: number;
  width: number;
  height: number;
  sizeValid: boolean;
  widthValid: boolean;
  heightValid: boolean;
}

export interface ImageOptimizationResult {
  file: File;
  originalSize: number;
  newSize: number;
  originalDimensions: ImageDimensions;
  newDimensions: ImageDimensions;
  compressionRatio: number;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  /**
   * Extrait les informations complètes d'une image
   */
  async extractImageInfo(file: File): Promise<ImageInfo> {
    const fileType = this.getReadableFileType(file.type);
    const dimensions = await this.getImageDimensions(file);

    return {
      type: fileType,
      size: file.size,
      width: dimensions.width,
      height: dimensions.height,
      sizeValid: file.size <= IMAGE_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      widthValid: dimensions.width === 0 || dimensions.width <= IMAGE_CONSTRAINTS.MAX_WIDTH,
      heightValid: dimensions.height === 0 || dimensions.height <= IMAGE_CONSTRAINTS.MAX_HEIGHT
    };
  }

  /**
   * Obtient les dimensions d'une image
   */
  async getImageDimensions(file: File): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
      // SVG n'a pas de dimensions fixes
      if (file.type === 'image/svg+xml') {
        resolve({ width: 0, height: 0 });
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Impossible de lire les dimensions de l\'image'));
      };

      img.src = url;
    });
  }

  /**
   * Valide les dimensions d'une image
   */
  validateDimensions(dimensions: ImageDimensions): ImageValidationResult {
    // Pas de validation pour SVG (dimensions = 0)
    if (dimensions.width === 0 && dimensions.height === 0) {
      return { valid: true };
    }

    // Vérifier la largeur
    if (dimensions.width > IMAGE_CONSTRAINTS.MAX_WIDTH) {
      return {
        valid: false,
        error: `L'image est trop large. Largeur maximale: ${IMAGE_CONSTRAINTS.MAX_WIDTH}px (votre image: ${dimensions.width}px)`
      };
    }

    // Vérifier la hauteur
    if (dimensions.height > IMAGE_CONSTRAINTS.MAX_HEIGHT) {
      return {
        valid: false,
        error: `L'image est trop haute. Hauteur maximale: ${IMAGE_CONSTRAINTS.MAX_HEIGHT}px (votre image: ${dimensions.height}px)`
      };
    }

    return { valid: true };
  }

  /**
   * Valide le type et la taille d'un fichier
   */
  validateFile(file: File): ImageValidationResult {
    // Vérifier le type de fichier
    if (!IMAGE_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type as any)) {
      return {
        valid: false,
        error: 'Type de fichier non supporté. Formats acceptés: JPG, PNG, WebP, SVG, GIF'
      };
    }

    // Vérifier la taille du fichier
    if (file.size > IMAGE_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${IMAGE_CONSTRAINTS.MAX_FILE_SIZE_KB}KB`
      };
    }

    return { valid: true };
  }

  /**
   * Optimise automatiquement une image (redimensionnement + compression)
   */
  async optimizeImage(
    file: File,
    targetFormat: ImageFormat = IMAGE_CONSTRAINTS.COMPRESSION.DEFAULT_FORMAT as ImageFormat
  ): Promise<ImageOptimizationResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const originalDimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight
          };

          // Calculer les nouvelles dimensions
          const newDimensions = this.calculateOptimalDimensions(
            img.naturalWidth,
            img.naturalHeight
          );

          // Calculer la qualité optimale
          const quality = this.calculateOptimalQuality(file.size, newDimensions.width * newDimensions.height);

          // Créer le canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'));
            return;
          }

          canvas.width = newDimensions.width;
          canvas.height = newDimensions.height;

          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

          // Convertir en blob
          const mimeType = `image/${targetFormat}`;
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Erreur lors de la conversion'));
                return;
              }

              // Créer le nouveau fichier
              const newFileName = this.generateOptimizedFileName(file.name, targetFormat);
              const newFile = new File([blob], newFileName, { type: mimeType });

              const result: ImageOptimizationResult = {
                file: newFile,
                originalSize: file.size,
                newSize: blob.size,
                originalDimensions,
                newDimensions,
                compressionRatio: (file.size - blob.size) / file.size
              };

              resolve(result);
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calcule les dimensions optimales pour une image
   */
  calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number
  ): ImageDimensions {
    const maxWidth = IMAGE_CONSTRAINTS.MAX_WIDTH;
    const maxHeight = IMAGE_CONSTRAINTS.MAX_HEIGHT;

    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);

    // L'image est déjà plus petite que les limites
    if (ratio >= 1) {
      return { width: originalWidth, height: originalHeight };
    }

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  }

  /**
   * Calcule la qualité optimale pour la compression
   */
  calculateOptimalQuality(originalSizeBytes: number, targetPixels: number): number {
    const maxSizeBytes = IMAGE_CONSTRAINTS.MAX_FILE_SIZE_BYTES;
    const { MIN_QUALITY, MAX_QUALITY } = IMAGE_CONSTRAINTS.COMPRESSION;

    // Si l'image originale est déjà petite, utiliser une qualité élevée
    if (originalSizeBytes <= maxSizeBytes * 0.5) {
      return MAX_QUALITY;
    }

    // Si l'image est très grande, utiliser une qualité plus faible
    if (originalSizeBytes >= maxSizeBytes * 5) {
      return MIN_QUALITY;
    }

    // Calculer la qualité basée sur le ratio taille/pixels
    const bytesPerPixel = originalSizeBytes / targetPixels;
    const targetBytesPerPixel = maxSizeBytes / targetPixels;

    // Qualité entre MIN et MAX selon le ratio
    const quality = Math.max(MIN_QUALITY, Math.min(MAX_QUALITY, targetBytesPerPixel / bytesPerPixel));

    return Math.round(quality * 10) / 10; // Arrondir à 1 décimale
  }

  /**
   * Génère un nom de fichier pour une image optimisée
   */
  generateOptimizedFileName(originalName: string, format: ImageFormat): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_optimized.${format}`;
  }

  /**
   * Génère un nom de fichier pour une image éditée
   */
  generateEditedFileName(originalName: string, format: ImageFormat): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const timestamp = Date.now();
    return `${nameWithoutExt}_edited_${timestamp}.${format}`;
  }

  /**
   * Nettoie et formate un nom pour l'utiliser dans un nom de fichier
   */
  sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-')     // Remplacer caractères spéciaux par -
      .replace(/^-+|-+$/g, '')         // Supprimer - au début/fin
      .substring(0, 30);               // Limiter la longueur
  }

  /**
   * Formate un nom pour alt text (nettoie les caractères dangereux)
   */
  formatNameForAltText(name: string): string {
    return name
      .trim()
      .replace(/[<>"'\/\\]/g, '')      // Supprimer les caractères dangereux
      .replace(/[_-]+/g, ' ')          // Remplacer underscores et tirets par des espaces
      .replace(/\s+/g, ' ')            // Remplacer les espaces multiples par un seul
      .trim();
  }

  /**
   * Formate la taille d'un fichier en format lisible
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    if (bytes < k) return bytes + ' B';
    return (bytes / k).toFixed(1) + ' KB';
  }

  /**
   * Obtient le type de fichier dans un format lisible
   */
  private getReadableFileType(mimeType: string): string {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'JPEG',
      'image/jpg': 'JPEG',
      'image/png': 'PNG',
      'image/webp': 'WebP',
      'image/svg+xml': 'SVG',
      'image/gif': 'GIF'
    };

    return typeMap[mimeType] || 'Inconnu';
  }
}

