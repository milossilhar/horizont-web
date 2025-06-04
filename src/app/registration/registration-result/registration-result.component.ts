import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { last } from 'lodash';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-registration-result',
  imports: [CardModule, MessageModule],
  templateUrl: './registration-result.component.html',
  styles: ``
})
export class RegistrationResultComponent {

  private result;

  constructor(route: ActivatedRoute) {
    const result = last(route.snapshot.url)?.path ?? 'success';
    this.result = result;
  }

  get success() {
    return this.result === 'success';
  }

}
