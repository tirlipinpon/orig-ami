import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ImageEditResult {
  file: File;
  originalSize: number;
  newSize: number;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
  compressionRatio: number;
}

export interface ImageEditOptions {
  maxWidth: number;
  maxHeight: number;
  maxSizeKB: number;
  quality: number; // 0.1 à 1.0
  format: 'jpeg' | 'png' | 'webp';
}

@Component({
  selector: 'app-image-editor',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="image-editor-modal" *ngIf="show" (click)="onCancel($event)">
      <div class="image-editor-container" (click)="$event.stopPropagation()">
        <div class="editor-header">
          <h3>🖼️ Éditeur d'Image</h3>
          <button type="button" class="btn-close" (click)="onCancel($event)">✕</button>
        </div>

        <div class="editor-content">
          <!-- Image originale -->
          <div class="image-section">
            <h4>Image Originale</h4>
            <div class="image-container">
              <img [src]="originalImageUrl" [alt]="'Image originale'">
              <div class="image-info">
                <div class="info-item">
                  <span class="label">Taille :</span>
                  <span class="value" [class.invalid-value]="!isOriginalSizeValid()">
                    {{ formatFileSize(originalSize) }}
                    @if (!isOriginalSizeValid()) {
                      <span class="limit-text">(max: {{ editOptions.maxSizeKB }} KB)</span>
                    }
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">Dimensions :</span>
                  <span class="value" [class.invalid-value]="!isOriginalDimensionsValid()">
                    {{ originalDimensions.width }}×{{ originalDimensions.height }}px
                    @if (!isOriginalDimensionsValid()) {
                      <span class="limit-text">(max: {{ editOptions.maxWidth }}×{{ editOptions.maxHeight }} px)</span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Aperçu de l'édition -->
          <div class="preview-section">
            <h4>Aperçu Modifié</h4>
            <div class="image-container">
              <img [src]="previewImageUrl" [alt]="'Aperçu modifié'" *ngIf="previewImageUrl">
              <div class="image-info" *ngIf="previewInfo">
                <div class="info-item">
                  <span class="label">Taille :</span>
                  <span class="value valid-value">
                    {{ formatFileSize(previewInfo.newSize) }}
                    <span class="check-icon">✅</span>
                  </span>
                  <span class="reduction" *ngIf="previewInfo.compressionRatio > 0">
                    ({{ (previewInfo.compressionRatio * 100).toFixed(0) }}% de réduction)
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">Dimensions :</span>
                  <span class="value valid-value">
                    {{ previewInfo.newDimensions.width }}×{{ previewInfo.newDimensions.height }}px
                    <span class="check-icon">✅</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="action-buttons">
            <button 
              type="button" 
              class="btn-apply"
              [disabled]="!previewImageUrl || isProcessing"
              (click)="applyChanges($event)">
              <span *ngIf="isProcessing" class="loading-spinner">⏳</span>
              {{ isProcessing ? 'Traitement...' : '✨ Appliquer automatiquement' }}
            </button>
            
            <button 
              type="button" 
              class="btn-cancel"
              (click)="onCancel($event)">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './image-editor.component.css'
})
export class ImageEditorComponent {
  @Input() show = false;
  @Input() originalFile: File | null = null;
  @Input() maxWidth = 500;
  @Input() maxHeight = 500;
  @Input() maxSizeKB = 500;

  @Output() result = new EventEmitter<ImageEditResult>();
  @Output() cancel = new EventEmitter<void>();

  originalImageUrl = '';
  previewImageUrl = '';
  originalSize = 0;
  originalDimensions = { width: 0, height: 0 };
  previewInfo: ImageEditResult | null = null;
  isProcessing = false;
  autoResize = true;

  editOptions: ImageEditOptions = {
    maxWidth: this.maxWidth,
    maxHeight: this.maxHeight,
    maxSizeKB: this.maxSizeKB,
    quality: 0.85, // Qualité optimale pour WebP
    format: 'webp' // Format WebP par défaut
  };

  ngOnChanges(): void {
    if (this.show && this.originalFile) {
      this.loadOriginalImage();
    }
  }

  private loadOriginalImage(): void {
    if (!this.originalFile) return;

    this.originalImageUrl = URL.createObjectURL(this.originalFile);
    this.originalSize = this.originalFile.size;

    // Charger les dimensions de l'image originale
    const img = new Image();
    img.onload = () => {
      this.originalDimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      
      // Mettre à jour les options avec les dimensions max
      this.editOptions.maxWidth = this.maxWidth;
      this.editOptions.maxHeight = this.maxHeight;
      this.editOptions.maxSizeKB = this.maxSizeKB;
      
      // Générer l'aperçu initial
      this.updatePreview();
    };
    img.src = this.originalImageUrl;
  }

  updatePreview(): void {
    if (!this.originalFile) return;

    this.isProcessing = true;

    setTimeout(() => {
      this.processImage(this.originalFile!, this.editOptions)
        .then(result => {
          this.previewInfo = result;
          this.previewImageUrl = URL.createObjectURL(result.file);
          this.isProcessing = false;
        })
        .catch(error => {
          console.error('Erreur lors du traitement:', error);
          this.isProcessing = false;
        });
    }, 100);
  }

  private async processImage(file: File, options: ImageEditOptions): Promise<ImageEditResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculer les nouvelles dimensions (toujours automatique)
          let { width, height } = this.calculateNewDimensions(
            img.naturalWidth,
            img.naturalHeight,
            options.maxWidth,
            options.maxHeight,
            true // Toujours redimensionner automatiquement
          );

          // Ajuster la qualité automatiquement selon la taille cible
          let quality = this.calculateOptimalQuality(file.size, width * height);

          // Créer le canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'));
            return;
          }

          canvas.width = width;
          canvas.height = height;

          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir en blob avec compression
          const mimeType = `image/${options.format}`;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Erreur lors de la conversion'));
                return;
              }

              // Créer le nouveau fichier
              const newFileName = this.generateFileName(file.name, options.format);
              const newFile = new File([blob], newFileName, { type: mimeType });

              const result: ImageEditResult = {
                file: newFile,
                originalSize: file.size,
                newSize: blob.size,
                originalDimensions: {
                  width: img.naturalWidth,
                  height: img.naturalHeight
                },
                newDimensions: { width, height },
                compressionRatio: (file.size - blob.size) / file.size
              };

              resolve(result);
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private calculateNewDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    shouldResize: boolean
  ): { width: number; height: number } {
    if (!shouldResize) {
      return { width: originalWidth, height: originalHeight };
    }

    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
    
    if (ratio >= 1) {
      // L'image est déjà plus petite que les limites
      return { width: originalWidth, height: originalHeight };
    }

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  }

  private calculateOptimalQuality(originalSizeBytes: number, targetPixels: number): number {
    const maxSizeBytes = this.editOptions.maxSizeKB * 1024;
    
    // Si l'image originale est déjà petite, utiliser une qualité élevée
    if (originalSizeBytes <= maxSizeBytes * 0.5) {
      return 0.9;
    }
    
    // Si l'image est très grande, utiliser une qualité plus faible
    if (originalSizeBytes >= maxSizeBytes * 5) {
      return 0.7;
    }
    
    // Calculer la qualité basée sur le ratio taille/pixels
    const bytesPerPixel = originalSizeBytes / targetPixels;
    const targetBytesPerPixel = maxSizeBytes / targetPixels;
    
    // Qualité entre 0.75 et 0.9 selon le ratio
    const quality = Math.max(0.75, Math.min(0.9, targetBytesPerPixel / bytesPerPixel));
    
    return Math.round(quality * 10) / 10; // Arrondir à 1 décimale
  }

  private generateFileName(originalName: string, format: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const timestamp = Date.now();
    return `${nameWithoutExt}_edited_${timestamp}.${format}`;
  }

  applyChanges(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.previewInfo) {
      this.result.emit(this.previewInfo);
      this.cleanup();
    }
  }

  onCancel(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.cancel.emit();
    this.cleanup();
  }

  private cleanup(): void {
    if (this.originalImageUrl) {
      URL.revokeObjectURL(this.originalImageUrl);
    }
    if (this.previewImageUrl) {
      URL.revokeObjectURL(this.previewImageUrl);
    }
    this.originalImageUrl = '';
    this.previewImageUrl = '';
    this.previewInfo = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    if (bytes < k) return bytes + ' B';
    return (bytes / k).toFixed(1) + ' KB';
  }

  isOriginalSizeValid(): boolean {
    const maxSizeBytes = this.editOptions.maxSizeKB * 1024;
    return this.originalSize <= maxSizeBytes;
  }

  isOriginalDimensionsValid(): boolean {
    return this.originalDimensions.width <= this.editOptions.maxWidth &&
           this.originalDimensions.height <= this.editOptions.maxHeight;
  }
}
