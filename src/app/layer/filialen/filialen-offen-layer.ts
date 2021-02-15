import FeatureLayer from '../shared/feature-layer';
import {HttpClient} from '@angular/common/http';
import VectorImageLayer from 'ol/layer/VectorImage';
import FilialeFeatureStyle from './filiale-feature-style';
import {FeatureService} from '../einzugsgebiete/feature.service';
import {ObjectWindowService} from '../../object-window/object-window.service';

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

    // will load more data (of multiple tiles) at once and reduce requests, e.g. 2028 = at zoom level 10 the data from level 7
    const grid = this.createTileGrid(2048,
        10);  // up to zoom level 10 to prevent many requests below
    const source = this.createVectorSource();
    layer.setSource(source);

    layer.setVisible(true);
    layer.setStyle(this.featureStyle.getStyleFunction());
    layer.set('name', 'filialenLayer');
    this._layer = layer;
  }
}
