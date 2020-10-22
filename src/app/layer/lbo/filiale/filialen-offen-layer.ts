import FeatureLayer from '../../shared/feature-layer';
import { HttpClient } from '@angular/common/http';
import VectorImageLayer from 'ol/layer/VectorImage';
import FilialeFeatureStyle from './filiale-feature-style';
import { LayerIdentifier } from '../../model/layer-identifier';
import { environment } from '../../../../../environments/environment';
import { layersConfig } from '../../../../config/layer-config';
import { LayerManagerFacade } from '../../../../store/layer-manager/layer-manager.facade';

/**
 * Layer implementation for Filiale Offen based on OL VectorImageLayer
 */
export default class FilialenOffenLayer extends FeatureLayer {

  private readonly featureStyle: FilialeFeatureStyle = new FilialeFeatureStyle(layersConfig[LayerIdentifier.FILIALEN_OFFEN].color, layersConfig[LayerIdentifier.FILIALEN_OFFEN].text_color);

  constructor(http: HttpClient, private layerManagerFacade: LayerManagerFacade) {
    super(http);
    this.createLayer();
    this.layerManagerFacade.getLayerConfig$(LayerIdentifier.FILIALEN_OFFEN).subscribe((config) => {
      this._layer.setVisible(config.visible);
      this._layer.setZIndex(config.zIndex)
    })
  }

  private createLayer(): void {
    const layer = new VectorImageLayer({// so much faster while panning than: VectorLayer
      visible: false,
      imageRatio: 2 // render more than the viewport so panning does not trigger rendering
    });

    const grid = this.createTileGrid(2048, // will load more data (of multiple tiles) at once and reduce requests, e.g. 2028 = at zoom level 10 the data from level 7
      10);  // up to zoom level 10 to prevent many requests below
    const source = this.createVectorSource(environment.layer_features_endpoint_base + LayerIdentifier.FILIALEN_OFFEN, grid);
    layer.setSource(source);

    layer.setMinZoom(layersConfig[LayerIdentifier.FILIALEN_OFFEN].minZoom);
    layer.setStyle(this.featureStyle.getStyleFunction());
    layer.set(FeatureLayer.LAYER_NAME_PROPERTY, LayerIdentifier.FILIALEN_OFFEN);
    this._layer = layer;
  }
}
