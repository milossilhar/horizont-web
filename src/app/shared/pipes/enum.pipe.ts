import { Pipe, PipeTransform } from '@angular/core';
import { EnumerationService } from '../service/enumeration.service';

@Pipe({
  name: 'enum'
})
export class EnumPipe implements PipeTransform {

  constructor(private enumerationService: EnumerationService) { }

  transform(value: string, name: string): string {
    return this.enumerationService.getEnumItem(name, value)?.name ?? value;
  }

}
