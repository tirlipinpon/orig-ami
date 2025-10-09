import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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
  private readonly BUCKET_NAME = 'orig-ami-image';
  
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  /**
   * Valide une image SANS upload (uniquement validation)
   */
  async validateImageOnly(file: File): Promise<UploadResult> {
    console.log('🔍 [VALIDATION] Validation image:', file.name);
    
    try {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const dimensions = await this.getImageDimensions(file);
      const dimensionValidation = this.validateDimensions(dimensions);
      if (!dimensionValidation.valid) {
        return { success: false, error: dimensionValidation.error };
      }

      console.log('✅ [VALIDATION] Image valide');
      return { success: true, fileName: file.name, url: '' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Valide et upload une image vers Supabase Storage
   * @param file Fichier image à valider et uploader
   * @param folder Dossier de destination ('beneficiaire' ou 'sponsors')
   * @param itemName Nom du bénéficiaire/donateur pour le nom du fichier
   * @returns Résultat de la validation et upload
   */
  async uploadImage(file: File, folder: 'beneficiaire' | 'sponsors', itemName?: string): Promise<UploadResult> {
    console.log('🚀 [SUPABASE] Début upload Supabase:', file.name, 'vers', folder);
  
    try {
      // Validation du type et de la taille du fichier
      console.log('📋 [SUPABASE] Validation type et taille...');
      const validation = this.validateFile(file);
      if (!validation.valid) {
        console.error('❌ [SUPABASE] Validation échouée:', validation.error);
        return { success: false, error: validation.error };
      }
      console.log('✅ [SUPABASE] Type et taille validés');

      // Validation des dimensions de l'image
      console.log('📐 [SUPABASE] Vérification dimensions...');
      const dimensions = await this.getImageDimensions(file);
      console.log('📊 [SUPABASE] Dimensions:', dimensions.width, 'x', dimensions.height);
      
      const dimensionValidation = this.validateDimensions(dimensions);
      if (!dimensionValidation.valid) {
        console.error('❌ [SUPABASE] Dimensions invalides:', dimensionValidation.error);
        return { success: false, error: dimensionValidation.error };
      }
      console.log('✅ [SUPABASE] Dimensions validées');

      // Générer un nom de fichier unique avec le nom de l'item
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      
      // Formater le nom de l'item pour le nom de fichier
      let fileNamePrefix = randomString;
      if (itemName) {
        const sanitizedName = this.sanitizeFileName(itemName);
        fileNamePrefix = `${sanitizedName}-${randomString}`;
      }
      
      const fileName = `${fileNamePrefix}.${extension}`;
      const filePath = `${folder}/${fileName}`;
      
      console.log('📝 [SUPABASE] Nom fichier généré:', fileName);
      
      console.log('📤 [SUPABASE] Upload vers Supabase Storage...');
      console.log('📁 [SUPABASE] Bucket:', this.BUCKET_NAME);
      console.log('📂 [SUPABASE] Path:', filePath);

      // Upload vers Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ [SUPABASE] Erreur upload:', error);
        return { 
          success: false, 
          error: `Erreur Supabase: ${error.message}` 
        };
      }

      // Obtenir l'URL publique
      const { data: urlData } = this.supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      console.log('✅ [SUPABASE] Upload réussi!');
      console.log('📁 [SUPABASE] Fichier:', fileName);
      console.log('🔗 [SUPABASE] URL:', urlData.publicUrl);

      return {
        success: true,
        fileName: fileName,
        url: urlData.publicUrl
      };

    } catch (error: any) {
      console.error('❌ [SUPABASE] Exception:', error);
      console.error('📋 [SUPABASE] Stack:', error.stack);
      return { success: false, error: error.message || 'Erreur inconnue' };
    }
  }

  /**
   * Supprime une image du bucket Supabase
   */
  async deleteImage(fileName: string, folder: 'beneficiaire' | 'sponsors'): Promise<boolean> {
    console.log('🗑️ [SUPABASE] Suppression image:', fileName, 'du dossier', folder);
    
    try {
      const filePath = `${folder}/${fileName}`;
      const { error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);
      
      if (error) {
        console.error('❌ [SUPABASE] Erreur suppression:', error);
        return false;
      }
      
      console.log('✅ [SUPABASE] Image supprimée avec succès');
      return true;
    } catch (error: any) {
      console.error('❌ [SUPABASE] Exception suppression:', error);
      return false;
    }
  }

  /**
   * Nettoie et formate le nom pour l'utiliser dans un nom de fichier
   */
  private sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-')      // Remplacer caractères spéciaux par -
      .replace(/^-+|-+$/g, '')          // Supprimer - au début/fin
      .substring(0, 30);                // Limiter la longueur
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

