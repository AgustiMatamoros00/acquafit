import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token inválido o expirado
        console.log('Token inválido, redirigiendo al login');
        
        // Limpiar solo el token inválido
        localStorage.removeItem('token');
        
        // Redirigir al login solo si no estamos ya ahí
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }
      
      return throwError(() => error);
    })
  );
};