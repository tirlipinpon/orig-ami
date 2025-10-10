import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';
import { Media, MediaCreate } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly tableName = 'orig_ami_medias';
  private readonly supabase = inject(Supabase);

  async getAll(): Promise<Media[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('actif', true)
      .order('ordre', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des médias:', error);
      throw error;
    }

    return data as Media[];
  }

  async getByCategorie(categorie: 'belgique' | 'neerlandais' | 'international'): Promise<Media[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('categorie', categorie)
      .eq('actif', true)
      .order('ordre', { ascending: false }); // Plus grand ordre en premier

    if (error) {
      console.error(`Erreur lors de la récupération des médias ${categorie}:`, error);
      throw error;
    }

    return data as Media[];
  }

  async getById(id: string): Promise<Media | null> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du média:', error);
      throw error;
    }

    return data as Media;
  }

  async create(media: MediaCreate): Promise<Media> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([media])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du média:', error);
      throw error;
    }

    return data as Media;
  }

  async update(id: string, updates: Partial<MediaCreate>): Promise<Media> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du média:', error);
      throw error;
    }

    return data as Media;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du média:', error);
      throw error;
    }
  }

  async toggleActif(id: string, actif: boolean): Promise<Media> {
    return this.update(id, { actif });
  }

  async updateOrdre(id: string, ordre: number): Promise<Media> {
    return this.update(id, { ordre });
  }

  async reorderMedias(medias: Media[]): Promise<void> {
    const updates = medias.map((m, index) => 
      this.update(m.id!, { ordre: index + 1 })
    );
    
    await Promise.all(updates);
  }
}

