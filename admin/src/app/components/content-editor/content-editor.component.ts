import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentBlock, ContentBlockUpdate } from '../../models/content-block.model';

declare var Quill: any;

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class ContentEditorComponent implements OnInit, OnDestroy {
  @Input() contentBlock!: ContentBlock;
  @Input() language!: string;
  @Output() save = new EventEmitter<ContentBlockUpdate>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editor', { static: true }) editorElement!: ElementRef;

  editorForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl('')
  });

  private quill: any;
  private isInitialized = false;
  private escapeListener: ((event: KeyboardEvent) => void) | null = null;

  ngOnInit(): void {
    this.initializeEditor();
    this.setFormValues();
    this.setupKeyboardListeners();
    this.disableBodyScroll();
  }

  ngOnDestroy(): void {
    if (this.quill) {
      this.quill = null;
    }
    this.removeKeyboardListeners();
    this.enableBodyScroll();
  }

  private setupKeyboardListeners(): void {
    this.escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.onCancel();
      }
    };
    document.addEventListener('keydown', this.escapeListener);
  }

  private removeKeyboardListeners(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
      this.escapeListener = null;
    }
  }

  private disableBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = '';
  }

  private initializeEditor(): void {
    if (this.isInitialized) return;

    // Configuration de Quill
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ];

    this.quill = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Saisissez votre contenu...'
    });

    // Écouter les changements
    this.quill.on('text-change', () => {
      this.editorForm.patchValue({
        content: this.quill.root.innerHTML
      });
    });

    this.isInitialized = true;
  }

  private setFormValues(): void {
    this.editorForm.patchValue({
      title: this.contentBlock.title,
      content: this.contentBlock.content
    });

    if (this.quill) {
      this.quill.root.innerHTML = this.contentBlock.content;
    }
  }

  onSubmit(): void {
    if (this.editorForm.valid) {
      const formValue = this.editorForm.value;
      const update: ContentBlockUpdate = {
        title: formValue.title || '',
        content: formValue.content || ''
      };
      
      this.save.emit(update);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getLanguageName(): string {
    const languageNames: { [key: string]: string } = {
      'fr': 'Français',
      'en': 'English',
      'nl': 'Nederlands'
    };
    return languageNames[this.language] || this.language.toUpperCase();
  }
}
