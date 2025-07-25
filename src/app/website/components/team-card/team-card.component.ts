import { Component, input } from '@angular/core';

@Component({
  selector: 'app-team-card',
  imports: [],
  templateUrl: './team-card.component.html',
  styles: ``
})
export class TeamCardComponent {

  public member = input.required<any>();

  protected get links() {
    return this.member().links as Array<any>;
  }
}
