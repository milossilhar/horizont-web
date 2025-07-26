import { Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

type SkeletonType = 'card' | 'list' | 'single';

@Component({
  selector: 'app-skeleton',
  imports: [
    Skeleton
  ],
  templateUrl: './skeleton.component.html',
  styles: ``
})
export class SkeletonComponent {
  public type = input.required<SkeletonType>();
}
