import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { SidePanelComponent } from '../side-panel/side-panel.component';

@Component({
  selector: 'app-sidebar-layout',
  imports: [
    ButtonModule,
    SidePanelComponent,
    RouterOutlet
  ],
  templateUrl: './sidebar-layout.component.html',
  styles: ``
})
export class SidebarLayoutComponent {
  protected collapsed= false;

  protected toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}
