import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly supabase = inject(Supabase);
  private readonly errorHandler = inject(ErrorHandlerService);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    // Vérifier la session au démarrage
    const { data: { session } } = await this.supabase.getSession();
    this.isAuthenticatedSubject.next(!!session);
    this.currentUserSubject.next(session?.user ?? null);

    // Écouter les changements d'état d'authentification
    this.supabase.onAuthStateChange((event, session) => {
      this.isAuthenticatedSubject.next(!!session);
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(data.user);
        return { success: true };
      }

      return { success: false, error: 'Erreur de connexion' };
    } catch (error: unknown) {
      const errorMessage = this.errorHandler.handleError('Login', error, 'Erreur de connexion');
      return { success: false, error: errorMessage };
    }
  }

  async logout(): Promise<void> {
    await this.supabase.signOut();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data: { session } } = await this.supabase.getSession();
    return !!session;
  }

  isLoggedInSync(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserEmail(): string | null {
    return this.currentUserSubject.value?.email ?? null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async getCurrentUserAsync(): Promise<User | null> {
    return await this.supabase.getCurrentUser();
  }

  /**
   * Envoie un email de réinitialisation du mot de passe
   * @param email L'adresse email de l'utilisateur
   * @returns Un objet avec success et error
   */
  async resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.resetPasswordForEmail(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = this.errorHandler.handleError('Reset Password', error, 'Erreur de réinitialisation');
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Met à jour le mot de passe de l'utilisateur connecté
   * @param newPassword Le nouveau mot de passe
   * @returns Un objet avec success et error
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.updatePassword(newPassword);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = this.errorHandler.handleError('Update Password', error, 'Erreur de mise à jour du mot de passe');
      return { success: false, error: errorMessage };
    }
  }
}
