import { Component, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from "../../components/section-header/section-header.component";
import { TeamCardComponent } from '../../components/team-card/team-card.component';
import { delay, of, tap } from 'rxjs';
import { groupBy } from 'lodash';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

const LOCAL_MEMBERS = [
  {
    name: 'Lenka Bacigálová',
    role: 'CEO',
    bio: 'Ahoj, leziem už viac ako 15 rokov.',
    group: 'leader',
    image: 'https://picsum.photos/id/91/400',
    imagePlaceholder: 'Lenka',
    links: [
      { type: 'instagram', url: '#' },
      { type: 'facebook', url: '#' },
      { type: 'envelope', url: '#' }
    ]
  },
  {
    name: 'Melisa Váleková',
    role: 'CEO',
    bio: 'Budem sa o teba starať na krúžkoch a pri iných klubových aktivitách.',
    group: 'leader',
    image: 'https://picsum.photos/id/237/400',
    imagePlaceholder: 'Melisa',
    links: [
      { type: 'instagram', url: '#' },
      { type: 'facebook', url: '#' },
      { type: 'envelope', url: '#' }
    ]
  },
  {
    name: 'Miloš Šilhár',
    role: 'Inštruktor',
    bio: 'Zameriavam sa na lezenie dospelákov a šport.\nTaktiež som naprogramoval túto stránku, čiže ak niečo nefunguje som pravdepodobne ja na vine.',
    group: 'member',
    image: 'https://picsum.photos/id/210/400',
    imagePlaceholder: 'Miloš',
    links: [
      { type: 'instagram', url: '#' },
      { type: 'facebook', url: '#' },
      { type: 'envelope', url: '#' }
    ]
  },
  {
    name: 'Linda Melichárová',
    role: 'Inštruktorka',
    bio: 'Mám rada len deti Terezku a Lenku, tvoje dieťa nebudem mať rada.',
    group: 'member',
    image: 'https://picsum.photos/id/156/400',
    imagePlaceholder: 'Linda',
    links: [
      { type: 'instagram', url: '#' },
      { type: 'facebook', url: '#' },
      { type: 'envelope', url: '#' }
    ]
  }
];

@Component({
  selector: 'app-intro-team',
  imports: [
    SectionHeaderComponent,
    TeamCardComponent,
    SkeletonComponent
  ],
  templateUrl: './intro-team.component.html',
  styles: ``
})
export class IntroTeamComponent implements OnInit {

  protected leaders = signal<any>(undefined);
  protected members = signal<any>(undefined);

  constructor() {}

  ngOnInit(): void {
    of(LOCAL_MEMBERS).pipe(
      delay(2000),
      tap(members => {
        const grouped = groupBy(members, m => m.group);
        this.leaders.set(grouped['leader']);
        this.members.set(grouped['member']);
      })
    ).subscribe();
  }
}
