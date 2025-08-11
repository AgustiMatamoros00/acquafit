import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Verificar estado de autenticación al inicializar
    await this.checkInitialAuth();
  }

  private async checkInitialAuth() {
    try {
      const isAuth = await this.authService.checkAuthStatus();
      
      // Si está autenticado y está en la ruta raíz o login, redirigir al home
      if (isAuth && (this.router.url === '/' || this.router.url === '/login')) {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error verificando autenticación inicial:', error);
      // En caso de error, redirigir al login
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    }
  }
} 