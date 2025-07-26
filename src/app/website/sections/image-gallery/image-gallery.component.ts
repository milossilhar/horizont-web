import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

@Component({
  selector: 'app-image-gallery',
  imports: [ SectionHeaderComponent ],
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
