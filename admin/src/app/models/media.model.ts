/**
 * Modèle pour les liens médias (articles, vidéos, etc.)
 */
export interface Media {
  id?: string;
  titre: string;
  url: string;
  categorie: 'belgique' | 'international' | 'neerlandais';
  date_publication?: string;
  ordre: number;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MediaCreate extends Omit<Media, 'id' | 'created_at' | 'updated_at'> {}

export interface MediaUpdate extends Partial<MediaCreate> {
  id: string;
}

