import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Auth } from '../../services/auth';
import { BeneficiaireService } from '../../services/beneficiaire';
import { Beneficiaire, BeneficiaireCreate } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit {
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
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.beneficiaires = await this.beneficiaireService.getByType('beneficiaire');
      this.donateurs = await this.beneficiaireService.getByType('donateur');
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
  }

  openAddForm(type: 'beneficiaire' | 'donateur'): void {
    this.editingItem = null;
    this.formData = {
      nom: '',
      url: '',
      image_url: '',
      alt_text: '',
      title: '',
      image_width: 200,
      type: type,
      ordre: 0, // Nouvel élément toujours en premier
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
        // Création - Nouvel élément en premier, décaler les autres
        const itemsToUpdate = this.formData.type === 'beneficiaire' ? this.beneficiaires : this.donateurs;
        
        // Créer le nouvel élément
        await this.beneficiaireService.create(this.formData);
        
        // Décaler tous les autres éléments d'un cran
        for (const item of itemsToUpdate) {
          await this.beneficiaireService.updateOrdre(item.id!, item.ordre + 1);
        }
        
        this.successMessage = 'Élément créé avec succès en première position !';
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

  async dropBeneficiaire(event: CdkDragDrop<Beneficiaire[]>): Promise<void> {
    if (event.previousIndex === event.currentIndex) {
      return; // Pas de changement
    }

    // Réorganiser localement
    moveItemInArray(this.beneficiaires, event.previousIndex, event.currentIndex);

    // Mettre à jour les ordres dans la base de données
    await this.updateOrdres(this.beneficiaires);
  }

  async dropDonateur(event: CdkDragDrop<Beneficiaire[]>): Promise<void> {
    if (event.previousIndex === event.currentIndex) {
      return; // Pas de changement
    }

    // Réorganiser localement
    moveItemInArray(this.donateurs, event.previousIndex, event.currentIndex);

    // Mettre à jour les ordres dans la base de données
    await this.updateOrdres(this.donateurs);
  }

  private async updateOrdres(items: Beneficiaire[]): Promise<void> {
    try {
      // Mettre à jour l'ordre de chaque élément
      const updates = items.map((item, index) => 
        this.beneficiaireService.updateOrdre(item.id!, index + 1)
      );
      
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
