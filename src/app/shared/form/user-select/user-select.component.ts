import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { MultiSelect } from 'primeng/multiselect';
import { takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { HostControlDirective } from '../../directives/host-control.directive';
import { User, UserService } from '../../service/user.service';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';

@Component({
  selector: 'app-user-select',
  imports: [
    FloatLabel,
    FormWithErrorsComponent,
    ReactiveFormsModule,
    MultiSelect
  ],
  templateUrl: './user-select.component.html',
  styles: ``,
  hostDirectives: [ HostControlDirective ]
})
export class UserSelectComponent extends DestroyableComponent implements OnInit {
  private hcd = inject(HostControlDirective);

  public inputId = input.required<string>();
  public label = input.required<string>();
  public multi = input<boolean>(false);
  public errorMessages = input<Record<string, string>>();

  protected users = signal<Array<User>>([]);

  constructor(
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.trainers.pipe(
      tap(users => this.users.set(users)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  protected get form() {
    return this.hcd.control;
  }
}
