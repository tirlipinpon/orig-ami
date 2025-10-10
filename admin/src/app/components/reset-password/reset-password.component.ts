import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly errorHandler = inject(ErrorHandlerService);

  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  
  accessToken: string = '';
  isValidToken: boolean = false;

  ngOnInit(): void {
    // Récupérer le token depuis le fragment de l'URL (#access_token=...)
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        this.accessToken = params.get('access_token') || '';
        
        if (this.accessToken) {
          this.isValidToken = true;
          console.log('✅ Token de réinitialisation valide reçu');
        } else {
          this.errorMessage = 'Lien de réinitialisation invalide ou expiré';
          console.error('❌ Token manquant dans l\'URL');
        }
      } else {
        this.errorMessage = 'Lien de réinitialisation invalide ou expiré';
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.authService.updatePassword(this.newPassword);
      
      if (result.success) {
        this.successMessage = '✅ Mot de passe modifié avec succès ! Redirection...';
        
        // Redirection vers la page de login après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/login'], { 
            queryParams: { resetSuccess: 'true' } 
          });
        }, 2000);
      } else {
        this.errorMessage = result.error || 'Erreur lors de la modification du mot de passe';
      }
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleError(
        'Reset Password Submit', 
        error, 
        'Erreur lors de la réinitialisation du mot de passe'
      );
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

