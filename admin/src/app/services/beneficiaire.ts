import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Beneficiaire, BeneficiaireCreate } from '../models/beneficiaire.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireService {
  private readonly tableName = 'beneficiaires';

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
    // Construire l'URL complète de l'image
    const beneficiaireWithFullUrl = {
      ...beneficiaire,
      image_url: this.buildImageUrl(beneficiaire.image_url, beneficiaire.type)
    };

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([beneficiaireWithFullUrl])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du bénéficiaire:', error);
      throw error;
    }

    return data as Beneficiaire;
  }

  async update(id: string, updates: Partial<BeneficiaireCreate>): Promise<Beneficiaire> {
    // Si image_url est modifiée, on doit d'abord récupérer le type actuel
    let updatesWithFullUrl = { ...updates };
    
    if (updates.image_url && !updates.image_url.startsWith('http')) {
      // Récupérer l'élément actuel pour connaître son type
      const currentItem = await this.getById(id);
      if (currentItem) {
        updatesWithFullUrl.image_url = this.buildImageUrl(updates.image_url, currentItem.type);
      }
    }

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(updatesWithFullUrl)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du bénéficiaire:', error);
      throw error;
    }

    return data as Beneficiaire;
  }

  private buildImageUrl(filename: string, type: 'beneficiaire' | 'donateur'): string {
    const baseUrl = 'https://www.orig-ami.eu/img/';
    const folder = type === 'beneficiaire' ? 'beneficiaire' : 'sponsors';
    return `${baseUrl}${folder}/${filename}`;
  }

  private fixImageUrl(imageUrl: string, type: 'beneficiaire' | 'donateur'): string {
    if (!imageUrl) return '';
    
    // Si l'URL contient localhost, extraire le nom de fichier
    if (imageUrl.includes('localhost')) {
      const filename = imageUrl.split('/').pop() || '';
      return this.buildImageUrl(filename, type);
    }
    
    // Si l'URL est déjà complète avec le bon domaine, la retourner telle quelle
    if (imageUrl.startsWith('https://www.orig-ami.eu/img/')) {
      return imageUrl;
    }
    
    // Si c'est un chemin relatif comme "img/beneficiaire/fichier.webp", extraire le nom
    if (imageUrl.startsWith('img/')) {
      const filename = imageUrl.split('/').pop() || '';
      return this.buildImageUrl(filename, type);
    }
    
    // Si c'est juste un nom de fichier (cas principal après migration), construire l'URL complète
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

