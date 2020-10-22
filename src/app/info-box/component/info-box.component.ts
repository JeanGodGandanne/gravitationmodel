import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {InfoBoxService, InfoBoxState} from '../service/info-box.service';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
  animations: [
    // tob-bar animation
    trigger('slideInOut', [
      state('closed', style({transform: 'translateX(0%)'})),
      state('open', style({transform: 'translateX(297px)'})),
      transition('open => closed', [
        animate('200ms ease-in')
      ]),
      transition('closed => open', [
        animate('200ms ease-out')
      ])
    ]),
  ]
})
export class InfoBoxComponent implements OnInit {
  @HostBinding('@slideInOut') get infoBoxState(): string {
    return this.infoBoxService.infoBoxCurrentState;
  }

  constructor(public infoBoxService: InfoBoxService) { }

  ngOnInit(): void {
  }

  switchInfoBoxState(): void {
    this.infoBoxService.isInfoBoxVisible = !this.infoBoxService.isInfoBoxVisible;
    this.infoBoxService.infoBoxCurrentState === InfoBoxState.OPEN ?
        this.infoBoxService.infoBoxCurrentState = InfoBoxState.CLOSED :
        this.infoBoxService.infoBoxCurrentState = InfoBoxState.OPEN;
  }

}
