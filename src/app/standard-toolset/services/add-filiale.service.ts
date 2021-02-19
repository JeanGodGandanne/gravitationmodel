import {Injectable} from '@angular/core';
import {BaseMapService} from '../../base-map/base-map.service';
import {Draw} from 'ol/interaction';
import Feature from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';
import VectorLayer from 'ol/layer/Vector';
import {POI_INTERACTION_STYLE} from '../../layer/filialen/add-filiale.style';
import AddFilialeLayer from '../../layer/filialen/add-filiale-layer';
import {FeatureService} from '../../layer/einzugsgebiete/feature.service';

@Injectable({
  providedIn: 'root'
})
export class AddFilialeService {
  private tempFilialeLayer: VectorLayer;
  private drawInteraction: Draw;
  private filiale: Feature;

  constructor(
      private baseMapService: BaseMapService,
      private featureService: FeatureService) {
    this.tempFilialeLayer = new AddFilialeLayer().layer;
  }

  public activateAddFiliale(): void {
    this.baseMapService.addLayer(this.tempFilialeLayer);
    this.baseMapService.changeSelectInteractionActiveState(false);
    this.addDrawInteraction();
  }

  public deactivateAddFiliale(): void {
    this.baseMapService.removeInteraction(this.drawInteraction);
    this.baseMapService.removeLayer(this.tempFilialeLayer);
    this.baseMapService.changeSelectInteractionActiveState(true);
  }

  private addDrawInteraction(): void {
    this.drawInteraction = new Draw({
      type: GeometryType.POINT,
      source: this.tempFilialeLayer.getSource(),
      style: POI_INTERACTION_STYLE
    });

    this.drawInteraction.on('drawend', (drawEndEvent) => {
      const feature = drawEndEvent.feature;

      // new feature needs an new ID or OL Fails with https://openlayers.org/en/v6.3.1/doc/errors/#30
      feature.setId(new Date().getTime());
      this.filiale = feature;
      this.featureService.addFiliale(this.filiale);
      this.deactivateAddFiliale();
    });
    this.baseMapService.addInteraction(this.drawInteraction);
  }
}
