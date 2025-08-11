import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userData: UserData | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(public authService: AuthService) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      this.isLoading = true;
      this.error = null;
      this.userData = await this.authService.getUserData();
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      this.error = 'Error al cargar información del usuario';
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.authService.logout();
  }
} 