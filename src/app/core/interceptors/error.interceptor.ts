import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        notificationService.error(
          'Sesión expirada. Por favor, inicia sesión nuevamente.'
        );
      } else if (error.status === 403) {
        notificationService.error(
          'No tienes permisos para realizar esta acción.'
        );
      } else if (error.status === 0) {
        notificationService.error('No se puede conectar con el servidor.');
      } else {
        const message =
          error.error?.message || 'Ha ocurrido un error inesperado.';
        notificationService.error(message);
      }

      return throwError(() => error);
    })
  );
};
