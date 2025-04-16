import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { HealthHorizontService } from '../../rest/api/health.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent implements OnInit {

  protected environment?: string;

  constructor(private healthService: HealthHorizontService) { }
  
  ngOnInit(): void {
    this.healthService.getEnvironment().pipe(
      tap(env => this.environment = env.value)
    ).subscribe();
  }
}
