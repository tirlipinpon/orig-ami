import { Injectable } from '@angular/core';

export interface UploadResult {
  success: boolean;
  fileName?: string;
  url?: string;
  error?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly MAX_FILE_SIZE = 500 * 1024; // 500KB
  private readonly MAX_WIDTH = 500; // pixels
  private readonly MAX_HEIGHT = 500; // pixels
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

  /**
   * Valide une image (sans upload vers Supabase)
   * @param file Fichier image à valider
   * @param folder Dossier de destination ('beneficiaire' ou 'sponsors') - pour référence future
   * @returns Résultat de la validation avec le nom du fichier
   */
  async uploadImage(file: File, folder: 'beneficiaire' | 'sponsors'): Promise<UploadResult> {
    try {
      // Validation du type et de la taille du fichier
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Validation des dimensions de l'image
      const dimensions = await this.getImageDimensions(file);
      const dimensionValidation = this.validateDimensions(dimensions);
      if (!dimensionValidation.valid) {
        return { success: false, error: dimensionValidation.error };
      }

      // Retourner simplement le nom du fichier original
      // (pas d'upload vers Supabase pour le moment)
      const fileName = file.name;

      return {
        success: true,
        fileName: fileName,
        url: '' // Pas d'URL pour le moment
      };

    } catch (error: any) {
      console.error('Erreur lors de la validation:', error);
      return { success: false, error: error.message || 'Erreur inconnue' };
    }
  }

  /**
   * Valide le type et la taille du fichier image
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Vérifier le type de fichier
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Type de fichier non supporté. Formats acceptés: JPG, PNG, WebP, SVG, GIF'
      };
    }

    // Vérifier la taille du fichier
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${Math.round(this.MAX_FILE_SIZE / 1024)}KB`
      };
    }

    return { valid: true };
  }

  /**
   * Récupère les dimensions de l'image
   */
  private getImageDimensions(file: File): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
      // SVG n'a pas de dimensions fixes, on accepte sans vérifier
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
   * Valide les dimensions de l'image
   */
  private validateDimensions(dimensions: ImageDimensions): { valid: boolean; error?: string } {
    // Pas de validation pour SVG (dimensions = 0)
    if (dimensions.width === 0 && dimensions.height === 0) {
      return { valid: true };
    }

    // Vérifier la largeur
    if (dimensions.width > this.MAX_WIDTH) {
      return {
        valid: false,
        error: `L'image est trop large. Largeur maximale: ${this.MAX_WIDTH}px (votre image: ${dimensions.width}px)`
      };
    }

    // Vérifier la hauteur
    if (dimensions.height > this.MAX_HEIGHT) {
      return {
        valid: false,
        error: `L'image est trop haute. Hauteur maximale: ${this.MAX_HEIGHT}px (votre image: ${dimensions.height}px)`
      };
    }

    return { valid: true };
  }

  /**
   * Crée une URL de prévisualisation locale pour l'image
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Libère l'URL de prévisualisation
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

