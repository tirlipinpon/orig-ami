/**
 * Constantes pour la validation et le traitement des images
 */

export const IMAGE_CONSTRAINTS = {
  // Dimensions maximales en pixels
  MAX_WIDTH: 500,
  MAX_HEIGHT: 500,
  
  // Taille maximale du fichier en octets
  MAX_FILE_SIZE_BYTES: 500 * 1024, // 500KB
  MAX_FILE_SIZE_KB: 500,
  
  // Formats acceptés
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif'
  ] as const,
  
  // Extensions de fichiers acceptées
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'] as const,
  
  // Configuration de compression
  COMPRESSION: {
    DEFAULT_QUALITY: 0.85,
    MIN_QUALITY: 0.7,
    MAX_QUALITY: 0.9,
    DEFAULT_FORMAT: 'webp' as const
  },
  
  // Nom du bucket Supabase
  STORAGE_BUCKET: 'orig-ami-image',
  
  // Dossiers de stockage
  STORAGE_FOLDERS: {
    BENEFICIAIRE: 'beneficiaire' as const,
    SPONSORS: 'sponsors' as const,
    CAROUSEL: 'caroussel' as const
  }
} as const;

/**
 * Type pour les types MIME acceptés
 */
export type AllowedMimeType = typeof IMAGE_CONSTRAINTS.ALLOWED_MIME_TYPES[number];

/**
 * Type pour les extensions acceptées
 */
export type AllowedExtension = typeof IMAGE_CONSTRAINTS.ALLOWED_EXTENSIONS[number];

/**
 * Type pour les formats d'image
 */
export type ImageFormat = 'jpeg' | 'png' | 'webp';

/**
 * Type pour les dossiers de stockage
 */
export type StorageFolder = typeof IMAGE_CONSTRAINTS.STORAGE_FOLDERS[keyof typeof IMAGE_CONSTRAINTS.STORAGE_FOLDERS];

