import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Sortable from 'sortablejs';
import { Auth } from '../../services/auth';
import { BeneficiaireService } from '../../services/beneficiaire';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';
import { ItemForm } from '../item-form/item-form';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, ItemForm, ItemCardComponent],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly beneficiaireService = inject(BeneficiaireService);
  private readonly errorHandler = inject(ErrorHandlerService);
  
  userEmail: string | null = '';
  isLoggingOut: boolean = false;
  
  // Données
  beneficiaires: Beneficiaire[] = [];
  donateurs: Beneficiaire[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  showBeneficiaireForm: boolean = false;
  showDonateurForm: boolean = false;
  editingItem: Beneficiaire | null = null;
  formType: 'beneficiaire' | 'donateur' = 'beneficiaire';

  activeTab: 'beneficiaires' | 'donateurs' = 'beneficiaires';

  @ViewChild('beneficiairesGrid', { static: false }) beneficiairesGrid!: ElementRef;
  @ViewChild('donateursGrid', { static: false }) donateursGrid!: ElementRef;
  @ViewChild('beneficiaireForm', { static: false }) beneficiaireForm!: ItemForm;
  @ViewChild('donateurForm', { static: false }) donateurForm!: ItemForm;
  private beneficiairesSortable?: Sortable;
  private donateursSortable?: Sortable;

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

  switchTab(tab: 'beneficiaires' | 'donateurs'): void {
    this.activeTab = tab;
    this.cancelEdit();
    
    // Réinitialiser SortableJS après le changement d'onglet
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

  editItem(item: Beneficiaire): void {
    this.editingItem = item;
    this.formType = item.type;
    
    if (item.type === 'beneficiaire') {
      this.showBeneficiaireForm = true;
    } else {
      this.showDonateurForm = true;
    }
  }

  cancelEdit(): void {
    this.showBeneficiaireForm = false;
    this.showDonateurForm = false;
    this.editingItem = null;
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

  async deleteItem(item: Beneficiaire): Promise<void> {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${item.nom}" ?`)) {
      return;
    }
    
    try {
      await this.beneficiaireService.delete(item.id!);
      
      // Supprimer de la liste locale
      // Note: Les gaps dans les ordres n'affectent pas l'affichage car le tri se fait par ORDER BY ordre DESC
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

    // Réinitialiser les références
    this.beneficiairesSortable = undefined;
    this.donateursSortable = undefined;

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
