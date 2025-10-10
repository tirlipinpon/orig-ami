import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
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

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

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
      this.errorMessage = 'Erreur de connexion. Vérifiez votre configuration Supabase.';
      console.error('Erreur de connexion:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
