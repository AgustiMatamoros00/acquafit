import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LoginResponse, ApiErrorResponse } from '../../models/api.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  apiResponse: any = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  changePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.showNotificationMessage('Por favor, completa todos los campos', 'error');
      return;
    }

    this.isLoading = true;
    this.apiResponse = null;

    try {
      const response = await this.apiService.post<LoginResponse>('/auth/login', {
        email: this.email,
        password: this.password
      }).toPromise();

      if (response) {
        this.apiResponse = response;
        // Solo pasar el token, no la información del usuario
        this.authService.login(response.token);
        this.showNotificationMessage(`Login exitoso: ${response.message || 'Bienvenido!'}`, 'success');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      if (error.error && error.error.error) {
        errorMessage = `Error al iniciar sesión: ${error.error.error}`;
      } else if (error.message) {
        errorMessage = `Error al iniciar sesión: ${error.message}`;
      }
      
      this.showNotificationMessage(errorMessage, 'error');
      
      // Mostrar respuesta de error si existe
      if (error.error) {
        this.apiResponse = error.error;
      }
    } finally {
      this.isLoading = false;
    }
  }

  private showNotificationMessage(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
} 