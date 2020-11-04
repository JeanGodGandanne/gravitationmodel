import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BaseMapService} from '../base-map.service';
import FilialenOffenLayer from '../../layer/filialen/filialen-offen-layer';
import {HttpClient} from '@angular/common/http';
import EinzugsbereicheFilialenOffenLayer from '../../layer/einzugsgebiete/einzugsbereiche-filialen-offen-layer';
import {SelectFeatureService} from '../select-feature.service';
import {EzbService} from '../../layer/einzugsgebiete/ezb.service';
import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';

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
              private readonly http: HttpClient,
              private readonly ezbService: EzbService) {
  }

  ngAfterViewInit(): void {
    this.baseMapService.createBaseMap(this.baseMapId);
    const selectableLayers = [];

    const filialLayer = new FilialenOffenLayer(this.http).layer;
    selectableLayers.push(filialLayer);
    this.baseMapService.addLayer(filialLayer);

    const einzugsbereichLayer = new EinzugsbereicheFilialenOffenLayer(this.http).layer;
    selectableLayers.push(einzugsbereichLayer);
    this.baseMapService.addLayer(einzugsbereichLayer);

    this.ezbService.drawEZB();

    this.selectFeatureService.createLayerInteractionSelect(selectableLayers, null);
    this.baseMapService.addInteraction(this.selectFeatureService.layerInteractionSelect);
  }

}
