import FeatureLayer from '../shared/feature-layer';
import EinzugsbereicheFeatureStyle from './einzugsbereiche-feature-style';
import {HttpClient} from '@angular/common/http';
import VectorLayer from 'ol/layer/Vector';
import {FeatureService} from './feature.service';
import VectorImageLayer from 'ol/layer/VectorImage';

/**
 * Layer implementation for Filiale Offen Einzugsbereiche based on OL VectorTileLayer
 */
export default class EinzugsbereicheLayer extends FeatureLayer {

  private readonly ezbFeatureLayerStyle: EinzugsbereicheFeatureStyle = new EinzugsbereicheFeatureStyle('rgba(52, 164, 235, 0.5)');

  constructor(http: HttpClient) {
    super(http);
    this.createLayer();
  }

  private createLayer(): void {
    const layer = new VectorImageLayer({
      visible: true,
      zIndex: 1,
      imageRatio: 2
    });

    const grid = this.createTileGrid(2048,
        10);
    const source = this.createVectorSource(); // do not load smaller tiles to prevent many requests, assuming there is no more detail
    layer.setSource(source);

    layer.setVisible(true);
    layer.setStyle(this.ezbFeatureLayerStyle.getStyleFunction());
    layer.set('name', 'zensusgebieteLayer');
    this._layer = layer;
  }
}
