import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string | undefined | null, limit: number, elipsis: string = '...'): string | undefined | null {
    if (!value) return value;

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + elipsis;
  }

}
