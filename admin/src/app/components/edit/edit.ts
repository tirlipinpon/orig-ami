import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Sortable from 'sortablejs';
import { Auth } from '../../services/auth';
import { BeneficiaireService } from '../../services/beneficiaire';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit, AfterViewInit {
  userEmail: string | null = '';
  isLoggingOut: boolean = false;
  
  // Données
  beneficiaires: Beneficiaire[] = [];
  donateurs: Beneficiaire[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Gestion des formulaires
  showBeneficiaireForm: boolean = false;
  showDonateurForm: boolean = false;
  editingItem: Beneficiaire | null = null;
  
  // Formulaire
  formData: BeneficiaireCreate = {
    nom: '',
    url: '',
    image_url: '',
    alt_text: '',
    title: '',
    image_width: 200,
    type: 'beneficiaire',
    ordre: 0,
    actif: true
  };

  // Onglet actif
  activeTab: 'beneficiaires' | 'donateurs' = 'beneficiaires';

  // SortableJS
  @ViewChild('beneficiairesGrid', { static: false }) beneficiairesGrid!: ElementRef;
  @ViewChild('donateursGrid', { static: false }) donateursGrid!: ElementRef;
  private beneficiairesSortable?: Sortable;
  private donateursSortable?: Sortable;

  constructor(
    private authService: Auth,
    private router: Router,
    private beneficiaireService: BeneficiaireService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userEmail = this.authService.getUserEmail();
    
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.userEmail = user?.email ?? null;
    });

    await this.loadData();
    
    // Vérifier et corriger l'ordre si nécessaire
    await this.verifierEtCorrigerOrdre();
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
    } catch (error: any) {
      this.errorMessage = 'Erreur lors du chargement des données: ' + error.message;
      console.error('Erreur de chargement:', error);
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
    
    // Calculer le prochain ordre disponible
    const items = type === 'beneficiaire' ? this.beneficiaires : this.donateurs;
    const maxOrdre = items.length > 0 ? Math.max(...items.map(item => item.ordre)) : 0;
    
    this.formData = {
      nom: '',
      url: '',
      image_url: '',
      alt_text: '',
      title: '',
      image_width: 200,
      type: type,
      ordre: maxOrdre + 1, // Ajouter à la fin
      actif: true
    };
    
    if (type === 'beneficiaire') {
      this.showBeneficiaireForm = true;
    } else {
      this.showDonateurForm = true;
    }
  }

  editItem(item: Beneficiaire): void {
    this.editingItem = item;
    this.formData = { ...item };
    
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
  }

  async saveItem(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      if (this.editingItem) {
        // Mise à jour
        await this.beneficiaireService.update(this.editingItem.id!, this.formData);
        this.successMessage = 'Élément mis à jour avec succès !';
      } else {
        // Création - Ajouter à la fin avec l'ordre calculé
        await this.beneficiaireService.create(this.formData);
        this.successMessage = 'Élément créé avec succès !';
      }
      
      await this.loadData();
      
      setTimeout(() => {
        this.cancelEdit();
      }, 1500);
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de la sauvegarde: ' + error.message;
      console.error('Erreur de sauvegarde:', error);
    }
  }

  async deleteItem(item: Beneficiaire): Promise<void> {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${item.nom}" ?`)) {
      return;
    }
    
    try {
      await this.beneficiaireService.delete(item.id!);
      this.successMessage = 'Élément supprimé avec succès !';
      await this.loadData();
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de la suppression: ' + error.message;
      console.error('Erreur de suppression:', error);
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
      this.successMessage = `Élément ${action === 'désactiver' ? 'désactivé' : 'activé'} avec succès !`;
      await this.loadData();
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: any) {
      this.errorMessage = 'Erreur lors du changement de statut: ' + error.message;
      console.error('Erreur de statut:', error);
    }
  }

  private initializeSortable(): void {
    // Détruire les instances existantes
    if (this.beneficiairesSortable) {
      this.beneficiairesSortable.destroy();
    }
    if (this.donateursSortable) {
      this.donateursSortable.destroy();
    }

    // Configuration SortableJS pour les bénéficiaires
    if (this.beneficiairesGrid?.nativeElement) {
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
    if (this.activeTab === 'donateurs' && this.donateursGrid?.nativeElement) {
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
      return; // Pas de changement
    }

    // SortableJS a déjà réorganisé le DOM, on synchronise notre tableau
    const movedItem = this.beneficiaires.splice(oldIndex, 1)[0];
    this.beneficiaires.splice(newIndex, 0, movedItem);

    // Mettre à jour les ordres dans la base de données
    await this.updateOrdres(this.beneficiaires);
  }

  private async onDonateurSortEnd(evt: any): Promise<void> {
    const { oldIndex, newIndex } = evt;
    
    if (oldIndex === newIndex) {
      return; // Pas de changement
    }

    // SortableJS a déjà réorganisé le DOM, on synchronise notre tableau
    const movedItem = this.donateurs.splice(oldIndex, 1)[0];
    this.donateurs.splice(newIndex, 0, movedItem);

    // Mettre à jour les ordres dans la base de données
    await this.updateOrdres(this.donateurs);
  }

  private async updateOrdres(items: Beneficiaire[]): Promise<void> {
    try {
      // Mettre à jour l'ordre de chaque élément
      const updates = items.map((item, index) => {
        item.ordre = index + 1; // Mettre à jour localement
        return this.beneficiaireService.updateOrdre(item.id!, index + 1);
      });
      
      await Promise.all(updates);
      
      this.successMessage = 'Ordre mis à jour avec succès !';
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de la mise à jour de l\'ordre: ' + error.message;
      console.error('Erreur de réorganisation:', error);
    }
  }

  private async verifierEtCorrigerOrdre(): Promise<void> {
    try {
      // Vérifier si l'ordre est cohérent pour les bénéficiaires
      const ordreIncoherent = this.beneficiaires.some((item, index) => item.ordre !== index + 1);
      
      if (ordreIncoherent) {
        console.log('Ordre incohérent détecté pour les bénéficiaires, correction automatique...');
        await this.updateOrdres(this.beneficiaires);
      }

      // Vérifier si l'ordre est cohérent pour les donateurs
      const ordreIncoherentDonateurs = this.donateurs.some((item, index) => item.ordre !== index + 1);
      
      if (ordreIncoherentDonateurs) {
        console.log('Ordre incohérent détecté pour les donateurs, correction automatique...');
        await this.updateOrdres(this.donateurs);
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification de l\'ordre:', error);
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
