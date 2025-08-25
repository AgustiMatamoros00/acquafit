import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {authGuard, homeGuard} from './guards/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuard] // Si ya está logueado, no puede acceder al login
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [homeGuard] // Solo accesible si está autenticado
    },
    {
        path: 'user-info',
        component: UserInfoComponent,
        canActivate: [homeGuard] // Solo accesible si está autenticado
    },
    {path: '**', redirectTo: '/login'} // Ruta por defecto para rutas no encontradas
]; 