import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BaseMapService} from '../base-map.service';
import FilialenOffenLayer from '../../layer/filialen/filialen-offen-layer';
import {HttpClient} from '@angular/common/http';
import {SelectFeatureService} from '../select-feature.service';
import {FeatureService} from '../../layer/einzugsgebiete/feature.service';
import EinzugsbereicheLayer from '../../layer/einzugsgebiete/einzugsbereiche-layer';

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

    const zensusgebieteLayer = new EinzugsbereicheLayer(this.http).layer;
    selectableLayers.push(zensusgebieteLayer);
    this.baseMapService.addLayer(zensusgebieteLayer);

    this.ezbService.drawZensusGebiete();
    this.ezbService.drawFilialen();

    this.selectFeatureService.createLayerInteractionSelect(selectableLayers, null);
    this.baseMapService.addInteraction(this.selectFeatureService.layerInteractionSelect);
  }

}
