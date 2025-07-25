import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../website/layout/footer/footer.component';
import { HeaderComponent } from '../../website/layout/header/header.component';

@Component({
  selector: 'app-web-layout',
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './web-layout.component.html',
  styles: ``
})
export class WebLayoutComponent {

}
