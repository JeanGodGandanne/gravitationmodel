import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BaseMapService} from '../base-map.service';
import FilialenOffenLayer from '../../layer/filialen/filialen-offen-layer';
import {HttpClient} from '@angular/common/http';
import EinzugsbereicheFilialenOffenLayer from '../../layer/einzugsgebiete/einzugsbereiche-filialen-offen-layer';
import {SelectFeatureService} from '../select-feature.service';
import {FeatureService} from '../../layer/einzugsgebiete/feature.service';
import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import EinzugsbereicheLayer from '../../layer/einzugsgebiete/einzugsbereiche-layer';
import HeatmapLayer from '../../layer/einzugsgebiete/heatmap';
import {ObjectWindowService} from '../../object-window/object-window.service';

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
              private readonly ezbService: FeatureService) {
  }

  ngAfterViewInit(): void {
    this.baseMapService.createBaseMap(this.baseMapId);
    const selectableLayers = [];

    const filialLayer = new FilialenOffenLayer(this.http).layer;
    selectableLayers.push(filialLayer);
    this.baseMapService.addLayer(filialLayer);

    // const einzugsbereichLayer = new EinzugsbereicheFilialenOffenLayer(this.http).layer;
    // selectableLayers.push(einzugsbereichLayer);
    // this.baseMapService.addLayer(einzugsbereichLayer);

    const zensusgebieteLayer = new EinzugsbereicheLayer(this.http).layer;
    selectableLayers.push(zensusgebieteLayer);
    this.baseMapService.addLayer(zensusgebieteLayer);

    // const heatmapLayer = new HeatmapLayer(this.http).layer;
    // selectableLayers.push(heatmapLayer);
    // this.baseMapService.addLayer(heatmapLayer);

    this.ezbService.drawZensusGebiete();
    this.ezbService.drawFilialen();
    // this.ezbService.drawEZB();

    this.selectFeatureService.createLayerInteractionSelect(selectableLayers, null);
    this.baseMapService.addInteraction(this.selectFeatureService.layerInteractionSelect);
  }

}
