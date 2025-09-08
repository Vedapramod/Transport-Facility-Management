import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    let date: Date;

    // Convert to Date if it's a string
    if (typeof value === 'string') {
      date = new Date(`1970-01-01T${value}`);
    } else {
      date = value;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minuteStr = minutes.toString().padStart(2, '0');

    return `${hour12}:${minuteStr} ${ampm}`;
  }
}
