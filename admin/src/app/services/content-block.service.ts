import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { ContentBlock, ContentBlockCreate, ContentBlockUpdate, ContentBlockGroup } from '../models/content-block.model';

@Injectable({
  providedIn: 'root'
})
export class ContentBlockService {
  private readonly tableName = 'orig_ami_content_blocks';

  constructor(private supabase: Supabase) {}

  async getAll(): Promise<ContentBlock[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .order('ordre', { ascending: true })
      .order('language', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des blocs de contenu:', error);
      throw error;
    }

    return data as ContentBlock[];
  }

  async getByBlockKey(blockKey: string): Promise<ContentBlockGroup> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('block_key', blockKey)
      .order('language', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération du bloc de contenu:', error);
      throw error;
    }

    const group: ContentBlockGroup = { block_key: blockKey };
    (data as ContentBlock[]).forEach(block => {
      if (block.language === 'fr') group.fr = block;
      else if (block.language === 'en') group.en = block;
      else if (block.language === 'nl') group.nl = block;
    });

    return group;
  }

  async getByLanguage(language: string): Promise<ContentBlock[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('language', language)
      .order('ordre', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des blocs par langue:', error);
      throw error;
    }

    return data as ContentBlock[];
  }

  async getByBlockKeyAndLanguage(blockKey: string, language: string): Promise<ContentBlock | null> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('block_key', blockKey)
      .eq('language', language)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Pas trouvé
      }
      console.error('Erreur lors de la récupération du bloc de contenu:', error);
      throw error;
    }

    return data as ContentBlock;
  }

  async create(contentBlock: ContentBlockCreate): Promise<ContentBlock> {
    // Si aucun ordre n'est spécifié, utiliser le prochain ordre disponible
    if (!contentBlock.ordre) {
      contentBlock.ordre = await this.getNextOrder();
    }

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([contentBlock])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du bloc de contenu:', error);
      throw error;
    }

    return data as ContentBlock;
  }

  async update(id: string, updates: ContentBlockUpdate): Promise<ContentBlock> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du bloc de contenu:', error);
      throw error;
    }

    return data as ContentBlock;
  }

  async updateByBlockKeyAndLanguage(blockKey: string, language: string, updates: ContentBlockUpdate): Promise<ContentBlock> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(updates)
      .eq('block_key', blockKey)
      .eq('language', language)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du bloc de contenu:', error);
      throw error;
    }

    return data as ContentBlock;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du bloc de contenu:', error);
      throw error;
    }
  }

  // Méthode pour mettre à jour l'ordre d'un bloc
  async updateOrder(id: string, newOrder: number): Promise<ContentBlock> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update({ ordre: newOrder })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', error);
      throw error;
    }

    return data as ContentBlock;
  }

  // Méthode pour obtenir le prochain ordre disponible
  async getNextOrder(): Promise<number> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('ordre')
      .order('ordre', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erreur lors de la récupération du prochain ordre:', error);
      return 1;
    }

    return data && data.length > 0 ? (data[0].ordre || 0) + 1 : 1;
  }

  async getGroupedBlocks(): Promise<ContentBlockGroup[]> {
    const allBlocks = await this.getAll();
    const groupedMap = new Map<string, ContentBlockGroup>();

    allBlocks.forEach(block => {
      if (!groupedMap.has(block.block_key)) {
        groupedMap.set(block.block_key, { block_key: block.block_key });
      }
      
      const group = groupedMap.get(block.block_key)!;
      if (block.language === 'fr') group.fr = block;
      else if (block.language === 'en') group.en = block;
      else if (block.language === 'nl') group.nl = block;
    });

    // Trier par ordre (basé sur le premier bloc trouvé de chaque groupe)
    return Array.from(groupedMap.values()).sort((a, b) => {
      const ordreA = a.fr?.ordre || a.en?.ordre || a.nl?.ordre || 999;
      const ordreB = b.fr?.ordre || b.en?.ordre || b.nl?.ordre || 999;
      return ordreA - ordreB;
    });
  }
}
