import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  apiResponse: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  changePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      this.apiResponse = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.apiResponse = '';

    // Usar el ApiService para hacer la petición al backend
    this.apiService.post('/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.apiResponse = `Login exitoso: ${response.message || 'Bienvenido!'}`;
        console.log('Login response:', response);
        
        // Manejar el token JWT si lo devuelve el backend
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.apiResponse = `Error al iniciar sesión: ${error}`;
        console.error('Error al iniciar sesión:', error);
      }
    });
  }
} 