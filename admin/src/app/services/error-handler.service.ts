import { Injectable } from '@angular/core';

/**
 * Service centralisé de gestion des erreurs
 * Évite la duplication du code de gestion d'erreurs dans toute l'application
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   * Extrait le message d'erreur d'une erreur inconnue
   * @param error L'erreur capturée (type unknown)
   * @param defaultMessage Message par défaut si aucun message n'est trouvé
   * @returns Le message d'erreur formaté
   */
  getErrorMessage(error: unknown, defaultMessage: string = 'Erreur inconnue'): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    // Pour les erreurs d'API ou autres objets
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }
    
    return defaultMessage;
  }

  /**
   * Log une erreur dans la console avec un contexte
   * @param context Le contexte où l'erreur s'est produite
   * @param error L'erreur capturée
   */
  logError(context: string, error: unknown): void {
    console.error(`❌ [${context}]`, error);
    
    // Log la stack trace si disponible
    if (error instanceof Error && error.stack) {
      console.error('📋 Stack:', error.stack);
    }
  }

  /**
   * Gère une erreur de manière complète (log + extraction du message)
   * @param context Le contexte où l'erreur s'est produite
   * @param error L'erreur capturée
   * @param defaultMessage Message par défaut si aucun message n'est trouvé
   * @returns Le message d'erreur formaté
   */
  handleError(context: string, error: unknown, defaultMessage: string = 'Erreur inconnue'): string {
    this.logError(context, error);
    return this.getErrorMessage(error, defaultMessage);
  }

  /**
   * Gère une erreur avec un préfixe personnalisé
   * @param context Le contexte où l'erreur s'est produite
   * @param error L'erreur capturée
   * @param prefix Préfixe à ajouter avant le message d'erreur
   * @returns Le message d'erreur complet avec préfixe
   */
  handleErrorWithPrefix(context: string, error: unknown, prefix: string): string {
    const message = this.handleError(context, error);
    return `${prefix}: ${message}`;
  }
}

