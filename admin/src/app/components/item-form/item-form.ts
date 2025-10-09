import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-item-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css'
})
export class ItemForm implements OnInit {
  private fb = inject(FormBuilder);

  @Input() type: 'beneficiaire' | 'donateur' = 'beneficiaire';
  @Input() editingItem: Beneficiaire | null = null;
  
  @Output() save = new EventEmitter<BeneficiaireCreate>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = false;

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
        this.editingItem?.image_width || 200, 
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

