import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Carousel, CarouselCreate } from '../models/carousel.model';
import { IMAGE_CONSTRAINTS } from '../constants/image-constraints.const';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private readonly tableName = 'orig_ami_carousel';

  constructor(private supabase: Supabase) {}

  async getAll(): Promise<Carousel[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .order('ordre', { ascending: false }); // Récupère TOUS les slides (actifs et inactifs)

    if (error) {
      console.error('Erreur lors de la récupération des slides:', error);
      throw error;
    }

    return (data as Carousel[]).map(item => ({
      ...item,
      image_url: this.fixImageUrl(item.image_url)
    }));
  }

  async getActive(): Promise<Carousel[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('actif', true)
      .order('ordre', { ascending: false }); // Récupère seulement les slides actifs

    if (error) {
      console.error('Erreur lors de la récupération des slides actifs:', error);
      throw error;
    }

    return (data as Carousel[]).map(item => ({
      ...item,
      image_url: this.fixImageUrl(item.image_url)
    }));
  }

  async getById(id: string): Promise<Carousel | null> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du slide:', error);
      throw error;
    }

    if (data) {
      return {
        ...data,
        image_url: this.fixImageUrl(data.image_url)
      } as Carousel;
    }

    return null;
  }

  async create(carousel: CarouselCreate): Promise<Carousel> {
    const carouselToSave = {
      ...carousel,
      image_url: carousel.image_url
    };

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([carouselToSave])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du slide:', error);
      throw error;
    }

    return {
      ...data,
      image_url: this.buildImageUrl(data.image_url)
    } as Carousel;
  }

  async update(id: string, updates: Partial<CarouselCreate>, oldImageUrl?: string): Promise<Carousel> {
    const updatesToSave = { ...updates };
    
    // Si on change d'image, supprimer l'ancienne du storage
    if (updates.image_url && oldImageUrl && updates.image_url !== oldImageUrl) {
      try {
        const oldFilename = this.extractFileNameFromUrl(oldImageUrl);
        if (oldFilename) {
          const { ImageUploadService } = await import('./image-upload.service');
          const imageUploadService = new ImageUploadService();
          await imageUploadService.deleteImage(oldFilename, 'caroussel');
          console.log('✅ Ancienne image supprimée du storage:', oldFilename);
        }
      } catch (error) {
        console.warn('⚠️ Erreur lors de la suppression de l\'ancienne image:', error);
        // Continue même si la suppression de l'ancienne image échoue
      }
    }
    
    if (updates.image_url && updates.image_url.startsWith('http')) {
      updatesToSave.image_url = updates.image_url.split('/').pop() || '';
    }

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(updatesToSave)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du slide:', error);
      throw error;
    }

    return {
      ...data,
      image_url: this.buildImageUrl(data.image_url)
    } as Carousel;
  }

  async delete(id: string, imageUrl?: string): Promise<void> {
    // Supprimer l'image du storage si elle existe
    if (imageUrl) {
      try {
        const filename = this.extractFileNameFromUrl(imageUrl);
        if (filename) {
          const { ImageUploadService } = await import('./image-upload.service');
          const imageUploadService = new ImageUploadService();
          await imageUploadService.deleteImage(filename, 'caroussel');
          console.log('✅ Image supprimée du storage:', filename);
        }
      } catch (error) {
        console.warn('⚠️ Erreur lors de la suppression de l\'image du storage:', error);
        // Continue même si la suppression de l'image échoue
      }
    }

    // Supprimer l'entrée en base de données
    const { error } = await this.supabase.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du slide:', error);
      throw error;
    }
  }

  async toggleActif(id: string, actif: boolean): Promise<Carousel> {
    return this.update(id, { actif });
  }

  async updateOrdre(id: string, ordre: number): Promise<Carousel> {
    return this.update(id, { ordre });
  }

  async reorderSlides(slides: Carousel[]): Promise<void> {
    const updates = slides.map((slide, index) => 
      this.update(slide.id!, { ordre: index + 1 })
    );
    
    await Promise.all(updates);
  }

  private buildImageUrl(filename: string): string {
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }

    const supabasePattern = /^\d+_[a-z0-9]+\.\w+$/i;
    if (supabasePattern.test(filename)) {
      const supabaseUrl = this.supabase.client.storage
        .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
        .getPublicUrl(`${IMAGE_CONSTRAINTS.STORAGE_FOLDERS.CAROUSEL}/${filename}`);
      return supabaseUrl.data.publicUrl;
    }

    const supabaseUrl = this.supabase.client.storage
      .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
      .getPublicUrl(`${IMAGE_CONSTRAINTS.STORAGE_FOLDERS.CAROUSEL}/${filename}`);
    return supabaseUrl.data.publicUrl;
  }

  private fixImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.includes('localhost')) {
      const filename = imageUrl.split('/').pop() || '';
      return this.buildImageUrl(filename);
    }
    
    if (imageUrl.startsWith('img/')) {
      const filename = imageUrl.split('/').pop() || '';
      return this.buildImageUrl(filename);
    }
    
    if (!imageUrl.includes('/')) {
      return this.buildImageUrl(imageUrl);
    }
    
    return imageUrl;
  }

  private extractFileNameFromUrl(url: string): string | null {
    if (!url) return null;
    
    // Si c'est déjà un nom de fichier simple
    if (!url.includes('/')) {
      return url;
    }
    
    // Extraire le nom de fichier de l'URL
    const filename = url.split('/').pop() || '';
    
    // Vérifier que c'est bien un nom de fichier (contient une extension)
    if (filename.includes('.')) {
      return filename;
    }
    
    return null;
  }
}

