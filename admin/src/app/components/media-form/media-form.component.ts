import { Component, OnInit, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Media, MediaCreate } from '../../models/media.model';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-media-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './media-form.component.html',
  styleUrl: './media-form.component.css'
})
export class MediaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly errorHandler = inject(ErrorHandlerService);

  // Modern Angular signals-based inputs/outputs
  categorie = input<'belgique' | 'international' | 'neerlandais'>('belgique');
  editingMedia = input<Media | null>(null);
  
  save = output<MediaCreate>();
  cancel = output<void>();

  form!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor() {
    // Use effect to react to editingMedia changes
    effect(() => {
      const media = this.editingMedia();
      this.initForm();
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const media = this.editingMedia();
    this.form = this.fb.group({
      titre: [
        media?.titre || '', 
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      url: [
        media?.url || '', 
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)]
      ],
      categorie: [media?.categorie || this.categorie()],
      date_publication: [media?.date_publication || ''],
      ordre: [1], // Valeur par défaut
      actif: [media?.actif ?? true]
    });
  }

  async onSubmit(): Promise<void> {
    console.log('🚀 [SUBMIT] Début de la soumission du formulaire média');
    
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      console.log('✅ [SUBMIT] Formulaire valide, traitement en cours...');
      
      try {
        const formValue = this.form.value;
        
        const data: MediaCreate = {
          titre: formValue.titre.trim(),
          url: formValue.url.trim(),
          categorie: formValue.categorie,
          date_publication: formValue.date_publication || undefined,
          ordre: formValue.ordre,
          actif: formValue.actif
        };

        console.log('💾 [SUBMIT] Émission de l\'événement save');
        this.save.emit(data);
      } catch (error: unknown) {
        this.errorMessage = this.errorHandler.handleErrorWithPrefix(
          'Submit Media Form', 
          error, 
          'Erreur lors de la soumission du média'
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

  isSubmitDisabled(): boolean {
    return this.form.invalid || (this.editingMedia() && !this.form.dirty) || this.isSubmitting;
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

