import { Injectable } from '@angular/core';
import {TokenValidationResponse} from "../models/api.models";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_DATA_KEY = 'user_data';

  constructor() { }

  // Métodos para el token JWT
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando token en localStorage:', error);
      // Fallback a sessionStorage si localStorage falla
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    try {
      // Intentar obtener del localStorage primero
      let token = localStorage.getItem(this.TOKEN_KEY);
      
      // Si no está en localStorage, intentar en sessionStorage
      if (!token) {
        token = sessionStorage.getItem(this.TOKEN_KEY);
      }
      
      return token;
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removiendo token:', error);
    }
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }

  // Métodos para datos del usuario
  setUserData(userData: any): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error guardando datos del usuario:', error);
      sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    }
  }

  getUserData(): any | null {
    try {
        let userData: any = localStorage.getItem(this.USER_DATA_KEY);

        if (!userData) {
        userData = sessionStorage.getItem(this.USER_DATA_KEY);
        }

      if (userData) {
        // Parsear el JSON almacenado
        const parsedData = JSON.parse(userData);
        return parsedData;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  removeUserData(): void {
    try {
      localStorage.removeItem(this.USER_DATA_KEY);
      sessionStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.error('Error removiendo datos del usuario:', error);
    }
  }

  // Limpiar todo el almacenamiento
  clearAll(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.error('Error limpiando almacenamiento:', error);
    }
  }

  // Verificar si el almacenamiento está disponible
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
} 