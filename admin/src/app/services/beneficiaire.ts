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
      .order('ordre', { ascending: true });

    if (error) {
      console.error(`Erreur lors de la récupération des ${type}s:`, error);
      throw error;
    }

    return data as Beneficiaire[];
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

    return data as Beneficiaire;
  }

  async create(beneficiaire: BeneficiaireCreate): Promise<Beneficiaire> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([beneficiaire])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du bénéficiaire:', error);
      throw error;
    }

    return data as Beneficiaire;
  }

  async update(id: string, updates: Partial<BeneficiaireCreate>): Promise<Beneficiaire> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du bénéficiaire:', error);
      throw error;
    }

    return data as Beneficiaire;
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

