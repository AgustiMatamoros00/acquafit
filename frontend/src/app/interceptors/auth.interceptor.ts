import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  // Obtener el token del StorageService
  const token = storageService.getToken();

  // Si hay un token, añadirlo al header Authorization
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token inválido o expirado
        
        // Limpiar el token inválido usando el StorageService
        storageService.removeToken();
        storageService.removeUserData();
        
        // Redirigir al login solo si no estamos ya ahí
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }
      
      return throwError(() => error);
    })
  );
};