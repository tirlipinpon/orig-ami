export interface Beneficiaire {
  id?: string;
  nom: string;
  url: string;
  image_url: string;
  alt_text: string;
  title: string;
  image_width: number;
  type: 'beneficiaire' | 'donateur';
  ordre: number;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BeneficiaireCreate extends Omit<Beneficiaire, 'id' | 'created_at' | 'updated_at'> {}

export interface BeneficiaireUpdate extends Partial<BeneficiaireCreate> {
  id: string;
}

