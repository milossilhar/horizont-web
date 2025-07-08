import { Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { EnumerationService } from '../../../service/enumeration.service';
import { TailwindSize } from '../../../types/tailwind-size';
import { iconNormalizer } from '../../../util/primeng-utils';

@Component({
  selector: 'app-enum-tag',
  imports: [
    Tag
  ],
  templateUrl: './enum-tag.component.html',
  styles: ``
})
export class EnumTagComponent {

  public enumName = input.required<string>();
  public value = input<string>();
  public size = input<TailwindSize>('text-base');

  protected enumItem = computed(() =>
    this.enumerationService.getEnumItem(this.enumName(), this.value() ?? '')
  );

  protected label = computed(() => this.enumItem()?.name ?? '');
  protected icon = computed(() => iconNormalizer(this.enumItem()?.icon));
  protected severity = computed(() => this.enumItem()?.severity);

  constructor(
    private enumerationService: EnumerationService
  ) { }

}
