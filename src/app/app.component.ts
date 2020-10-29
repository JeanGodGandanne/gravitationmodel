import { Component } from '@angular/core';
import {ObjectWindowService} from './object-window/object-window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Masterarbeit';

  constructor(public objectWindowService: ObjectWindowService) {
  }
}
