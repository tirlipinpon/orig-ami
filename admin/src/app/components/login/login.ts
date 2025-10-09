import { Component } from '@angular/core';
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
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: Auth, private router: Router) {}

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
    } catch (error: any) {
      this.errorMessage = 'Erreur de connexion. Vérifiez votre configuration Supabase.';
      console.error('Erreur de connexion:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
