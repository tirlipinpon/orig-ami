import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockGroup } from '../../models/content-block.model';

@Component({
  selector: 'app-content-block-card',
  templateUrl: './content-block-card.component.html',
  styleUrls: ['./content-block-card.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ContentBlockCardComponent {
  @Input() contentGroup!: ContentBlockGroup;
  @Output() edit = new EventEmitter<{blockKey: string, language: string}>();

  onEdit(blockKey: string, language: string): void {
    this.edit.emit({ blockKey, language });
  }

  getOrdre(): number {
    return this.contentGroup.fr?.ordre || this.contentGroup.en?.ordre || this.contentGroup.nl?.ordre || 0;
  }

  getBlockDisplayName(blockKey: string): string {
    const displayNames: { [key: string]: string } = {
      'what_is_it': 'De quoi s\'agit-il ?',
      'solidarity_gesture': 'Un geste de solidarité',
      'why_origami': 'Pourquoi des ORIG-AMI ?',
      'partners': 'Partenaires',
      'emergency_action': 'ORIG-AMI une action d\'urgence'
    };
    return displayNames[blockKey] || blockKey;
  }

  getLanguageName(language: string): string {
    const languageNames: { [key: string]: string } = {
      'fr': 'Français',
      'en': 'English', 
      'nl': 'Nederlands'
    };
    return languageNames[language] || language.toUpperCase();
  }

  getLanguageFlag(language: string): string {
    const flags: { [key: string]: string } = {
      'fr': '🇫🇷',
      'en': '🇬🇧',
      'nl': '🇳🇱'
    };
    return flags[language] || '🌐';
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (!content) return 'Aucun contenu';
    
    // Supprimer les balises HTML pour l'aperçu
    const textContent = content.replace(/<[^>]*>/g, '');
    
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    return textContent.substring(0, maxLength) + '...';
  }
}
