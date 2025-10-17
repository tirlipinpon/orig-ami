import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentBlock, ContentBlockUpdate } from '../../models/content-block.model';

declare var tinymce: any;

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

  editorId: string = '';
  private isInitialized = false;
  private escapeListener: ((event: KeyboardEvent) => void) | null = null;

  ngOnInit(): void {
    this.editorId = `tinymce-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated editor ID:', this.editorId);
    
    // Attendre que le modal soit complètement rendu et visible
    setTimeout(() => {
      this.initializeEditor();
    }, 300); // Délai plus long pour le modal
    
    this.setupKeyboardListeners();
    this.disableBodyScroll();
  }

  ngOnDestroy(): void {
    if (tinymce && this.editorId && tinymce.get(this.editorId)) {
      tinymce.get(this.editorId).remove();
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
    if (this.isInitialized) {
      console.log('TinyMCE already initialized, skipping...');
      return;
    }

    // Vérifier que TinyMCE est disponible
    if (typeof tinymce === 'undefined') {
      console.error('TinyMCE is not loaded');
      return;
    }

    // Attendre que l'élément textarea soit disponible dans le DOM et visible
    const initTinyMCE = () => {
      const element = document.getElementById(this.editorId);
      if (!element) {
        console.log('Textarea element not found, retrying...');
        setTimeout(initTinyMCE, 100);
        return;
      }

      // Vérifier que l'élément est visible (pas dans un modal caché)
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.log('Textarea element not visible yet, retrying...');
        setTimeout(initTinyMCE, 100);
        return;
      }

      console.log('Found visible textarea element, initializing TinyMCE...');

      // Configuration de TinyMCE
      tinymce.init({
        selector: `#${this.editorId}`,
        height: 400,
        base_url: 'https://unpkg.com/tinymce@6/',
        suffix: '.min',
        theme: 'silver',
        plugins: [
          'lists', 'link', 'charmap', 'wordcount'
        ],
        toolbar: [
          'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify',
          'bullist numlist outdent indent | link | removeformat'
        ].join(' | '),
        menubar: false,
        branding: false,
        statusbar: false,
        resize: false,
        setup: (editor: any) => {
          // Charger le contenu dès que l'éditeur est prêt
          editor.on('init', () => {
            console.log('TinyMCE editor initialized, setting content...');
            // Mettre à jour le formulaire avec le titre
            this.setFormValues();
            // Attendre un peu pour s'assurer que l'éditeur est complètement prêt
            setTimeout(() => {
              try {
                const content = this.contentBlock.content || '';
                console.log('Setting content:', content);
                editor.setContent(content);
              } catch (error) {
                console.error('Error setting content:', error);
              }
            }, 100);
          });

          // Écouter les changements
          editor.on('input change undo redo', () => {
            this.editorForm.patchValue({
              content: editor.getContent()
            });
          });
        }
      }).then(() => {
        this.isInitialized = true;
        console.log('TinyMCE initialized successfully');
      }).catch((error: any) => {
        console.error('TinyMCE initialization failed:', error);
      });
    };

    // Démarrer l'initialisation
    initTinyMCE();
  }

  private setFormValues(): void {
    // Mettre à jour le titre et le contenu initial
    this.editorForm.patchValue({
      title: this.contentBlock.title,
      content: this.contentBlock.content
    });
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

  // Méthode pour forcer le rechargement du contenu
  public refreshContent(): void {
    if (tinymce && this.editorId && tinymce.get(this.editorId)) {
      const editor = tinymce.get(this.editorId);
      if (editor) {
        console.log('Refreshing TinyMCE content...');
        editor.setContent(this.contentBlock.content);
      }
    }
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
