import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MustacheService {

  constructor() { }

  public render(msg: string, data: any) {
    return Object.keys(data).reduce((msg, key) => this.replaceKey(msg, key, data[key]), msg);
  }

  private replaceKey(msg: string, key: string, value: string) {
    return msg.replace(`{{${key}}}`, value);
  }
}
