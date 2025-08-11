import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { UserData, TokenValidationResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    // Verificar si ya hay un token al inicializar
    this.checkAuthStatus();
  }

  async checkAuthStatus(): Promise<boolean> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return false;
    }

    try {
      // Validar token con el backend
      const isValid = await this.validateTokenWithBackend(token);
      
      if (isValid) {
        this.isAuthenticatedSubject.next(true);
        
        // Si hay un token válido y estamos en login, redirigir al home
        if (this.router.url === '/login') {
          this.router.navigate(['/home']);
        }
        
        return true;
      } else {
        // Token inválido, limpiar y redirigir al login
        this.clearInvalidToken();
        return false;
      }
    } catch (error) {
      console.error('Error validando token:', error);
      this.clearInvalidToken();
      return false;
    }
  }

  private async validateTokenWithBackend(token: string): Promise<boolean> {
    try {
      // Llamar al endpoint de validación del backend
      const response = await this.apiService.get<TokenValidationResponse>('/auth/validate').toPromise();
      return response?.valid === true;
    } catch (error) {
      console.error('Error en validación del token:', error);
      return false;
    }
  }

  private clearInvalidToken(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    
    // Solo redirigir si no estamos ya en login
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private isTokenValid(token: string): boolean {
    // Validación básica del formato del token
    return token.length > 0;
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/home']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async getUserData(): Promise<UserData | null> {
    try {
      // Obtener información del usuario desde la API
      const response = await this.apiService.get<TokenValidationResponse>('/auth/validate').toPromise();
      return response?.user || null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Método para verificar si el usuario debe ser redirigido
  shouldRedirectToHome(): boolean {
    return this.isLoggedIn() && this.router.url === '/login';
  }

  // Método para validar token en tiempo real
  async validateCurrentToken(): Promise<boolean> {
    return await this.checkAuthStatus();
  }
}
