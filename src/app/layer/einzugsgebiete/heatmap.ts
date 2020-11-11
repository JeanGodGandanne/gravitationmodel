import FeatureLayer from '../shared/feature-layer';
import EinzugsbereicheFeatureStyle from './einzugsbereiche-feature-style';
import {HttpClient} from '@angular/common/http';
import VectorLayer from 'ol/layer/Vector';
import {EzbService} from './ezb.service';
import Heatmap from 'ol/layer/Heatmap';

/**
 * Layer implementation for Filiale Offen Einzugsbereiche based on OL VectorTileLayer
 */
export default class HeatmapLayer extends FeatureLayer {

  private readonly ezbFeatureLayerStyle: EinzugsbereicheFeatureStyle = new EinzugsbereicheFeatureStyle('rgba(52, 164, 235, 0.7)');

  constructor(http: HttpClient) {
    super(http);
    this.createLayer();
  }

  private createLayer(): void {
    const layer = new Heatmap({
      visible: true,
      zIndex: 4,
      radius: 20,
      blur: 20,
      weight: 'weight'
    });

    const source = this.createVectorSource('../assets/map.json'); // do not load smaller tiles to prevent many requests, assuming there is no more detail
    layer.setSource(source);

    layer.setStyle(this.ezbFeatureLayerStyle.getStyleFunction());
    layer.set('name', 'heatmapLayer');
    this._layer = layer;
  }
}
