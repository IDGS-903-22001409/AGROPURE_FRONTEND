import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyMexican',
  standalone: true,
})
export class CurrencyMexicanPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '';

    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  }
}
