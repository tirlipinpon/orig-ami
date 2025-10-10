import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';
import { ImageUploadService } from '../../services/image-upload.service';
import { ImageProcessingService } from '../../services/image-processing.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { IMAGE_CONSTRAINTS } from '../../constants/image-constraints.const';
import { ImageEditorComponent, ImageEditResult } from '../image-editor/image-editor.component';

@Component({
  selector: 'app-item-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ImageEditorComponent],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css'
})
export class ItemForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly imageUploadService = inject(ImageUploadService);
  private readonly imageProcessingService = inject(ImageProcessingService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Modern Angular signals-based inputs/outputs
  type = input<'beneficiaire' | 'donateur'>('beneficiaire');
  editingItem = input<Beneficiaire | null>(null);
  
  save = output<BeneficiaireCreate>();
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
  
  // Informations de l'image
  imageInfo: {
    type: string;
    size: number;
    width: number;
    height: number;
    sizeValid: boolean;
    widthValid: boolean;
    heightValid: boolean;
  } | null = null;

  // Éditeur d'image
  showImageEditor = false;
  imageToEdit: File | null = null;

  // Avant/Après optimisation
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

  constructor() {
    // Use effect to react to editingItem changes (replaces ngOnChanges)
    effect(() => {
      const item = this.editingItem();
      // Re-initialize form when editingItem changes
      this.initForm();
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const item = this.editingItem();
    this.form = this.fb.group({
      nom: [
        item?.nom || '', 
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      url: [
        item?.url || '', 
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)]
      ],
      image_url: [
        this.extractFilename(item?.image_url || ''), 
        [Validators.required, Validators.pattern(/\.(jpg|jpeg|png|gif|svg|webp)$/i)]
      ],
      alt_text: [
        item?.alt_text || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      title: [
        item?.title || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      image_width: [
        item?.image_width || 150, 
        [Validators.required, Validators.min(50), Validators.max(500)]
      ],
      ordre: [1], // Valeur par défaut, non utilisée avec le tri par date
      type: [this.type()],
      actif: [item?.actif ?? true]
    });
  }

  async onSubmit(): Promise<void> {
    console.log('🚀 [SUBMIT] Début de la soumission du formulaire');
    
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('✅ [SUBMIT] Formulaire valide, traitement en cours...');
      
      try {
        // Upload Supabase de l'image si un fichier a été sélectionné
        if (this.selectedFile) {
          console.log('📤 [SUPABASE] Upload de l\'image:', this.selectedFile.name);
          await this.uploadToSupabase(this.selectedFile);
          console.log('✅ [SUPABASE] Upload terminé avec succès');
        } else {
          console.log('ℹ️ [SUBMIT] Pas de nouvelle image à uploader');
        }
        
        const formValue = this.form.value;
        
        // Trim des valeurs texte
        const data: BeneficiaireCreate = {
          nom: formValue.nom.trim(),
          url: formValue.url.trim(),
          image_url: formValue.image_url.trim(),
          alt_text: formValue.alt_text.trim(),
          title: formValue.title.trim(),
          image_width: formValue.image_width,
          type: formValue.type,
          ordre: formValue.ordre,
          actif: formValue.actif
        };

        console.log('💾 [SUBMIT] Émission de l\'événement save');
        this.save.emit(data);
      } catch (error: unknown) {
        this.uploadError = this.errorHandler.handleErrorWithPrefix(
          'Submit Form', 
          error, 
          'Erreur lors de l\'upload de l\'image'
        );
        this.isSubmitting = false;
      }
    } else if (!this.form.valid) {
      console.warn('⚠️ [SUBMIT] Formulaire invalide');
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  resetSubmittingState(): void {
    this.isSubmitting = false;
  }

  /**
   * Détermine si le bouton de sauvegarde doit être désactivé
   */
  isSubmitDisabled(): boolean {
    return this.form.invalid || (this.editingItem() && !this.form.dirty) || this.isSubmitting;
  }

  ngOnDestroy(): void {
    // Libérer l'URL de prévisualisation pour éviter les fuites mémoire
    if (this.imagePreviewUrl) {
      this.imageUploadService.revokePreviewUrl(this.imagePreviewUrl);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.uploadError = '';
    this.uploadSuccess = false;

    // Pré-remplir alt_text et title avec le nom du bénéficiaire/donateur si vides
    this.autoFillAltTextAndTitle();

    // Extraire les informations de base du fichier
    await this.extractImageInfo(file);

    // Créer une prévisualisation locale immédiate
    if (this.imagePreviewUrl) {
      this.imageUploadService.revokePreviewUrl(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = this.imageUploadService.createPreviewUrl(file);

    // Validation seulement (l'upload se fera au clic sur Créer/Éditer)
    await this.validateFile(file);
  }

  private async extractImageInfo(file: File): Promise<void> {
    try {
      this.imageInfo = await this.imageProcessingService.extractImageInfo(file);
    } catch (error) {
      console.error('Erreur lors de l\'extraction des infos:', error);
      this.imageInfo = null;
    }
  }

  /**
   * Validation seule (sans upload)
   */
  private async validateFile(file: File, isRetry: boolean = false): Promise<void> {
    console.log('🔍 [VALIDATION] Validation du fichier:', file.name);
  
    this.isUploading = true;
    this.uploadError = '';
    this.uploadSuccess = false;
    
    // Ne pas réinitialiser les infos avant/après si c'est un retry après optimisation
    if (!isRetry) {
      this.originalImageInfo = null;
      this.optimizedImageInfo = null;
    }

    try {
      // Validation seulement, pas d'upload
      const result = await this.imageUploadService.validateImageOnly(file);

      if (result.success && result.fileName) {
        this.uploadedFileName = result.fileName;
        this.uploadSuccess = true;
        
        // Mettre à jour le formulaire avec le nom du fichier
        const imageControl = this.form.get('image_url');
        if (imageControl) {
          imageControl.setValue(result.fileName);
          imageControl.markAsDirty();
          imageControl.markAsTouched();
          imageControl.updateValueAndValidity();
        }
        this.form.markAsDirty(); // Marquer tout le formulaire comme modifié
        console.log('✅ [VALIDATION] Image validée et image_url mis à jour:', imageControl?.value);

        // Masquer le message de succès et l'avant/après après 5 secondes
        setTimeout(() => {
          this.uploadSuccess = false;
          // Nettoyer l'avant/après après succès
          if (isRetry) {
            setTimeout(() => {
              this.originalImageInfo = null;
              this.optimizedImageInfo = null;
            }, 2000); // Garder visible 2 secondes de plus pour que l'utilisateur voie
          }
        }, 3000);
      } else {
        // Image non conforme - optimiser automatiquement seulement si ce n'est pas déjà un retry
        if (!isRetry) {
          this.uploadError = result.error || 'Erreur lors de la validation';
          
          // Sauvegarder les infos de l'image originale
          if (this.imageInfo) {
            this.originalImageInfo = {
              type: this.imageInfo.type,
              size: this.imageInfo.size,
              width: this.imageInfo.width,
              height: this.imageInfo.height
            };
          }

          // Lancer l'optimisation automatique
          await this.autoOptimizeImage(file);
        } else {
          // Si même après optimisation ça échoue, afficher l'erreur
          this.uploadError = result.error || 'Erreur lors de la validation après optimisation';
        }
      }
    } catch (error: unknown) {
      this.uploadError = this.errorHandler.handleErrorWithPrefix(
        'Validate File', 
        error, 
        'Erreur lors de la validation'
      );
    } finally {
      this.isUploading = false;
    }
  }

  /**
   * Upload l'image vers Supabase Storage
   */
  private async uploadToSupabase(file: File): Promise<void> {
    console.log('🚀 [UPLOAD-SUPABASE] Début upload vers Supabase');
    
    this.isUploading = true;
    this.uploadError = '';
    
    try {
      const folder = this.type() === 'beneficiaire' 
        ? IMAGE_CONSTRAINTS.STORAGE_FOLDERS.BENEFICIAIRE 
        : IMAGE_CONSTRAINTS.STORAGE_FOLDERS.SPONSORS;
      const itemName = this.form.get('nom')?.value || '';
      
      // Si on édite un item et qu'il avait déjà une image, la supprimer d'abord
      const item = this.editingItem();
      if (item && item.image_url) {
        console.log('🗑️ [UPLOAD-SUPABASE] Suppression ancienne image:', item.image_url);
        await this.imageUploadService.deleteImage(item.image_url, folder);
      }
      
      // Upload la nouvelle image avec le nom de l'item
      const result = await this.imageUploadService.uploadImage(file, folder, itemName);
      
      if (result.success && result.fileName) {
        console.log('✅ [UPLOAD-SUPABASE] Upload réussi:', result.fileName);
        
        // Mettre à jour le formulaire avec le nom du fichier
        this.form.patchValue({
          image_url: result.fileName
        });
        this.form.get('image_url')?.markAsDirty();
        this.form.get('image_url')?.markAsTouched();
      } else {
        console.error('❌ [UPLOAD-SUPABASE] Échec:', result.error);
        throw new Error(result.error || 'Erreur upload Supabase');
      }
    } catch (error: unknown) {
      const errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Upload Supabase', 
        error, 
        'Erreur upload Supabase'
      );
      throw new Error(errorMessage);
    } finally {
      this.isUploading = false;
    }
  }

  removeImage(): void {
    // Libérer l'URL de prévisualisation
    if (this.imagePreviewUrl) {
      this.imageUploadService.revokePreviewUrl(this.imagePreviewUrl);
      this.imagePreviewUrl = '';
    }

    // Réinitialiser les variables
    this.selectedFile = null;
    this.selectedFileName = '';
    this.uploadedFileName = '';
    this.uploadError = '';
    this.uploadSuccess = false;
    this.imageInfo = null;

    // Vider le champ du formulaire
    this.form.patchValue({
      image_url: ''
    });
    this.form.get('image_url')?.markAsDirty();
    this.form.get('image_url')?.markAsTouched();
  }

  // Méthode pour forcer la suppression en cas d'erreur critique
  private forceRemoveImage(): void {
    this.removeImage();
  }

  // Méthodes utilitaires pour l'affichage
  formatFileSize(bytes: number): string {
    return this.imageProcessingService.formatFileSize(bytes);
  }

  private autoFillAltTextAndTitle(): void {
    // Récupérer le nom du bénéficiaire/donateur
    const nom = this.form.get('nom')?.value;
    
    if (!nom || nom.trim() === '') {
      return; // Pas de nom disponible
    }

    // Formater le nom correctement (nettoyer les caractères spéciaux)
    const formattedNom = this.imageProcessingService.formatNameForAltText(nom);

    // Pré-remplir alt_text si vide
    if (!this.form.get('alt_text')?.value) {
      this.form.patchValue({
        alt_text: `Logo ${formattedNom}`
      });
    }

    // Pré-remplir title si vide
    if (!this.form.get('title')?.value) {
      this.form.patchValue({
        title: formattedNom
      });
    }
  }

  // Méthodes pour l'éditeur d'image
  openImageEditor(): void {
    if (this.selectedFile) {
      this.imageToEdit = this.selectedFile;
      this.showImageEditor = true;
    }
  }

  onImageEditResult(result: ImageEditResult): void {
    // Remplacer le fichier original par le fichier édité
    this.selectedFile = result.file;
    this.selectedFileName = result.file.name;
    
    // Pré-remplir alt_text et title avec le nom du bénéficiaire/donateur si vides
    this.autoFillAltTextAndTitle();
    
    // Mettre à jour les informations de l'image
    this.updateImageInfo(result.file);
    
    // Mettre à jour la prévisualisation
    if (this.imagePreviewUrl) {
      this.imageUploadService.revokePreviewUrl(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = this.imageUploadService.createPreviewUrl(result.file);
    
    // Mettre à jour le formulaire
    this.form.patchValue({
      image_url: result.file.name
    });
    this.form.get('image_url')?.markAsDirty();
    this.form.get('image_url')?.markAsTouched();
    
    // Valider la nouvelle image
    this.validateFile(result.file);
    
    this.showImageEditor = false;
    this.imageToEdit = null;
  }

  onImageEditCancel(): void {
    this.showImageEditor = false;
    this.imageToEdit = null;
  }

  private updateImageInfo(file: File): void {
    // Cette méthode sera appelée pour mettre à jour imageInfo avec le nouveau fichier
    this.extractImageInfo(file);
  }

  canEditImage(): boolean {
    return !!(this.selectedFile && this.imageInfo && (!this.imageInfo.sizeValid || !this.imageInfo.widthValid || !this.imageInfo.heightValid));
  }

  private async autoOptimizeImage(file: File): Promise<void> {
    this.isAutoOptimizing = true;

    try {
      // Utiliser le service d'optimisation d'image
      const result = await this.imageProcessingService.optimizeImage(file);

      // Remplacer le fichier
      this.selectedFile = result.file;
      this.selectedFileName = result.file.name;

      // Extraire les infos de l'image optimisée
      await this.extractImageInfo(result.file);

      // Sauvegarder les infos de l'image optimisée
      if (this.imageInfo) {
        this.optimizedImageInfo = {
          type: this.imageInfo.type,
          size: this.imageInfo.size,
          width: this.imageInfo.width,
          height: this.imageInfo.height
        };
      }

      // Mettre à jour la prévisualisation
      if (this.imagePreviewUrl) {
        this.imageUploadService.revokePreviewUrl(this.imagePreviewUrl);
      }
      this.imagePreviewUrl = this.imageUploadService.createPreviewUrl(result.file);

      // Valider la nouvelle image (avec flag isRetry à true)
      await this.validateFile(result.file, true);
    } catch (error) {
      console.error('Erreur lors de l\'optimisation automatique:', error);
      this.uploadError = 'Erreur lors de l\'optimisation automatique de l\'image';
    } finally {
      this.isAutoOptimizing = false;
    }
  }

  private extractFilename(fullUrl: string): string {
    if (!fullUrl) return '';
    
    // Après migration, la DB ne contient que le nom de fichier
    // Mais on garde la logique pour les cas où il y aurait encore des chemins
    if (!fullUrl.includes('/')) return fullUrl;
    
    // Extraire le nom du fichier de l'URL complète ou du chemin relatif
    return fullUrl.split('/').pop() || '';
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Ce champ est obligatoire';
    }
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    }
    if (control.errors['pattern']) {
      if (controlName === 'url') {
        return 'L\'URL doit commencer par http:// ou https://';
      }
      if (controlName === 'image_url') {
        return 'Extension invalide (.jpg, .png, .gif, .svg, .webp)';
      }
    }
    if (control.errors['min']) {
      return `Minimum ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `Maximum ${control.errors['max'].max}`;
    }

    return 'Valeur invalide';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isFieldValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}

