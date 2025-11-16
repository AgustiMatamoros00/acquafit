import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {UserData} from "../../models/api.models";

@Component({
    selector: 'app-user-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss']
})

export class UserInfoComponent implements OnInit {
    userData: UserData | null = null;
    isLoading: boolean = true;
    error: string | null = null;

    constructor(public authService: AuthService, private router: Router) {}

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

    goBack() {
        this.router.navigate(['/home']);
    }
}