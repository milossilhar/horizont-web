import { Component, computed, input, OnInit, signal } from '@angular/core';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { deburr, filter, includes, some, toLower, trim } from 'lodash';
import { RegistrationDTO } from '../../rest/model/models';
import { DestroyableComponent } from '../../shared/base/destroyable.component';
import { PersonCardComponent } from '../../shared/components/person-card/person-card.component';

interface DisplayOptionType {
  icon: string,
  value: string
};

type DisplayOptionsEnum = 'card' | 'list' | 'table';

@Component({
  selector: 'app-registrations',
  imports: [
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule, InputTextModule,
    SelectButtonModule,
    ButtonModule,
    RegistrationCardComponent, PersonCardComponent
  ],
  templateUrl: './registrations.component.html',
  styles: ``
})
export class RegistrationsComponent extends DestroyableComponent implements OnInit {

  public registrations = input.required<Array<RegistrationDTO>>();
  
  protected searchValue = signal<string | null>(null);

  protected filteredRegistrations = computed(() => this.filterRegistrations(this.registrations(), this.searchValue()));

  protected searchForm = new FormControl<string | null>(null);
  protected displayForm = new FormControl<DisplayOptionsEnum>('list');

  protected displayOptions: Array<DisplayOptionType> = [
    { icon: 'pi-id-card', value: 'card' },
    { icon: 'pi-bars', value: 'list' },
    // { icon: 'pi-table', value: 'table' },
  ];

  protected searching = false;

  constructor() {
    super();
  }
  
  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(
      tap(() => this.searching = true),
      distinctUntilChanged(),
      debounceTime(500),
      tap(() => this.searching = false),
      tap(val => this.searchValue.set(val)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  protected onClearClick() {
    this.searchForm.setValue('', { emitEvent: false });
    this.searchValue.set(null);
  }

  protected hasDisplay(val: DisplayOptionsEnum) {
    return this.displayForm.value === val;
  }

  private filterRegistrations(registrations: RegistrationDTO[], searchValue: string | null) {
    if (!searchValue) return registrations;

    return filter(registrations, (r) => this.containsSeachValue(r, searchValue));
  }

  private containsSeachValue(registration: RegistrationDTO, searchValue: string): boolean {
    return  this.containsString(registration.name, searchValue) ||
      this.containsString(registration.surname, searchValue) ||
      this.containsString(registration.email, searchValue) ||
      some(registration.people, person => {
        return this.containsString(person.name, searchValue) ||
          this.containsString(person.surname, searchValue)
      });
  }

  private containsString(orig: string, search: string): boolean {
    if (!orig) return false;

    return includes(toLower(trim(deburr(orig))), toLower(search));
  }
}
