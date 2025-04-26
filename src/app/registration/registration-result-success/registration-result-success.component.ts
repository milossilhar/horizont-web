import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-registration-result-success',
  imports: [ CardModule, MessageModule ],
  templateUrl: './registration-result-success.component.html',
  styles: ``
})
export class RegistrationResultSuccessComponent {

}
