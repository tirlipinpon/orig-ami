import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly errorHandler = inject(ErrorHandlerService);

  // Login
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Reset password
  showForgotPassword: boolean = false;
  resetEmail: string = '';
  resetErrorMessage: string = '';
  resetSuccessMessage: string = '';
  isResetting: boolean = false;

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const result = await this.authService.login(this.email, this.password);
      
      if (result.success) {
        this.router.navigate(['/edit']);
      } else {
        this.errorMessage = result.error || 'Email ou mot de passe invalide';
      }
    } catch (error: unknown) {
      this.errorMessage = this.errorHandler.handleError(
        'Login Submit', 
        error, 
        'Erreur de connexion. Vérifiez votre configuration Supabase.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  toggleForgotPassword(event: Event): void {
    event.preventDefault();
    this.showForgotPassword = !this.showForgotPassword;
    // Réinitialiser les messages
    this.errorMessage = '';
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';
    this.resetEmail = '';
  }

  async onResetPassword(): Promise<void> {
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';
    this.isResetting = true;

    try {
      const result = await this.authService.resetPasswordForEmail(this.resetEmail);
      
      if (result.success) {
        this.resetSuccessMessage = '✅ Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception.';
        // Réinitialiser le champ email après 3 secondes
        setTimeout(() => {
          this.resetEmail = '';
        }, 3000);
      } else {
        this.resetErrorMessage = result.error || 'Erreur lors de l\'envoi de l\'email';
      }
    } catch (error: unknown) {
      this.resetErrorMessage = this.errorHandler.handleError(
        'Reset Password', 
        error, 
        'Erreur lors de la réinitialisation du mot de passe'
      );
    } finally {
      this.isResetting = false;
    }
  }
}
