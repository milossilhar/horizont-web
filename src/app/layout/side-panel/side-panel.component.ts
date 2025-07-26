import { Component, input, model } from '@angular/core';
import { Avatar } from "primeng/avatar";
import { DividerModule } from 'primeng/divider';
import { OverlayBadge } from 'primeng/overlaybadge';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-side-panel',
  imports: [
    Avatar,
    NavigationComponent,
    DividerModule,
    UserAvatarComponent,
    OverlayBadge
  ],
  templateUrl: './side-panel.component.html',
  styles: ``,
  host: {
    class: 'flex'
  }
})
export class SidePanelComponent {

  public collapsed = input.required<boolean>();
}
