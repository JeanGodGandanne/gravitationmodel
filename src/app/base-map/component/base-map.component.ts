import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BaseMapService} from '../base-map.service';
import FilialenOffenLayer from '../../layer/filialen/filialen-offen-layer';
import {HttpClient} from '@angular/common/http';
import EinzugsbereicheFilialenOffenLayer from '../../layer/einzugsgebiete/einzugsbereiche-filialen-offen-layer';
import {SelectFeatureService} from '../select-feature.service';

@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // OL will take care of updates
})
export class BaseMapComponent implements AfterViewInit {

  @Input()
  public baseMapId: string;

  constructor(private readonly baseMapService: BaseMapService,
              private readonly selectFeatureService: SelectFeatureService,
              private readonly http: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.baseMapService.createBaseMap(this.baseMapId);
    const selectableLayers = [];
    const filialLayer = new FilialenOffenLayer(this.http).layer;

    selectableLayers.push(filialLayer);
    this.baseMapService.addLayer(filialLayer);
    // this.baseMapService.addLayer(new EinzugsbereicheFilialenOffenLayer(this.http).layer);

    this.selectFeatureService.createLayerInteractionSelect(selectableLayers, null);
    this.baseMapService.addInteraction(this.selectFeatureService.layerInteractionSelect);
  }

}
