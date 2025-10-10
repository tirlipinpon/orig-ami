import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageProcessingService, ImageOptimizationResult } from '../../services/image-processing.service';
import { IMAGE_CONSTRAINTS, ImageFormat } from '../../constants/image-constraints.const';

export interface ImageEditResult {
  file: File;
  originalSize: number;
  newSize: number;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
  compressionRatio: number;
}

@Component({
  selector: 'app-image-editor',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="image-editor-modal" *ngIf="show()" (click)="onCancel($event)">
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
                      <span class="limit-text">(max: {{ maxSizeKB() }} KB)</span>
                    }
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">Dimensions :</span>
                  <span class="value" [class.invalid-value]="!isOriginalDimensionsValid()">
                    {{ originalDimensions.width }}×{{ originalDimensions.height }}px
                    @if (!isOriginalDimensionsValid()) {
                      <span class="limit-text">(max: {{ maxWidth() }}×{{ maxHeight() }} px)</span>
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
  private readonly imageProcessingService = inject(ImageProcessingService);

  // Modern Angular signals-based inputs/outputs
  show = input<boolean>(false);
  originalFile = input<File | null>(null);
  maxWidth = input<number>(IMAGE_CONSTRAINTS.MAX_WIDTH);
  maxHeight = input<number>(IMAGE_CONSTRAINTS.MAX_HEIGHT);
  maxSizeKB = input<number>(IMAGE_CONSTRAINTS.MAX_FILE_SIZE_KB);

  result = output<ImageEditResult>();
  cancel = output<void>();

  originalImageUrl = '';
  previewImageUrl = '';
  originalSize = 0;
  originalDimensions = { width: 0, height: 0 };
  previewInfo: ImageEditResult | null = null;
  isProcessing = false;
  autoResize = true;

  constructor() {
    // Use effect to react to input changes (replaces ngOnChanges)
    effect(() => {
      if (this.show() && this.originalFile()) {
        this.loadOriginalImage();
      }
    });
  }

  private async loadOriginalImage(): Promise<void> {
    const file = this.originalFile();
    if (!file) return;

    this.originalImageUrl = URL.createObjectURL(file);
    this.originalSize = file.size;

    try {
      // Charger les dimensions de l'image originale
      this.originalDimensions = await this.imageProcessingService.getImageDimensions(file);
      
      // Générer l'aperçu initial
      this.updatePreview();
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
    }
  }

  updatePreview(): void {
    const file = this.originalFile();
    if (!file) return;

    this.isProcessing = true;

    setTimeout(() => {
      this.imageProcessingService.optimizeImage(
        file,
        IMAGE_CONSTRAINTS.COMPRESSION.DEFAULT_FORMAT as ImageFormat
      )
        .then((result: ImageOptimizationResult) => {
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
    return this.imageProcessingService.formatFileSize(bytes);
  }

  isOriginalSizeValid(): boolean {
    return this.originalSize <= IMAGE_CONSTRAINTS.MAX_FILE_SIZE_BYTES;
  }

  isOriginalDimensionsValid(): boolean {
    return this.originalDimensions.width <= this.maxWidth() &&
           this.originalDimensions.height <= this.maxHeight();
  }
}
