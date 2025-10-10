import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Beneficiaire, BeneficiaireCreate } from '../models/beneficiaire.model';
import { IMAGE_CONSTRAINTS } from '../constants/image-constraints.const';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireService {
  private readonly tableName = 'orig_ami_beneficiaires';

  constructor(private supabase: Supabase) {}

  async getAll(): Promise<Beneficiaire[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('actif', true)
      .order('ordre', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des bénéficiaires:', error);
      throw error;
    }

    return data as Beneficiaire[];
  }

  async getByType(type: 'beneficiaire' | 'donateur'): Promise<Beneficiaire[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('type', type)
      .eq('actif', true)
      .order('ordre', { ascending: false }); // Plus grand ordre en premier

    if (error) {
      console.error(`Erreur lors de la récupération des ${type}s:`, error);
      throw error;
    }

    // Corriger les URLs d'images si nécessaire
    const correctedData = (data as Beneficiaire[]).map(item => ({
      ...item,
      image_url: this.fixImageUrl(item.image_url, type)
    }));

    return correctedData;
  }

  async getById(id: string): Promise<Beneficiaire | null> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du bénéficiaire:', error);
      throw error;
    }

    if (data) {
      // Corriger l'URL de l'image si nécessaire
      return {
        ...data,
        image_url: this.fixImageUrl(data.image_url, data.type)
      } as Beneficiaire;
    }

    return null;
  }

  async create(beneficiaire: BeneficiaireCreate): Promise<Beneficiaire> {
    // Sauvegarder seulement le nom de fichier en base de données
    const beneficiaireToSave = {
      ...beneficiaire,
      image_url: beneficiaire.image_url // Garder seulement le nom de fichier
    };

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([beneficiaireToSave])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du bénéficiaire:', error);
      throw error;
    }

    // Retourner l'élément avec l'URL complète pour l'affichage
    return {
      ...data,
      image_url: this.buildImageUrl(data.image_url, data.type)
    } as Beneficiaire;
  }

  async update(id: string, updates: Partial<BeneficiaireCreate>): Promise<Beneficiaire> {
    // Sauvegarder seulement le nom de fichier en base de données
    const updatesToSave = { ...updates };
    
    // Si image_url est une URL complète, extraire seulement le nom de fichier
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
      console.error('Erreur lors de la mise à jour du bénéficiaire:', error);
      throw error;
    }

    // Retourner l'élément avec l'URL complète pour l'affichage
    return {
      ...data,
      image_url: this.buildImageUrl(data.image_url, data.type)
    } as Beneficiaire;
  }

  private buildImageUrl(filename: string, type: 'beneficiaire' | 'donateur'): string {
    // Si le nom de fichier contient déjà une URL complète (Supabase Storage), le retourner tel quel
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }

    // Vérifier si c'est une image Supabase Storage (contient un timestamp et caractères aléatoires)
    // Format: timestamp_random.ext (ex: 1234567890_abc123.jpg)
    const supabasePattern = /^\d+_[a-z0-9]+\.\w+$/i;
    if (supabasePattern.test(filename)) {
      // Construire l'URL Supabase Storage
      const folder = type === 'beneficiaire' 
        ? IMAGE_CONSTRAINTS.STORAGE_FOLDERS.BENEFICIAIRE 
        : IMAGE_CONSTRAINTS.STORAGE_FOLDERS.SPONSORS;
      const supabaseUrl = this.supabase.client.storage
        .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
        .getPublicUrl(`${folder}/${filename}`);
      return supabaseUrl.data.publicUrl;
    }

    // Pour toutes les autres images, utiliser Supabase
    const folder = type === 'beneficiaire' 
      ? IMAGE_CONSTRAINTS.STORAGE_FOLDERS.BENEFICIAIRE 
      : IMAGE_CONSTRAINTS.STORAGE_FOLDERS.SPONSORS;
    const supabaseUrl = this.supabase.client.storage
      .from(IMAGE_CONSTRAINTS.STORAGE_BUCKET)
      .getPublicUrl(`${folder}/${filename}`);
    return supabaseUrl.data.publicUrl;
  }

  private fixImageUrl(imageUrl: string, type: 'beneficiaire' | 'donateur'): string {
    if (!imageUrl) return '';
    
    // Si l'URL est déjà complète (Supabase ou autre), la retourner telle quelle
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si l'URL contient localhost, extraire le nom de fichier
    if (imageUrl.includes('localhost')) {
      const filename = imageUrl.split('/').pop() || '';
      return this.buildImageUrl(filename, type);
    }
    
    // Si c'est un chemin relatif comme "img/beneficiaire/fichier.webp", extraire le nom
    if (imageUrl.startsWith('img/')) {
      const filename = imageUrl.split('/').pop() || '';
      return this.buildImageUrl(filename, type);
    }
    
    // Si c'est juste un nom de fichier, construire l'URL complète
    if (!imageUrl.includes('/')) {
      return this.buildImageUrl(imageUrl, type);
    }
    
    // Sinon, retourner l'URL telle quelle
    return imageUrl;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du bénéficiaire:', error);
      throw error;
    }
  }

  async toggleActif(id: string, actif: boolean): Promise<Beneficiaire> {
    return this.update(id, { actif });
  }

  async updateOrdre(id: string, ordre: number): Promise<Beneficiaire> {
    return this.update(id, { ordre });
  }

  async reorderBeneficiaires(beneficiaires: Beneficiaire[]): Promise<void> {
    const updates = beneficiaires.map((b, index) => 
      this.update(b.id!, { ordre: index + 1 })
    );
    
    await Promise.all(updates);
  }
}

