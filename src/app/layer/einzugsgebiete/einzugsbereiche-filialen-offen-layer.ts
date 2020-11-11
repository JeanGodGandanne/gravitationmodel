import FeatureLayer from '../shared/feature-layer';
import EinzugsbereicheFeatureStyle from './einzugsbereiche-feature-style';
import {HttpClient} from '@angular/common/http';
import VectorLayer from 'ol/layer/Vector';
import {EzbService} from './ezb.service';

/**
 * Layer implementation for Filiale Offen Einzugsbereiche based on OL VectorTileLayer
 */
export default class EinzugsbereicheFilialenOffenLayer extends FeatureLayer {

  // private readonly ezbFeatureLayerStyle: EinzugsbereicheFeatureStyle = new EinzugsbereicheFeatureStyle('rgba(253, 229, 147, 0.1)');
  private readonly ezbFeatureLayerStyle: EinzugsbereicheFeatureStyle = new EinzugsbereicheFeatureStyle('#FDE593');

  constructor(http: HttpClient) {
    super(http);
    this.createLayer();
  }

  private createLayer(): void {
    const layer = new VectorLayer({
      visible: true,
      zIndex: 3
    });

    const source = this.createVectorSource(''); // do not load smaller tiles to prevent many requests, assuming there is no more detail
    layer.setSource(source);

    layer.setStyle(this.ezbFeatureLayerStyle.getStyleFunction());
    layer.set('name', 'einzugsbereich');
    this._layer = layer;
  }
}
