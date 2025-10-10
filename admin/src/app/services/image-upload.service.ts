import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { IMAGE_CONSTRAINTS, StorageFolder } from '../constants/image-constraints.const';
import { ImageProcessingService } from './image-processing.service';

export interface UploadResult {
  success: boolean;
  fileName?: string;
  url?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly supabase: SupabaseClient;
  private readonly imageProcessingService = inject(ImageProcessingService);

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  /**
   * Valide une image SANS upload (uniquement validation)
   */
  async validateImageOnly(file: File): Promise<UploadResult> {
    console.log('🔍 [VALIDATION] Validation image:', file.name);
    
    try {
      const validation = this.imageProcessingService.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const dimensions = await this.imageProcessingService.getImageDimensions(file);
      const dimensionValidation = this.imageProcessingService.validateDimensions(dimensions);
      if (!dimensionValidation.valid) {
        return { success: false, error: dimensionValidation.error };
      }

      console.log('✅ [VALIDATION] Image valide');
      return { success: true, fileName: file.name, url: '' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Valide et upload une image vers Supabase Storage
   * @param file Fichier image à valider et uploader
   * @param folder Dossier de destination ('beneficiaire' ou 'sponsors')
   * @param itemName Nom du bénéficiaire/donateur pour le nom du fichier
   * @returns Résultat de la validation et upload
   */
  async uploadImage(file: File, folder: StorageFolder, itemName?: string): Promise<UploadResult> {
    console.log('🚀 [SUPABASE] Début upload Supabase:', file.name, 'vers', folder);
  
    try {
      // Validation du type et de la taille du fichier
      console.log('📋 [SUPABASE] Validation type et taille...');
      const validation = this.imageProcessingService.validateFile(file);
      if (!validation.valid) {
        console.error('❌ [SUPABASE] Validation échouée:', validation.error);
        return { success: false, error: validation.error };
      }
      console.log('✅ [SUPABASE] Type et taille validés');

      // Validation des dimensions de l'image
      console.log('📐 [SUPABASE] Vérification dimensions...');
      const dimensions = await this.imageProcessingService.getImageDimensions(file);
      console.log('📊 [SUPABASE] Dimensions:', dimensions.width, 'x', dimensions.height);
      
      const dimensionValidation = this.imageProcessingService.validateDimensions(dimensions);
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
        const sanitizedName = this.imageProcessingService.sanitizeFileName(itemName);
        fileNamePrefix = `${sanitizedName}-${randomString}`;
      }
      
      const fileName = `${fileNamePrefix}.${extension}`;
      const filePath = `${folder}/${fileName}`;
      
      console.log('📝 [SUPABASE] Nom fichier généré:', fileName);
      
      console.log('📤 [SUPABASE] Upload vers Supabase Storage...');
      console.log('📁 [SUPABASE] Bucket:', IMAGE_CONSTRAINTS.STORAGE_BUCKET);
      console.log('📂 [SUPABASE] Path:', filePath);

      // Upload vers Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
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
        .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      console.log('✅ [SUPABASE] Upload réussi!');
      console.log('📁 [SUPABASE] Fichier:', fileName);
      console.log('🔗 [SUPABASE] URL:', urlData.publicUrl);

      return {
        success: true,
        fileName: fileName,
        url: urlData.publicUrl
      };

    } catch (error: unknown) {
      console.error('❌ [SUPABASE] Exception:', error);
      if (error instanceof Error) {
        console.error('📋 [SUPABASE] Stack:', error.stack);
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Erreur inconnue' };
    }
  }

  /**
   * Supprime une image du bucket Supabase
   */
  async deleteImage(fileName: string, folder: StorageFolder): Promise<boolean> {
    console.log('🗑️ [SUPABASE] Suppression image:', fileName, 'du dossier', folder);
    
    try {
      const filePath = `${folder}/${fileName}`;
      const { error } = await this.supabase.storage
        .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
        .remove([filePath]);
      
      if (error) {
        console.error('❌ [SUPABASE] Erreur suppression:', error);
        return false;
      }
      
      console.log('✅ [SUPABASE] Image supprimée avec succès');
      return true;
    } catch (error: unknown) {
      console.error('❌ [SUPABASE] Exception suppression:', error);
      return false;
    }
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

