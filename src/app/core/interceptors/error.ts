import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('ErrorInterceptor - Error capturado:', {
        url: req.url,
        method: req.method,
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error.error,
      });

      // Manejar errores específicos
      switch (error.status) {
        case 401:
          console.log('ErrorInterceptor - Error 401: No autorizado');
          authService.logout();
          router.navigate(['/login']);
          notificationService.error(
            'Sesión expirada. Por favor, inicia sesión nuevamente.'
          );
          break;

        case 403:
          console.log('ErrorInterceptor - Error 403: Prohibido');
          notificationService.error(
            'No tienes permisos para realizar esta acción.'
          );
          break;

        case 404:
          console.log('ErrorInterceptor - Error 404: No encontrado');
          // No mostrar notificación automática para 404, dejar que el componente lo maneje
          break;

        case 0:
          console.log('ErrorInterceptor - Error 0: Sin conexión');
          notificationService.error(
            'No se puede conectar con el servidor. Verifica tu conexión.'
          );
          break;

        case 500:
          console.log(
            'ErrorInterceptor - Error 500: Error interno del servidor'
          );
          notificationService.error(
            'Error interno del servidor. Intenta de nuevo más tarde.'
          );
          break;

        default:
          console.log('ErrorInterceptor - Error genérico:', error.status);
          if (
            error.status >= 400 &&
            error.status < 500 &&
            error.status !== 404
          ) {
            const message =
              error.error?.message || 'Ha ocurrido un error inesperado.';
            notificationService.error(message);
          }
          break;
      }

      // Siempre propagar el error para que los componentes puedan manejarlo
      return throwError(() => error);
    })
  );
};
