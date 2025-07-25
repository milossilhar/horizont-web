import { Component } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { groupBy } from 'lodash';
import { KeyValuePipe } from '@angular/common';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

@Component({
  selector: 'app-image-gallery',
  imports: [
    Carousel,
    KeyValuePipe,
    SectionHeaderComponent
  ],
  templateUrl: './image-gallery.component.html',
  styles: ``
})
export class ImageGalleryComponent {

  items = Array.from(Array(12)).map((_, i) => i + 30);

  getDimensions(i: number) {
    return (i % 2 === 0)
      ? '1000'
      : '500/750';
  }
}
