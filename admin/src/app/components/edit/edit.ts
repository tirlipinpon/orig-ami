import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Sortable from 'sortablejs';
import { Auth } from '../../services/auth';
import { BeneficiaireService } from '../../services/beneficiaire';
import { MediaService } from '../../services/media.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';
import { Media, MediaCreate } from '../../models/media.model';
import { ItemForm } from '../item-form/item-form';
import { ItemCardComponent } from '../item-card/item-card.component';
import { MediaFormComponent } from '../media-form/media-form.component';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, ItemForm, ItemCardComponent, MediaFormComponent, MediaCardComponent],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly beneficiaireService = inject(BeneficiaireService);
  private readonly mediaService = inject(MediaService);
  private readonly errorHandler = inject(ErrorHandlerService);
  
  userEmail: string | null = '';
  isLoggingOut: boolean = false;
  
  // Données
  beneficiaires: Beneficiaire[] = [];
  donateurs: Beneficiaire[] = [];
  mediasBelgique: Media[] = [];
  mediasNeerlandais: Media[] = [];
  mediasInternational: Media[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  showBeneficiaireForm: boolean = false;
  showDonateurForm: boolean = false;
  showMediaForm: boolean = false;
  editingItem: Beneficiaire | null = null;
  editingMedia: Media | null = null;
  formType: 'beneficiaire' | 'donateur' = 'beneficiaire';
  mediaFormCategorie: 'belgique' | 'neerlandais' | 'international' = 'belgique';

  activeTab: 'beneficiaires' | 'donateurs' | 'medias' = 'beneficiaires';

  @ViewChild('beneficiairesGrid', { static: false }) beneficiairesGrid!: ElementRef;
  @ViewChild('donateursGrid', { static: false }) donateursGrid!: ElementRef;
  @ViewChild('mediasBelgiqueGrid', { static: false }) mediasBelgiqueGrid!: ElementRef;
  @ViewChild('mediasNeerlandaisGrid', { static: false }) mediasNeerlandaisGrid!: ElementRef;
  @ViewChild('mediasInternationalGrid', { static: false }) mediasInternationalGrid!: ElementRef;
  @ViewChild('beneficiaireForm', { static: false }) beneficiaireForm!: ItemForm;
  @ViewChild('donateurForm', { static: false }) donateurForm!: ItemForm;
  @ViewChild('mediaForm', { static: false }) mediaForm!: MediaFormComponent;
  private beneficiairesSortable?: Sortable;
  private donateursSortable?: Sortable;
  private mediasBelgiqueSortable?: Sortable;
  private mediasNeerlandaisSortable?: Sortable;
  private mediasInternationalSortable?: Sortable;
  
  // Sous-onglet pour les médias
  activeMediaTab: 'belgique' | 'neerlandais' | 'international' = 'belgique';

  async ngOnInit(): Promise<void> {
    this.userEmail = this.authService.getUserEmail();
    
    // S'abonner aux changements d'utilisateur (avec nettoyage automatique)
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.userEmail = user?.email ?? null;
      });

    await this.loadData();
    
    // Migration automatique : réinitialiser les ordres (à exécuter une seule fois)
    // await this.resetOrdresAutoIncrement();
  }

  private async resetOrdresAutoIncrement(): Promise<void> {
    try {
      console.log('Réinitialisation des ordres...');
      
      // Récupérer tous les bénéficiaires triés par ordre actuel (croissant)
      const allBeneficiaires = await this.beneficiaireService.getByType('beneficiaire');
      const sortedBenef = [...allBeneficiaires].sort((a, b) => a.ordre - b.ordre);
      
      // Réattribuer les ordres en gardant l'ordre existant
      for (let i = 0; i < sortedBenef.length; i++) {
        await this.beneficiaireService.updateOrdre(sortedBenef[i].id!, i + 1);
      }
      
      // Pareil pour les donateurs
      const allDonateurs = await this.beneficiaireService.getByType('donateur');
      const sortedDon = [...allDonateurs].sort((a, b) => a.ordre - b.ordre);
      
      for (let i = 0; i < sortedDon.length; i++) {
        await this.beneficiaireService.updateOrdre(sortedDon[i].id!, i + 1);
      }
      
      console.log('Ordres réinitialisés avec succès !');
      await this.loadData();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }

  ngAfterViewInit(): void {
    // Initialiser SortableJS après que la vue soit prête
    setTimeout(() => {
      this.initializeSortable();
    }, 500);
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.beneficiaires = await this.beneficiaireService.getByType('beneficiaire');
      this.donateurs = await this.beneficiaireService.getByType('donateur');
      this.mediasBelgique = await this.mediaService.getByCategorie('belgique');
      this.mediasNeerlandais = await this.mediaService.getByCategorie('neerlandais');
      this.mediasInternational = await this.mediaService.getByCategorie('international');
      
      // Réinitialiser SortableJS après le chargement des données
      setTimeout(() => {
        this.initializeSortable();
      }, 200);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Load Data', 
        error, 
        'Erreur lors du chargement des données'
      );
    } finally {
      this.isLoading = false;
    }
  }

  switchTab(tab: 'beneficiaires' | 'donateurs' | 'medias'): void {
    this.activeTab = tab;
    this.cancelEdit();
    
    // Réinitialiser SortableJS après le changement d'onglet
    setTimeout(() => {
      this.initializeSortable();
    }, 100);
  }

  switchMediaTab(tab: 'belgique' | 'neerlandais' | 'international'): void {
    this.activeMediaTab = tab;
    this.cancelEdit();
    
    // Réinitialiser SortableJS après le changement de sous-onglet
    setTimeout(() => {
      this.initializeSortable();
    }, 100);
  }


  openAddForm(type: 'beneficiaire' | 'donateur'): void {
    this.editingItem = null;
    this.formType = type;
    
    if (type === 'beneficiaire') {
      this.showBeneficiaireForm = true;
    } else {
      this.showDonateurForm = true;
    }
  }

  openAddMediaForm(categorie: 'belgique' | 'neerlandais' | 'international'): void {
    this.editingMedia = null;
    this.mediaFormCategorie = categorie;
    this.showMediaForm = true;
  }

  editItem(item: Beneficiaire): void {
    this.editingItem = item;
    this.formType = item.type;
    
    if (item.type === 'beneficiaire') {
      this.showBeneficiaireForm = true;
    } else {
      this.showDonateurForm = true;
    }
  }

  editMedia(media: Media): void {
    this.editingMedia = media;
    this.mediaFormCategorie = media.categorie;
    this.showMediaForm = true;
  }

  cancelEdit(): void {
    this.showBeneficiaireForm = false;
    this.showDonateurForm = false;
    this.showMediaForm = false;
    this.editingItem = null;
    this.editingMedia = null;
    this.errorMessage = '';
    this.successMessage = '';
    // Réinitialiser l'état de soumission des formulaires
    this.resetFormSubmittingState();
  }

  private resetFormSubmittingState(): void {
    if (this.beneficiaireForm) {
      this.beneficiaireForm.resetSubmittingState();
    }
    if (this.donateurForm) {
      this.donateurForm.resetSubmittingState();
    }
    if (this.mediaForm) {
      this.mediaForm.resetSubmittingState();
    }
  }

  async onFormSave(data: BeneficiaireCreate): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      if (this.editingItem) {
        // Mise à jour : exclure l'ordre pour conserver la position actuelle
        const { ordre, ...updateData } = data;
        
        const updatedItem = await this.beneficiaireService.update(this.editingItem.id!, updateData);
        
        // Mettre à jour l'élément dans la liste locale avec l'élément complet retourné par le service
        const targetArray = data.type === 'beneficiaire' ? this.beneficiaires : this.donateurs;
        const index = targetArray.findIndex(item => item.id === this.editingItem!.id);
        if (index !== -1) {
          targetArray[index] = updatedItem; // Utiliser l'élément complet avec URL complète
        }
        
        this.successMessage = 'Élément mis à jour avec succès !';
      } else {
        // Nouveau : trouver le max et ajouter +1
        const items = data.type === 'beneficiaire' ? this.beneficiaires : this.donateurs;
        const maxOrdre = items.length > 0 ? Math.max(...items.map(i => i.ordre)) : 0;
        data.ordre = maxOrdre + 1; // Auto-incrément !
        
        const newItem = await this.beneficiaireService.create(data);
        
        // Ajouter le nouvel élément au début de la liste locale
        if (data.type === 'beneficiaire') {
          this.beneficiaires.unshift(newItem);
        } else {
          this.donateurs.unshift(newItem);
        }
        
        this.successMessage = 'Élément créé avec succès !';
      }
      
      // Fermer immédiatement le formulaire après succès
      this.cancelEdit();
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Save Item', 
        error, 
        'Erreur lors de la sauvegarde'
      );
      // En cas d'erreur, réinitialiser l'état de soumission pour permettre une nouvelle tentative
      this.resetFormSubmittingState();
    }
  }

  async onMediaSave(data: MediaCreate): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      if (this.editingMedia) {
        // Mise à jour : exclure l'ordre pour conserver la position actuelle
        const { ordre, ...updateData } = data;
        
        const updatedMedia = await this.mediaService.update(this.editingMedia.id!, updateData);
        
        // Mettre à jour l'élément dans la liste locale
        const targetArray = data.categorie === 'belgique' 
          ? this.mediasBelgique 
          : data.categorie === 'neerlandais' 
            ? this.mediasNeerlandais 
            : this.mediasInternational;
        const index = targetArray.findIndex(m => m.id === this.editingMedia!.id);
        if (index !== -1) {
          targetArray[index] = updatedMedia;
        }
        
        this.successMessage = 'Média mis à jour avec succès !';
      } else {
        // Nouveau : trouver le max et ajouter +1
        const medias = data.categorie === 'belgique' 
          ? this.mediasBelgique 
          : data.categorie === 'neerlandais' 
            ? this.mediasNeerlandais 
            : this.mediasInternational;
        const maxOrdre = medias.length > 0 ? Math.max(...medias.map(m => m.ordre)) : 0;
        data.ordre = maxOrdre + 1;
        
        const newMedia = await this.mediaService.create(data);
        
        // Ajouter le nouveau média au début de la liste locale
        if (data.categorie === 'belgique') {
          this.mediasBelgique.unshift(newMedia);
        } else if (data.categorie === 'neerlandais') {
          this.mediasNeerlandais.unshift(newMedia);
        } else {
          this.mediasInternational.unshift(newMedia);
        }
        
        this.successMessage = 'Média créé avec succès !';
      }
      
      // Fermer immédiatement le formulaire après succès
      this.cancelEdit();
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Save Media', 
        error, 
        'Erreur lors de la sauvegarde du média'
      );
      // En cas d'erreur, réinitialiser l'état de soumission
      this.resetFormSubmittingState();
    }
  }

  async deleteItem(item: Beneficiaire): Promise<void> {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${item.nom}" ?`)) {
      return;
    }
    
    try {
      await this.beneficiaireService.delete(item.id!);
      
      // Supprimer de la liste locale
      const targetArray = item.type === 'beneficiaire' ? this.beneficiaires : this.donateurs;
      const index = targetArray.findIndex(i => i.id === item.id);
      
      if (index !== -1) {
        targetArray.splice(index, 1);
        console.log(`Élément supprimé. ${targetArray.length} éléments restants.`);
      }
      
      this.successMessage = 'Élément supprimé avec succès !';
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Delete Item', 
        error, 
        'Erreur lors de la suppression'
      );
    }
  }

  async deleteMedia(media: Media): Promise<void> {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${media.titre}" ?`)) {
      return;
    }
    
    try {
      await this.mediaService.delete(media.id!);
      
      // Supprimer de la liste locale
      const targetArray = media.categorie === 'belgique' 
        ? this.mediasBelgique 
        : media.categorie === 'neerlandais' 
          ? this.mediasNeerlandais 
          : this.mediasInternational;
      const index = targetArray.findIndex(m => m.id === media.id);
      
      if (index !== -1) {
        targetArray.splice(index, 1);
        console.log(`Média supprimé. ${targetArray.length} médias restants.`);
      }
      
      this.successMessage = 'Média supprimé avec succès !';
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Delete Media', 
        error, 
        'Erreur lors de la suppression du média'
      );
    }
  }

  async toggleActif(item: Beneficiaire): Promise<void> {
    const action = item.actif ? 'désactiver' : 'activer';
    const message = item.actif 
      ? `Êtes-vous sûr de vouloir désactiver "${item.nom}" ?\nL'élément ne sera plus visible sur le site.`
      : `Êtes-vous sûr de vouloir activer "${item.nom}" ?`;
    
    if (!confirm(message)) {
      return;
    }
    
    try {
      await this.beneficiaireService.toggleActif(item.id!, !item.actif);
      
      // Mettre à jour localement
      item.actif = !item.actif;
      
      this.successMessage = `Élément ${action === 'désactiver' ? 'désactivé' : 'activé'} avec succès !`;
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Toggle Actif', 
        error, 
        'Erreur lors du changement de statut'
      );
    }
  }

  async toggleMediaActif(media: Media): Promise<void> {
    const action = media.actif ? 'désactiver' : 'activer';
    const message = media.actif 
      ? `Êtes-vous sûr de vouloir désactiver "${media.titre}" ?\nLe média ne sera plus visible sur le site.`
      : `Êtes-vous sûr de vouloir activer "${media.titre}" ?`;
    
    if (!confirm(message)) {
      return;
    }
    
    try {
      await this.mediaService.toggleActif(media.id!, !media.actif);
      
      // Mettre à jour localement
      media.actif = !media.actif;
      
      this.successMessage = `Média ${action === 'désactiver' ? 'désactivé' : 'activé'} avec succès !`;
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Toggle Media Actif', 
        error, 
        'Erreur lors du changement de statut du média'
      );
    }
  }

  private initializeSortable(): void {
    // Détruire les instances existantes de manière sécurisée
    try {
      if (this.beneficiairesSortable && typeof this.beneficiairesSortable.destroy === 'function') {
        this.beneficiairesSortable.destroy();
      }
    } catch (error) {
      console.warn('Erreur lors de la destruction de beneficiairesSortable:', error);
    }
    
    try {
      if (this.donateursSortable && typeof this.donateursSortable.destroy === 'function') {
        this.donateursSortable.destroy();
      }
    } catch (error) {
      console.warn('Erreur lors de la destruction de donateursSortable:', error);
    }

    try {
      if (this.mediasBelgiqueSortable && typeof this.mediasBelgiqueSortable.destroy === 'function') {
        this.mediasBelgiqueSortable.destroy();
      }
    } catch (error) {
      console.warn('Erreur lors de la destruction de mediasBelgiqueSortable:', error);
    }

    try {
      if (this.mediasNeerlandaisSortable && typeof this.mediasNeerlandaisSortable.destroy === 'function') {
        this.mediasNeerlandaisSortable.destroy();
      }
    } catch (error) {
      console.warn('Erreur lors de la destruction de mediasNeerlandaisSortable:', error);
    }

    try {
      if (this.mediasInternationalSortable && typeof this.mediasInternationalSortable.destroy === 'function') {
        this.mediasInternationalSortable.destroy();
      }
    } catch (error) {
      console.warn('Erreur lors de la destruction de mediasInternationalSortable:', error);
    }

    // Réinitialiser les références
    this.beneficiairesSortable = undefined;
    this.donateursSortable = undefined;
    this.mediasBelgiqueSortable = undefined;
    this.mediasNeerlandaisSortable = undefined;
    this.mediasInternationalSortable = undefined;

    // Configuration SortableJS pour les bénéficiaires
    if (this.beneficiairesGrid?.nativeElement && this.beneficiaires.length > 0) {
      this.beneficiairesSortable = Sortable.create(this.beneficiairesGrid.nativeElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.drag-handle',
        forceFallback: true,
        fallbackOnBody: true,
        onEnd: (evt) => this.onBeneficiaireSortEnd(evt)
      });
    }

    // Configuration SortableJS pour les donateurs (seulement si on est sur l'onglet donateurs)
    if (this.activeTab === 'donateurs' && this.donateursGrid?.nativeElement && this.donateurs.length > 0) {
      this.donateursSortable = Sortable.create(this.donateursGrid.nativeElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.drag-handle',
        forceFallback: true,
        fallbackOnBody: true,
        onEnd: (evt) => this.onDonateurSortEnd(evt)
      });
    }

    // Configuration SortableJS pour les médias Belgique
    if (this.activeTab === 'medias' && this.activeMediaTab === 'belgique' && this.mediasBelgiqueGrid?.nativeElement && this.mediasBelgique.length > 0) {
      this.mediasBelgiqueSortable = Sortable.create(this.mediasBelgiqueGrid.nativeElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.drag-handle',
        forceFallback: true,
        fallbackOnBody: true,
        onEnd: (evt) => this.onMediaBelgiqueSortEnd(evt)
      });
    }

    // Configuration SortableJS pour les médias Néerlandais
    if (this.activeTab === 'medias' && this.activeMediaTab === 'neerlandais' && this.mediasNeerlandaisGrid?.nativeElement && this.mediasNeerlandais.length > 0) {
      this.mediasNeerlandaisSortable = Sortable.create(this.mediasNeerlandaisGrid.nativeElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.drag-handle',
        forceFallback: true,
        fallbackOnBody: true,
        onEnd: (evt) => this.onMediaNeerlandaisSortEnd(evt)
      });
    }

    // Configuration SortableJS pour les médias International
    if (this.activeTab === 'medias' && this.activeMediaTab === 'international' && this.mediasInternationalGrid?.nativeElement && this.mediasInternational.length > 0) {
      this.mediasInternationalSortable = Sortable.create(this.mediasInternationalGrid.nativeElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.drag-handle',
        forceFallback: true,
        fallbackOnBody: true,
        onEnd: (evt) => this.onMediaInternationalSortEnd(evt)
      });
    }
  }

  private async onBeneficiaireSortEnd(evt: any): Promise<void> {
    const { oldIndex, newIndex } = evt;
    
    if (oldIndex === newIndex) {
      return;
    }

    const movedItem = this.beneficiaires.splice(oldIndex, 1)[0];
    this.beneficiaires.splice(newIndex, 0, movedItem);

    await this.updateOrdresOptimized(this.beneficiaires, oldIndex, newIndex);
  }

  private async onDonateurSortEnd(evt: any): Promise<void> {
    const { oldIndex, newIndex } = evt;
    
    if (oldIndex === newIndex) {
      return;
    }

    const movedItem = this.donateurs.splice(oldIndex, 1)[0];
    this.donateurs.splice(newIndex, 0, movedItem);

    await this.updateOrdresOptimized(this.donateurs, oldIndex, newIndex);
  }

  private async onMediaBelgiqueSortEnd(evt: any): Promise<void> {
    const { oldIndex, newIndex } = evt;
    
    if (oldIndex === newIndex) {
      return;
    }

    const movedMedia = this.mediasBelgique.splice(oldIndex, 1)[0];
    this.mediasBelgique.splice(newIndex, 0, movedMedia);

    await this.updateMediaOrdresOptimized(this.mediasBelgique, oldIndex, newIndex);
  }

  private async onMediaNeerlandaisSortEnd(evt: any): Promise<void> {
    const { oldIndex, newIndex } = evt;
    
    if (oldIndex === newIndex) {
      return;
    }

    const movedMedia = this.mediasNeerlandais.splice(oldIndex, 1)[0];
    this.mediasNeerlandais.splice(newIndex, 0, movedMedia);

    await this.updateMediaOrdresOptimized(this.mediasNeerlandais, oldIndex, newIndex);
  }

  private async onMediaInternationalSortEnd(evt: any): Promise<void> {
    const { oldIndex, newIndex } = evt;
    
    if (oldIndex === newIndex) {
      return;
    }

    const movedMedia = this.mediasInternational.splice(oldIndex, 1)[0];
    this.mediasInternational.splice(newIndex, 0, movedMedia);

    await this.updateMediaOrdresOptimized(this.mediasInternational, oldIndex, newIndex);
  }

  private async updateOrdresOptimized(items: Beneficiaire[], oldIndex: number, newIndex: number): Promise<void> {
    try {
      const maxOrdre = Math.max(...items.map(i => i.ordre));
      
      // Calculer la plage d'éléments qui ont besoin d'être mis à jour
      const startIndex = Math.min(oldIndex, newIndex);
      const endIndex = Math.max(oldIndex, newIndex);
      
      console.log(`Mise à jour optimisée: indices ${startIndex} à ${endIndex} (sur ${items.length} éléments)`);
      
      // Mettre à jour seulement les éléments dans la plage affectée
      const updates = [];
      for (let i = startIndex; i <= endIndex; i++) {
        const item = items[i];
        const newOrdre = maxOrdre - i; // Le premier élément aura le max ordre
        
        if (item.ordre !== newOrdre) {
          console.log(`Mise à jour ${item.nom}: ordre ${item.ordre} → ${newOrdre}`);
          item.ordre = newOrdre;
          updates.push(this.beneficiaireService.updateOrdre(item.id!, newOrdre));
        }
      }
      
      if (updates.length > 0) {
        await Promise.all(updates);
        console.log(`${updates.length} éléments mis à jour au lieu de ${items.length}`);
      }
      
      this.successMessage = 'Ordre mis à jour !';
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Update Order', 
        error, 
        'Erreur lors de la mise à jour'
      );
    }
  }

  private async updateMediaOrdresOptimized(medias: Media[], oldIndex: number, newIndex: number): Promise<void> {
    try {
      const maxOrdre = Math.max(...medias.map(m => m.ordre));
      
      // Calculer la plage d'éléments qui ont besoin d'être mis à jour
      const startIndex = Math.min(oldIndex, newIndex);
      const endIndex = Math.max(oldIndex, newIndex);
      
      console.log(`Mise à jour optimisée médias: indices ${startIndex} à ${endIndex} (sur ${medias.length} éléments)`);
      
      // Mettre à jour seulement les médias dans la plage affectée
      const updates = [];
      for (let i = startIndex; i <= endIndex; i++) {
        const media = medias[i];
        const newOrdre = maxOrdre - i; // Le premier média aura le max ordre
        
        if (media.ordre !== newOrdre) {
          console.log(`Mise à jour ${media.titre}: ordre ${media.ordre} → ${newOrdre}`);
          media.ordre = newOrdre;
          updates.push(this.mediaService.updateOrdre(media.id!, newOrdre));
        }
      }
      
      if (updates.length > 0) {
        await Promise.all(updates);
        console.log(`${updates.length} médias mis à jour au lieu de ${medias.length}`);
      }
      
      this.successMessage = 'Ordre des médias mis à jour !';
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleErrorWithPrefix(
        'Update Media Order', 
        error, 
        'Erreur lors de la mise à jour de l\'ordre des médias'
      );
    }
  }

  async logout(): Promise<void> {
    this.isLoggingOut = true;
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.isLoggingOut = false;
    }
  }
}
