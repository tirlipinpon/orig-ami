import { Component, EventEmitter, Input, OnInit, Output, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';
import { ImageUploadService } from '../../services/image-upload.service';
import { ImageEditorComponent, ImageEditResult } from '../image-editor/image-editor.component';

@Component({
  selector: 'app-item-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ImageEditorComponent],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css'
})
export class ItemForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private imageUploadService = inject(ImageUploadService);

  @Input() type: 'beneficiaire' | 'donateur' = 'beneficiaire';
  @Input() editingItem: Beneficiaire | null = null;
  
  @Output() save = new EventEmitter<BeneficiaireCreate>();
  @Output() cancel = new EventEmitter<void>();

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

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nom: [
        this.editingItem?.nom || '', 
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      url: [
        this.editingItem?.url || '', 
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)]
      ],
      image_url: [
        this.extractFilename(this.editingItem?.image_url || ''), 
        [Validators.required, Validators.pattern(/\.(jpg|jpeg|png|gif|svg|webp)$/i)]
      ],
      alt_text: [
        this.editingItem?.alt_text || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      title: [
        this.editingItem?.title || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      image_width: [
        this.editingItem?.image_width || 150, 
        [Validators.required, Validators.min(50), Validators.max(500)]
      ],
      ordre: [1], // Valeur par défaut, non utilisée avec le tri par date
      type: [this.type],
      actif: [this.editingItem?.actif ?? true]
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
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

      this.save.emit(data);
    } else if (!this.form.valid) {
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

    // Validation du fichier
    await this.uploadFile(file);
  }

  private async extractImageInfo(file: File): Promise<void> {
    try {
      // Informations de base
      const maxSize = 500 * 1024; // 500KB
      const maxWidth = 500;
      const maxHeight = 500;

      // Extraire le type de fichier lisible
      let fileType = 'Inconnu';
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') fileType = 'JPEG';
      else if (file.type === 'image/png') fileType = 'PNG';
      else if (file.type === 'image/webp') fileType = 'WebP';
      else if (file.type === 'image/svg+xml') fileType = 'SVG';
      else if (file.type === 'image/gif') fileType = 'GIF';

      // Obtenir les dimensions
      let width = 0;
      let height = 0;

      if (file.type !== 'image/svg+xml') {
        const img = new Image();
        const url = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          img.onload = () => {
            width = img.naturalWidth;
            height = img.naturalHeight;
            URL.revokeObjectURL(url);
            resolve(true);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Impossible de lire les dimensions'));
          };
          img.src = url;
        });
      }

      // Stocker les informations avec validation
      this.imageInfo = {
        type: fileType,
        size: file.size,
        width: width,
        height: height,
        sizeValid: file.size <= maxSize,
        widthValid: width === 0 || width <= maxWidth, // 0 pour SVG
        heightValid: height === 0 || height <= maxHeight // 0 pour SVG
      };
    } catch (error) {
      console.error('Erreur lors de l\'extraction des infos:', error);
      this.imageInfo = null;
    }
  }

  private async uploadFile(file: File): Promise<void> {
    this.isUploading = true;
    this.uploadError = '';
    this.uploadSuccess = false;

    try {
      const folder = this.type === 'beneficiaire' ? 'beneficiaire' : 'sponsors';
      const result = await this.imageUploadService.uploadImage(file, folder);

      if (result.success && result.fileName) {
        this.uploadedFileName = result.fileName;
        this.uploadSuccess = true;
        
        // Mettre à jour le formulaire avec le nom du fichier
        this.form.patchValue({
          image_url: result.fileName
        });
        this.form.get('image_url')?.markAsDirty();
        this.form.get('image_url')?.markAsTouched();

        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          this.uploadSuccess = false;
        }, 3000);
      } else {
        this.uploadError = result.error || 'Erreur lors de la validation';
        // Ne pas supprimer les informations de l'image pour qu'elles restent visibles
        // this.removeImage(); // Commenté pour garder les infos affichées
      }
    } catch (error: any) {
      this.uploadError = 'Erreur lors de la validation: ' + error.message;
      // Ne pas supprimer les informations de l'image pour qu'elles restent visibles
      // this.removeImage(); // Commenté pour garder les infos affichées
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
    if (bytes === 0) return '0 B';
    const k = 1024;
    if (bytes < k) return bytes + ' B';
    return (bytes / k).toFixed(1) + ' KB';
  }

  private autoFillAltTextAndTitle(): void {
    // Récupérer le nom du bénéficiaire/donateur
    const nom = this.form.get('nom')?.value;
    
    if (!nom || nom.trim() === '') {
      return; // Pas de nom disponible
    }

    // Formater le nom correctement (nettoyer les caractères spéciaux)
    const formattedNom = this.formatNomForAltText(nom);

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

  private formatNomForAltText(nom: string): string {
    // Nettoyer le nom : enlever les caractères spéciaux problématiques
    let formatted = nom.trim();
    
    // Remplacer les caractères spéciaux par des espaces ou les supprimer
    formatted = formatted
      .replace(/[<>\"'\/\\]/g, '') // Supprimer les caractères dangereux
      .replace(/[_-]+/g, ' ') // Remplacer underscores et tirets par des espaces
      .replace(/\s+/g, ' ') // Remplacer les espaces multiples par un seul
      .trim();
    
    return formatted;
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
    this.uploadFile(result.file);
    
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

