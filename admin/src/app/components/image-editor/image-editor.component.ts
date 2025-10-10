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
  templateUrl: './image-editor.component.html',
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
