export interface Carousel {
  id?: string;
  titre: string;
  image_url: string;
  alt_text: string;
  ordre: number;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CarouselCreate extends Omit<Carousel, 'id' | 'created_at' | 'updated_at'> {}

export interface CarouselUpdate extends Partial<CarouselCreate> {
  id: string;
}

