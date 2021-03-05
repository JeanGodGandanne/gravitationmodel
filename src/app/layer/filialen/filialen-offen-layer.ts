import FeatureLayer from '../shared/feature-layer';
import {HttpClient} from '@angular/common/http';
import VectorImageLayer from 'ol/layer/VectorImage';
import FilialeFeatureStyle from './filiale-feature-style';
import {LayerIdentifier} from '../model/layer-identifier';

/**
 * Layer implementation for Filiale Offen based on OL VectorImageLayer
 */
export default class FilialenOffenLayer extends FeatureLayer {

  private readonly featureStyle: FilialeFeatureStyle = new FilialeFeatureStyle('673ab7', 'FFFFFF');

  constructor(http: HttpClient) {
    super(http);
    this.createLayer();
  }

  private createLayer(): void {
    const layer = new VectorImageLayer({// so much faster while panning than: VectorLayer
      visible: true,
      zIndex: 10,
      imageRatio: 2 // render more than the viewport so panning does not trigger rendering
    });

    const source = this.createVectorSource();
    layer.setSource(source);

    layer.setVisible(true);
    layer.setStyle(this.featureStyle.getStyleFunction());
    layer.set('name', LayerIdentifier.FILIALEN);
    this._layer = layer;
  }
}
