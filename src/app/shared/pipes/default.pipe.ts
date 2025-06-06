import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'default'
})
export class DefaultPipe<T> implements PipeTransform {

  transform(value: T, defaultValue: T): T {
    if (!!value) return value;
    return defaultValue;
  }

}
