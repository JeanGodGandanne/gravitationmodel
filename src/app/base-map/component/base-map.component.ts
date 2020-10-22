import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BaseMapService} from '../base-map.service';

@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // OL will take care of updates
})
export class BaseMapComponent implements AfterViewInit {

  @Input()
  public baseMapId: string;

  constructor(private readonly baseMapService: BaseMapService) {
  }

  ngAfterViewInit(): void {
    this.baseMapService.createBaseMap(this.baseMapId);
  }

}
