import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-message" *ngIf="control?.invalid && control?.touched">
      <span *ngIf="control?.hasError('required')">Este campo es requerido</span>
      <span *ngIf="control?.hasError('email')">Ingresa un email válido</span>
      <span *ngIf="control?.hasError('minlength')">
        Mínimo {{ control?.getError('minlength')?.requiredLength }} caracteres
      </span>
      <span *ngIf="control?.hasError('maxlength')">
        Máximo {{ control?.getError('maxlength')?.requiredLength }} caracteres
      </span>
      <span *ngIf="control?.hasError('min')">
        Valor mínimo: {{ control?.getError('min')?.min }}
      </span>
      <span *ngIf="control?.hasError('max')">
        Valor máximo: {{ control?.getError('max')?.max }}
      </span>
      <span *ngIf="customMessage">{{ customMessage }}</span>
    </div>
  `,
  styles: [
    `
      .error-message {
        color: #f44336;
        font-size: 0.75rem;
        margin-top: 4px;
      }
    `,
  ],
})
export class FormFieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() customMessage: string = '';
}
