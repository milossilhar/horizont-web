import { Component, inject, input } from '@angular/core';
import { HostControlDirective } from '../../directives/host-control.directive';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-select',
  imports: [],
  templateUrl: './user-select.component.html',
  styles: ``,
  hostDirectives: [ HostControlDirective ]
})
export class UserSelectComponent {
  private hcd = inject(HostControlDirective);

  public multi = input<boolean>(false);

  constructor(
    private userService: UserService
  ) { }

  protected get form() {
    return this.hcd.control;
  }
}
