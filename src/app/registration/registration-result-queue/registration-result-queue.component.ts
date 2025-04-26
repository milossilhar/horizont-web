import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-registration-result-queue',
  imports: [
    CardModule, MessageModule
  ],
  templateUrl: './registration-result-queue.component.html',
  styles: ``
})
export class RegistrationResultQueueComponent {

}
