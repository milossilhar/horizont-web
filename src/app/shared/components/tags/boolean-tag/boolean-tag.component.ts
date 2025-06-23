import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { NgTagSeverity } from '../../../types/prime-ng-severities';
import { TailwindSize } from '../../../types/tailwind-size';

@Component({
  selector: 'app-boolean-tag',
  imports: [TagModule],
  templateUrl: './boolean-tag.component.html',
  styles: ``
})
export class BooleanTagComponent {

  public value = input.required<boolean>();

  public trueLabel = input<string>();
  public trueIcon = input<string>('pi-check')
  public trueSeverity = input<NgTagSeverity>('success');

  public falseLabel = input<string>();
  public falseIcon = input<string>('pi-times');
  public falseSeverity = input<NgTagSeverity>('danger');

  public size = input<TailwindSize>('text-base');

  public label = computed(() => this.value() ? this.trueLabel() : this.falseLabel());
  public icon = computed(() => this.value() ? `pi ${this.trueIcon()}` : `pi ${this.falseIcon()}`);
  public severity = computed(() => this.value() ? this.trueSeverity() : this.falseSeverity());
}
