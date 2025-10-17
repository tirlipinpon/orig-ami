export interface ContentBlock {
  id?: string;
  block_key: string;
  language: string;
  title: string;
  content: string;
  ordre: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContentBlockCreate {
  block_key: string;
  language: string;
  title: string;
  content: string;
  ordre?: number;
}

export interface ContentBlockUpdate {
  title?: string;
  content?: string;
  ordre?: number;
}

export interface ContentBlockGroup {
  block_key: string;
  fr?: ContentBlock;
  en?: ContentBlock;
  nl?: ContentBlock;
}
