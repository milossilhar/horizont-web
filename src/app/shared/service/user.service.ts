import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, tap } from 'rxjs';

interface User {
  username: string;
  name: string;
  surname: string;
  email: string;
  roles: string[];
  pictureHref: string;
}

const LOCAL_USERS: Array<User> = [{
    username: 'melis',
    name: 'Mela',
    surname: 'Váleková',
    email: 'test@test.com',
    roles: ['ADMIN', 'TRAINER'],
    pictureHref: 'https://picsum.photos/id/64/300'
  }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users: Array<User> = [];
  private _users$ = new ReplaySubject<Array<User>>(1);

  private set users(users: Array<User>) {
    this._users = users;
    this._users$.next(users);
  }

  constructor() {}

  public init(): Observable<boolean> {
    return of(LOCAL_USERS).pipe(
      tap(users => this.users = users),
      map(() => true)
    );
  }

  public get trainers() {
    return this._users$.asObservable().pipe(
      map(users => users.filter(u => u.roles.includes('TRAINER')))
    );
  }
}
