import { Component, OnInit, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carousel, CarouselCreate } from '../../models/carousel.model';
import { ImageUploadService } from '../../services/image-upload.service';
import { ImageProcessingService } from '../../services/image-processing.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { IMAGE_CONSTRAINTS } from '../../constants/image-constraints.const';
import { ImageEditorComponent, ImageEditResult } from '../image-editor/image-editor.component';

@Component({
  selector: 'app-carousel-form',
  imports: [CommonModule, ReactiveFormsModule, ImageEditorComponent],
  templateUrl: './carousel-form.component.html',
  styleUrl: './carousel-form.component.css'
})
export class CarouselFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly imageUploadService = inject(ImageUploadService);
  private readonly imageProcessingService = inject(ImageProcessingService);
  private readonly errorHandler = inject(ErrorHandlerService);

  editingSlide = input<Carousel | null>(null);
  save = output<CarouselCreate>();
  cancel = output<void>();

  form!: FormGroup;
  isSubmitting = false;
  isUploading = false;
  uploadError = '';
  uploadSuccess = false;
  
  selectedFile: File | null = null;
  selectedFileName = '';
  imagePreviewUrl = '';
  uploadedFileName = '';
  
  imageInfo: {
    type: string;
    size: number;
    width: number;
    height: number;
    sizeValid: boolean;
    widthValid: boolean;
    heightValid: boolean;
  } | null = null;

  showImageEditor = false;
  imageToEdit: File | null = null;

  originalImageInfo: {
    type: string;
    size: number;
    width: number;
    height: number;
  } | null = null;
  
  optimizedImageInfo: {
    type: string;
    size: number;
    width: number;
    height: number;
  } | null = null;
  
  isAutoOptimizing = false;

  // Hauteur cible pour le carousel
  readonly TARGET_HEIGHT = 600;

  constructor() {
    effect(() => {
      const slide = this.editingSlide();
      this.initForm();
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const slide = this.editingSlide();
    this.form = this.fb.group({
      image_url: [
        this.extractFilename(slide?.image_url || ''), 
        [Validators.required]
      ],
      ordre: [slide?.ordre || 1]
    });
  }

  private extractFilename(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }
    if (url.startsWith('img/')) {
      return url.split('/').pop() || '';
    }
    return url;
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && !this.isSubmitting && this.uploadSuccess) {
      this.isSubmitting = true;
      
      try {
        const formValue = this.form.value;
        const timestamp = Date.now();
        
        const data: CarouselCreate = {
          titre: `orig-ami-${timestamp}`,
          image_url: formValue.image_url.trim(),
          alt_text: `ORIG-AMI Carousel Image ${timestamp}`,
          ordre: formValue.ordre,
          actif: true
        };

        this.save.emit(data);
        this.resetForm();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        this.uploadError = 'Erreur lors de la sauvegarde du slide';
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!this.validateFile(file)) {
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string;
        await this.analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  }

  private validateFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.type)) {
      this.uploadError = 'Type de fichier non supporté. Utilisez JPG, PNG, WEBP, GIF ou SVG.';
      return false;
    }
    
    return true;
  }

  private async analyzeImage(file: File): Promise<void> {
    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        img.onload = async () => {
          const isWebP = file.type === 'image/webp';
          const sizeValid = file.size <= IMAGE_CONSTRAINTS.MAX_FILE_SIZE_BYTES;
          const heightValid = img.height === this.TARGET_HEIGHT;
          
          this.imageInfo = {
            type: file.type,
            size: file.size,
            width: img.width,
            height: img.height,
            sizeValid,
            widthValid: true,
            heightValid
          };

          // Auto-optimiser si nécessaire
          if (!isWebP || !sizeValid || !heightValid) {
            await this.autoOptimizeImage(file, img);
          } else {
            // Image déjà optimale, uploader directement
            await this.uploadToSupabase(file);
          }
        };
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
    }
  }

  private async autoOptimizeImage(file: File, img: HTMLImageElement): Promise<void> {
    this.isAutoOptimizing = true;
    this.uploadError = '';
    
    try {
      this.originalImageInfo = {
        type: file.type,
        size: file.size,
        width: img.width,
        height: img.height
      };

      // Calculer la largeur proportionnelle pour maintenir le ratio
      const aspectRatio = img.width / img.height;
      const targetWidth = Math.round(this.TARGET_HEIGHT * aspectRatio);

      const optimizedFile = await this.imageProcessingService.resizeAndCompress(
        file,
        targetWidth,
        this.TARGET_HEIGHT,
        'webp',
        IMAGE_CONSTRAINTS.COMPRESSION.DEFAULT_QUALITY
      );

      this.optimizedImageInfo = {
        type: 'image/webp',
        size: optimizedFile.size,
        width: targetWidth,
        height: this.TARGET_HEIGHT
      };

      this.selectedFile = optimizedFile;
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(optimizedFile);

      await this.analyzeImage(optimizedFile);
      
      // Upload automatiquement après optimisation
      await this.uploadToSupabase(optimizedFile);
      
    } catch (error) {
      console.error('Erreur lors de l\'optimisation automatique:', error);
      this.uploadError = 'Erreur lors de l\'optimisation de l\'image';
    } finally {
      this.isAutoOptimizing = false;
    }
  }

  openImageEditor(): void {
    if (this.selectedFile) {
      this.imageToEdit = this.selectedFile;
      this.showImageEditor = true;
    }
  }

  async onImageEdited(result: ImageEditResult): Promise<void> {
    this.showImageEditor = false;
    this.imageToEdit = null;
    
    if (result.file) {
      this.selectedFile = result.file;
      this.selectedFileName = result.file.name;
      
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string;
        await this.analyzeImage(result.file!);
      };
      reader.readAsDataURL(result.file);
    }
  }

  onImageEditorCancel(): void {
    this.showImageEditor = false;
    this.imageToEdit = null;
  }

  private async uploadToSupabase(file: File): Promise<void> {
    this.isUploading = true;
    this.uploadError = '';
    this.uploadSuccess = false;

    try {
      const result = await this.imageUploadService.uploadImage(
        file,
        IMAGE_CONSTRAINTS.STORAGE_FOLDERS.CAROUSEL,
        undefined,
        true // skipDimensionValidation = true pour le carousel
      );
      
      if (result.success && result.fileName) {
        this.uploadedFileName = result.fileName;
        this.form.patchValue({ image_url: result.fileName });
        this.uploadSuccess = true;
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      this.uploadError = error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image';
      throw error;
    } finally {
      this.isUploading = false;
    }
  }

  removeSelectedImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreviewUrl = '';
    this.imageInfo = null;
    this.originalImageInfo = null;
    this.optimizedImageInfo = null;
    
    const fileInput = document.getElementById('image-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onCancelClick(): void {
    this.resetForm();
    this.cancel.emit();
  }

  private resetForm(): void {
    this.form.reset({
      image_url: '',
      ordre: 1
    });
    this.removeSelectedImage();
    this.uploadError = '';
    this.uploadSuccess = false;
  }

  formatFileSize(bytes: number): string {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

  ngOnDestroy(): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }
}

