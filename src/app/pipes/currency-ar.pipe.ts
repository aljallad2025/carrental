import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyAr', standalone: true })
export class CurrencyArPipe implements PipeTransform {
  transform(value: number, currency: string = 'ر.س'): string {
    if (!value && value !== 0) return '';
    return `${value.toLocaleString('ar-SA')} ${currency}`;
  }
}
