import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from "primeng/avatar";
import { MenuModule } from 'primeng/menu';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user-avatar',
    imports: [
        AvatarModule, MenuModule
    ],
  templateUrl: './user-avatar.component.html',
  styles: ``
})
export class UserAvatarComponent {

  public collapsed = input.required<boolean>();
  public menuShown = false;

  protected items: Array<MenuItem> = [
    {
      label: 'Odhlásiť sa',
      icon: 'pi pi-power-off',
      command: () => this.logout()
    }
  ];

  constructor(private authService: AuthService) { }

  private logout(): void {
    fromPromise(this.authService.logout()).subscribe();
  }
}
