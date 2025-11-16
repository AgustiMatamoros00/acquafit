import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { UserData, TokenValidationResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    // Verificar si ya hay un token al inicializar
    this.checkAuthStatus();
  }

  async checkAuthStatus(): Promise<boolean> {
    
    const token = this.storageService.getToken();
    
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return false;
    }

    try {
      
      // Validar token con el backend
      const isValid = await this.validateTokenWithBackend(token);
      
      if (isValid) {
        this.isAuthenticatedSubject.next(true);
        
        // Solo redirigir si estamos en login
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
      console.error('💥 Error validando token:', error);
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
    this.storageService.removeToken();
    this.storageService.removeUserData();
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

  login(token: string, userData?: any): void {
    this.storageService.setToken(token);
    if (userData) {
      this.storageService.setUserData(userData);
    }
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.storageService.clearAll();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  async getUserData(): Promise<UserData | null> {
    try {
      // Si no hay datos locales, obtener desde la API
      const response = await this.apiService.get<TokenValidationResponse>('/auth/validate').toPromise();
      if (response?.user) {
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    // Verificar si el token está presente y es válido
    const token = this.storageService.getToken();
    this.isAuthenticatedSubject.next(token !== null);
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

  // Método para verificar si hay un token almacenado
  hasStoredToken(): boolean {
    return this.storageService.hasToken();
  }
}
