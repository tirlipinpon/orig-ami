import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Supabase } from './supabase';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private supabase: Supabase) {
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
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
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
}
