import { Component } from '@angular/core';
import { ImageCarouselComponent } from '../sections/image-carousel/image-carousel.component';
import { IntroductionComponent } from '../sections/introduction/introduction.component';
import { ImageGalleryComponent } from '../sections/image-gallery/image-gallery.component';
import { ActivitiesComponent } from '../sections/activities/activities.component';
import { IntroTeamComponent } from '../sections/intro-team/intro-team.component';

@Component({
  selector: 'app-web-home',
  imports: [
    ImageCarouselComponent,
    IntroductionComponent,
    ImageGalleryComponent,
    ActivitiesComponent,
    IntroTeamComponent
  ],
  templateUrl: './web-home.component.html',
  styleUrls: ['./web-home.component.css']
})
export class WebHomeComponent {

}
